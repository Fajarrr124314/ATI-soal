import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { TestSubmission } from '../types';

let cachedClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const targetUrl = url || import.meta.env.VITE_SUPABASE_URL || '';
  const targetKey = key || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (!targetUrl || !targetKey) {
    return null;
  }

  if (cachedClient && currentUrl === targetUrl && currentKey === targetKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(targetUrl, targetKey);
    currentUrl = targetUrl;
    currentKey = targetKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to init Supabase client:', err);
    return null;
  }
}

export async function saveSubmissionToSupabase(
  sub: TestSubmission,
  url?: string,
  key?: string
): Promise<boolean> {
  const client = getSupabaseClient(url, key);
  if (!client) return false;

  try {
    const payload = {
      id: sub.id,
      participant_name: sub.participant.name,
      participant_number: sub.participant.participantNumber,
      institution: sub.participant.institution || '',
      submitted_at: sub.submittedAt,
      duration_seconds_used: sub.durationSecondsUsed,
      session1_score: sub.session1.scorePercentage,
      session1_correct: sub.session1.correctCount,
      session1_total: sub.session1.totalQuestions,
      session2_score: sub.session2.scorePercentage,
      session2_correct: sub.session2.correctCount,
      session2_total: sub.session2.totalQuestions,
      session3_score: sub.session3.scorePercentage,
      session3_correct: sub.session3.correctCount,
      session3_total: sub.session3.totalQuestions,
      total_score: sub.totalScorePercentage,
      total_correct: sub.totalCorrect,
      total_questions: sub.totalQuestions,
      answers_json: {
        session1: sub.session1.answers,
        session2: sub.session2.answers,
        session3: sub.session3.answers,
      },
    };

    const { error } = await client.from('submissions').insert([payload]);
    if (error) {
      console.error('Supabase insert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase error:', err);
    return false;
  }
}

export async function fetchSubmissionsFromSupabase(
  url?: string,
  key?: string
): Promise<TestSubmission[] | null> {
  const client = getSupabaseClient(url, key);
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch error:', error?.message);
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      participant: {
        name: row.participant_name,
        participantNumber: row.participant_number,
        institution: row.institution,
        startedAt: row.submitted_at,
      },
      submittedAt: row.submitted_at,
      durationSecondsUsed: row.duration_seconds_used,
      session1: {
        session: 1,
        totalQuestions: row.session1_total,
        answeredCount: Object.keys(row.answers_json?.session1 || {}).length,
        correctCount: row.session1_correct,
        scorePercentage: row.session1_score,
        answers: row.answers_json?.session1 || {},
      },
      session2: {
        session: 2,
        totalQuestions: row.session2_total,
        answeredCount: Object.keys(row.answers_json?.session2 || {}).length,
        correctCount: row.session2_correct,
        scorePercentage: row.session2_score,
        answers: row.answers_json?.session2 || {},
      },
      session3: {
        session: 3,
        totalQuestions: row.session3_total,
        answeredCount: Object.keys(row.answers_json?.session3 || {}).length,
        correctCount: row.session3_correct,
        scorePercentage: row.session3_score,
        answers: row.answers_json?.session3 || {},
      },
      totalScorePercentage: row.total_score,
      totalCorrect: row.total_correct,
      totalQuestions: row.total_questions,
    }));
  } catch (err) {
    console.error('Supabase fetch error:', err);
    return null;
  }
}
