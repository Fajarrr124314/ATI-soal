import type { FormSettings, TestSubmission } from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_ANSWER_KEYS_SESI_1,
  DEFAULT_ANSWER_KEYS_SESI_2,
  DEFAULT_ANSWER_KEYS_SESI_3,
} from '../data/defaultConfig';
import {
  saveSubmissionToSupabase,
  deleteSubmissionFromSupabase,
  clearAllSubmissionsFromSupabase,
} from './supabase';
import * as XLSX from 'xlsx';

const SETTINGS_KEY = 'ati_form_settings_v2';
const KEYS_1_KEY = 'ati_answer_keys_sesi_1_v1';
const KEYS_2_KEY = 'ati_answer_keys_sesi_2_v1';
const KEYS_3_KEY = 'ati_answer_keys_sesi_3_v2';
const SUBMISSIONS_KEY = 'ati_submissions_v1';
const DELETED_IDS_KEY = 'ati_deleted_submissions_v1';
const CLEAR_TIMESTAMP_KEY = 'ati_cleared_at_v1';

export function loadSettings(): FormSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      sessions: {
        ...DEFAULT_SETTINGS.sessions,
        ...(parsed.sessions || {}),
        3: {
          ...DEFAULT_SETTINGS.sessions[3],
          ...(parsed.sessions?.[3] || {}),
          totalQuestions: 150,
          shuffleQuestions: false,
        },
      },
      supabaseUrl: parsed.supabaseUrl || DEFAULT_SETTINGS.supabaseUrl,
      supabaseAnonKey: parsed.supabaseAnonKey || DEFAULT_SETTINGS.supabaseAnonKey,
      timerMode: parsed.timerMode || DEFAULT_SETTINGS.timerMode,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: FormSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadAnswerKeys(): {
  1: Record<number, string>;
  2: Record<number, string>;
  3: Record<number, string>;
} {
  const parseOr = (key: string, fallback: Record<number, string>) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    1: parseOr(KEYS_1_KEY, DEFAULT_ANSWER_KEYS_SESI_1),
    2: parseOr(KEYS_2_KEY, DEFAULT_ANSWER_KEYS_SESI_2),
    3: parseOr(KEYS_3_KEY, DEFAULT_ANSWER_KEYS_SESI_3),
  };
}

export function saveAnswerKeys(session: 1 | 2 | 3, keys: Record<number, string>): void {
  const k = session === 1 ? KEYS_1_KEY : session === 2 ? KEYS_2_KEY : KEYS_3_KEY;
  try {
    localStorage.setItem(k, JSON.stringify(keys));
  } catch (e) {
    console.error('Failed to save answer keys:', e);
  }
}

export function resetAnswerKeys(): {
  1: Record<number, string>;
  2: Record<number, string>;
  3: Record<number, string>;
} {
  localStorage.removeItem(KEYS_1_KEY);
  localStorage.removeItem(KEYS_2_KEY);
  localStorage.removeItem(KEYS_3_KEY);
  return {
    1: { ...DEFAULT_ANSWER_KEYS_SESI_1 },
    2: { ...DEFAULT_ANSWER_KEYS_SESI_2 },
    3: { ...DEFAULT_ANSWER_KEYS_SESI_3 },
  };
}

export function getDeletedSubmissionIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markSubmissionAsDeleted(id: string): void {
  try {
    const set = getDeletedSubmissionIds();
    set.add(id);
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to mark submission as deleted:', e);
  }
}

export function getClearTimestamp(): number {
  try {
    const raw = localStorage.getItem(CLEAR_TIMESTAMP_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function loadSubmissions(): TestSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) return [];
    const list: TestSubmission[] = JSON.parse(raw);
    const deletedIds = getDeletedSubmissionIds();
    const clearTs = getClearTimestamp();
    return list.filter((s) => {
      if (deletedIds.has(s.id)) return false;
      if (clearTs && new Date(s.submittedAt).getTime() <= clearTs) return false;
      return true;
    });
  } catch {
    return [];
  }
}

export async function addSubmission(
  sub: TestSubmission,
  settings: FormSettings
): Promise<void> {
  const list = loadSubmissions();
  list.unshift(sub);
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save submission locally:', e);
  }

  // Attempt sync to Supabase if configured
  if (settings.supabaseUrl && settings.supabaseAnonKey) {
    try {
      await saveSubmissionToSupabase(sub, settings.supabaseUrl, settings.supabaseAnonKey);
    } catch (err) {
      console.warn('Could not sync to Supabase:', err);
    }
  }
}

export async function deleteSubmission(
  id: string,
  settings?: FormSettings
): Promise<TestSubmission[]> {
  markSubmissionAsDeleted(id);
  const list = loadSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));

  const url = settings?.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
  const key = settings?.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      await deleteSubmissionFromSupabase(id, url, key);
    } catch (err) {
      console.warn('Could not delete from Supabase:', err);
    }
  }

  return list;
}

export async function clearAllSubmissions(settings?: FormSettings): Promise<void> {
  const current = loadSubmissions();
  for (const s of current) {
    markSubmissionAsDeleted(s.id);
  }
  localStorage.setItem(CLEAR_TIMESTAMP_KEY, Date.now().toString());
  localStorage.removeItem(SUBMISSIONS_KEY);

  const url = settings?.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
  const key = settings?.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      await clearAllSubmissionsFromSupabase(url, key);
    } catch (err) {
      console.warn('Could not clear all from Supabase:', err);
    }
  }
}

// Export responses to Excel (.xlsx)
export function exportSubmissionsToExcel(submissions: TestSubmission[], formTitle: string): void {
  const rows = submissions.map((s, idx) => ({
    No: idx + 1,
    'Waktu Selesai': new Date(s.submittedAt).toLocaleString('id-ID'),
    'Nama Lengkap': s.participant.name,
    'Nomor Peserta': s.participant.participantNumber || '-',
    Instansi: s.participant.institution || '-',
    'Durasi (Menit)': (s.durationSecondsUsed / 60).toFixed(1),
    'Sesi 1 Benar': `${s.session1.correctCount} / ${s.session1.totalQuestions}`,
    'Sesi 1 Skor (%)': s.session1.scorePercentage.toFixed(1),
    'Sesi 2 Benar': `${s.session2.correctCount} / ${s.session2.totalQuestions}`,
    'Sesi 2 Skor (%)': s.session2.scorePercentage.toFixed(1),
    'Sesi 3 Benar': `${s.session3.correctCount} / ${s.session3.totalQuestions}`,
    'Sesi 3 Skor (%)': s.session3.scorePercentage.toFixed(1),
    'Total Benar': `${s.totalCorrect} / ${s.totalQuestions}`,
    'Total Skor (%)': s.totalScorePercentage.toFixed(1),
    Status: s.totalScorePercentage >= 70 ? 'LULUS / BAIK' : 'PERLU EVALUASI',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Hasil');

  const filename = `Rekap_Hasil_${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
