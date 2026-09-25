import type { FormSettings, TestSubmission } from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_ANSWER_KEYS_SESI_1,
  DEFAULT_ANSWER_KEYS_SESI_2,
  DEFAULT_ANSWER_KEYS_SESI_3,
} from '../data/defaultConfig';
import { saveSubmissionToSupabase } from './supabase';
import * as XLSX from 'xlsx';

const SETTINGS_KEY = 'ati_form_settings_v1';
const KEYS_1_KEY = 'ati_answer_keys_sesi_1_v1';
const KEYS_2_KEY = 'ati_answer_keys_sesi_2_v1';
const KEYS_3_KEY = 'ati_answer_keys_sesi_3_v1';
const SUBMISSIONS_KEY = 'ati_submissions_v1';

export function loadSettings(): FormSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      supabaseUrl: parsed.supabaseUrl || DEFAULT_SETTINGS.supabaseUrl,
      supabaseAnonKey: parsed.supabaseAnonKey || DEFAULT_SETTINGS.supabaseAnonKey,
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

export function loadSubmissions(): TestSubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
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

export function deleteSubmission(id: string): TestSubmission[] {
  const list = loadSubmissions().filter((s) => s.id !== id);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list));
  return list;
}

export function clearAllSubmissions(): void {
  localStorage.removeItem(SUBMISSIONS_KEY);
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
