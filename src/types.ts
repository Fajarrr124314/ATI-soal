export type SessionId = 1 | 2 | 3;

export interface QuestionItem {
  id: number; // Nomor soal asli (1 - N)
  session: SessionId;
  prompt?: string;
  options: string[];
  key: string; // Kunci jawaban (misal "D", "B", "SS", atau multiple seperti "A/B")
}

export interface SessionConfig {
  session: SessionId;
  title: string;
  description: string;
  durationMinutes: number; // default: 5
  shuffleQuestions: boolean; // khusus sesi 3 default: true
  totalQuestions: number;
  optionsTemplate: string[];
}

export interface FormSettings {
  title: string;
  description: string;
  organization: string;
  adminPassword: string; // default: 'admin123'
  themeColor: string; // default: '#673ab7' (Google Forms purple)
  autoAdvanceOnTimeout: boolean;
  timerMode: 'accumulated' | 'per_session'; // akumulasi sisa waktu vs reset per sesi
  showScoreToUser: boolean;
  allowReviewAnswers: boolean;
  sessions: {
    1: SessionConfig;
    2: SessionConfig;
    3: SessionConfig;
  };
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface ParticipantInfo {
  name: string;
  participantNumber: string;
  institution?: string;
  startedAt: string;
}

export interface SessionResult {
  session: SessionId;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  answers: Record<number, string>; // questionId -> answer
}

export interface TestSubmission {
  id: string;
  participant: ParticipantInfo;
  submittedAt: string;
  durationSecondsUsed: number;
  session1: SessionResult;
  session2: SessionResult;
  session3: SessionResult;
  totalScorePercentage: number;
  totalCorrect: number;
  totalQuestions: number;
}
