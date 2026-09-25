import React, { useState, useEffect, useMemo, useRef } from 'react';
import type {
  ParticipantInfo,
  FormSettings,
  SessionId,
  QuestionItem,
  TestSubmission,
  SessionResult,
} from './types';
import {
  loadSettings,
  loadAnswerKeys,
  addSubmission,
} from './services/storage';
import { buildQuestions } from './data/defaultConfig';
import { Header } from './components/Header';
import { IdentityForm } from './components/IdentityForm';
import { TimerBar } from './components/TimerBar';
import { QuestionCard } from './components/QuestionCard';
import { QuickNavigator } from './components/QuickNavigator';
import { ResultView } from './components/ResultView';
import { AdminModal } from './components/AdminModal';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  // Global configuration & keys
  const [settings, setSettings] = useState<FormSettings>(loadSettings);
  const [answerKeys, setAnswerKeys] = useState(loadAnswerKeys);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Test flow states: 0 = Identitas, 1 = Sesi 1, 2 = Sesi 2, 3 = Sesi 3, 4 = Selesai / Skor
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);

  // Answers state: session -> questionId -> answer
  const [answersSession1, setAnswersSession1] = useState<Record<number, string>>({});
  const [answersSession2, setAnswersSession2] = useState<Record<number, string>>({});
  const [answersSession3, setAnswersSession3] = useState<Record<number, string>>({});

  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalSecondsUsed, setTotalSecondsUsed] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Quick Navigator state
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Final submission result
  const [completedSubmission, setCompletedSubmission] = useState<TestSubmission | null>(null);

  // Build question lists
  const baseQuestionsS1 = useMemo(
    () => buildQuestions(1, answerKeys[1], settings.sessions[1].optionsTemplate),
    [answerKeys, settings.sessions]
  );
  const baseQuestionsS2 = useMemo(
    () => buildQuestions(2, answerKeys[2], settings.sessions[2].optionsTemplate),
    [answerKeys, settings.sessions]
  );
  const baseQuestionsS3 = useMemo(
    () => buildQuestions(3, answerKeys[3], settings.sessions[3].optionsTemplate),
    [answerKeys, settings.sessions]
  );

  // Display questions with shuffling if enabled
  const [displayQuestionsS1, setDisplayQuestionsS1] = useState<QuestionItem[]>(baseQuestionsS1);
  const [displayQuestionsS2, setDisplayQuestionsS2] = useState<QuestionItem[]>(baseQuestionsS2);
  const [displayQuestionsS3, setDisplayQuestionsS3] = useState<QuestionItem[]>(baseQuestionsS3);

  // Helper shuffle function (Fisher-Yates)
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start the test after entering identity
  const handleStartTest = (info: ParticipantInfo) => {
    setParticipant(info);
    setAnswersSession1({});
    setAnswersSession2({});
    setAnswersSession3({});
    setTotalSecondsUsed(0);

    // Prepare questions (shuffle Sesi 3 if enabled)
    setDisplayQuestionsS1(
      settings.sessions[1].shuffleQuestions ? shuffleArray(baseQuestionsS1) : baseQuestionsS1
    );
    setDisplayQuestionsS2(
      settings.sessions[2].shuffleQuestions ? shuffleArray(baseQuestionsS2) : baseQuestionsS2
    );
    setDisplayQuestionsS3(
      settings.sessions[3].shuffleQuestions ? shuffleArray(baseQuestionsS3) : baseQuestionsS3
    );

    // Initialize Timer for Sesi 1
    const s1DurationSec = settings.sessions[1].durationMinutes * 60;
    setTimeLeft(s1DurationSec);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer countdown hook
  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 3) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTotalSecondsUsed((prev) => prev + 1);
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Handle timeout
            handleSessionTimeout(currentStep as SessionId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [currentStep, settings]);

  // Handle timeout per session
  const handleSessionTimeout = (session: SessionId) => {
    if (settings.autoAdvanceOnTimeout) {
      if (session === 1) {
        alert('Waktu Sesi 1 telah habis! Beralih otomatis ke Sesi 2.');
        goToNextSession(1);
      } else if (session === 2) {
        alert('Waktu Sesi 2 telah habis! Beralih otomatis ke Sesi 3.');
        goToNextSession(2);
      } else if (session === 3) {
        alert('Waktu Sesi 3 telah habis! Menyelesaikan tes dan menghitung hasil.');
        finishTest();
      }
    } else {
      alert(`Waktu untuk Sesi ${session} telah berakhir. Silakan kumpulkan jawaban Anda.`);
    }
  };

  // Move to next session
  const goToNextSession = (fromSession: SessionId) => {
    if (fromSession === 1) {
      const s2DurationSec = settings.sessions[2].durationMinutes * 60;
      setTimeLeft(s2DurationSec);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (fromSession === 2) {
      const s3DurationSec = settings.sessions[3].durationMinutes * 60;
      setTimeLeft(s3DurationSec);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Finish and calculate score
  const finishTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate Sesi 1
    let correct1 = 0;
    for (let i = 1; i <= 20; i++) {
      const ans = answersSession1[i];
      const key = answerKeys[1][i];
      if (key && ans) {
        if (key.includes('/') ? key.split('/').includes(ans) : ans === key) {
          correct1++;
        }
      }
    }

    // Calculate Sesi 2
    let correct2 = 0;
    for (let i = 1; i <= 45; i++) {
      const ans = answersSession2[i];
      const key = answerKeys[2][i];
      if (key && ans && ans === key) {
        correct2++;
      }
    }

    // Calculate Sesi 3
    let correct3 = 0;
    for (let i = 1; i <= 157; i++) {
      const ans = answersSession3[i];
      const key = answerKeys[3][i];
      if (key && ans && ans === key) {
        correct3++;
      }
    }

    const totalCorrect = correct1 + correct2 + correct3;
    const totalQuestions = 20 + 45 + 157; // 222
    const totalPercent = (totalCorrect / totalQuestions) * 100;

    const res1: SessionResult = {
      session: 1,
      totalQuestions: 20,
      answeredCount: Object.keys(answersSession1).length,
      correctCount: correct1,
      scorePercentage: (correct1 / 20) * 100,
      answers: answersSession1,
    };

    const res2: SessionResult = {
      session: 2,
      totalQuestions: 45,
      answeredCount: Object.keys(answersSession2).length,
      correctCount: correct2,
      scorePercentage: (correct2 / 45) * 100,
      answers: answersSession2,
    };

    const res3: SessionResult = {
      session: 3,
      totalQuestions: 157,
      answeredCount: Object.keys(answersSession3).length,
      correctCount: correct3,
      scorePercentage: (correct3 / 157) * 100,
      answers: answersSession3,
    };

    const submission: TestSubmission = {
      id: 'SUB-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      participant: participant || {
        name: 'Peserta Anonim',
        participantNumber: '-',
        startedAt: new Date().toISOString(),
      },
      submittedAt: new Date().toISOString(),
      durationSecondsUsed: totalSecondsUsed,
      session1: res1,
      session2: res2,
      session3: res3,
      totalScorePercentage: totalPercent,
      totalCorrect,
      totalQuestions,
    };

    // Save locally and sync Supabase
    await addSubmission(submission, settings);
    setCompletedSubmission(submission);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setParticipant(null);
    setAnswersSession1({});
    setAnswersSession2({});
    setAnswersSession3({});
    setCompletedSubmission(null);
    setTimeLeft(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (session: SessionId, questionId: number, answer: string) => {
    if (session === 1) {
      setAnswersSession1((prev) => ({ ...prev, [questionId]: answer }));
    } else if (session === 2) {
      setAnswersSession2((prev) => ({ ...prev, [questionId]: answer }));
    } else if (session === 3) {
      setAnswersSession3((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const jumpToQuestion = (id: number) => {
    const el = document.getElementById(`question-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('active');
    }
  };

  // Helper variables for current active session questions & answers
  const currentSessionId = (currentStep >= 1 && currentStep <= 3 ? currentStep : 1) as SessionId;
  const currentQuestions =
    currentStep === 1
      ? displayQuestionsS1
      : currentStep === 2
      ? displayQuestionsS2
      : displayQuestionsS3;
  const currentAnswers =
    currentStep === 1
      ? answersSession1
      : currentStep === 2
      ? answersSession2
      : answersSession3;
  const currentAnsweredCount = Object.keys(currentAnswers).length;
  const currentTotalQuestions = currentQuestions.length;

  return (
    <div className="gform-container">
      {/* Google Forms Header Top Banner */}
      <Header
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentStep={currentStep}
      />

      {/* STEP 0: Form Identitas Peserta */}
      {currentStep === 0 && (
        <IdentityForm settings={settings} onStart={handleStartTest} />
      )}

      {/* STEP 1, 2, 3: Active Testing Sessions */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div>
          {/* Sticky Timer & Progress bar */}
          <TimerBar
            currentSession={currentSessionId}
            timeLeftSeconds={timeLeft}
            totalQuestions={currentTotalQuestions}
            answeredCount={currentAnsweredCount}
            themeColor={settings.themeColor}
            onOpenNavigator={() => setIsNavOpen(true)}
          />

          {/* Section Banner Card */}
          <div className="gform-card" style={{ marginBottom: 16 }}>
            <div
              className="gform-section-banner"
              style={{ backgroundColor: settings.themeColor }}
            >
              <span className="gform-section-badge">Bagian {currentStep + 1} dari 4</span>
              <span style={{ fontSize: 13, opacity: 0.9 }}>
                {settings.sessions[currentSessionId].durationMinutes} Menit Sesi Ini
              </span>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {settings.sessions[currentSessionId].title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {settings.sessions[currentSessionId].description}
              </p>

              {currentStep === 3 && settings.sessions[3].shuffleQuestions && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 12,
                    padding: '8px 12px',
                    borderRadius: 6,
                    backgroundColor: 'var(--primary-light)',
                    color: settings.themeColor,
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>
                    Urutan pertanyaan diacak khusus untuk melatih fokus Anda. Tetap perhatikan nomor soal dengan teliti!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* List of Question Cards */}
          <div>
            {currentQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                displayIndex={idx}
                totalQuestions={currentTotalQuestions}
                session={currentSessionId}
                selectedAnswer={currentAnswers[q.id]}
                isShuffled={settings.sessions[currentSessionId].shuffleQuestions}
                themeColor={settings.themeColor}
                onSelectAnswer={(qId, ans) => handleSelectAnswer(currentSessionId, qId, ans)}
              />
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="bottom-action-bar">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembali ke sesi sebelumnya?')) {
                    setCurrentStep((prev) => prev - 1);
                  }
                }}
                className="btn-gform btn-secondary"
              >
                <ArrowLeft size={16} />
                <span>Sesi Sebelumnya</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  const unanswered = currentTotalQuestions - currentAnsweredCount;
                  if (
                    unanswered > 0 &&
                    !confirm(`Masih ada ${unanswered} soal yang belum Anda jawab di Sesi ${currentStep}. Yakin ingin lanjut ke Sesi berikutnya?`)
                  ) {
                    return;
                  }
                  goToNextSession(currentSessionId);
                }}
                className="btn-gform btn-primary"
                style={{ backgroundColor: settings.themeColor, padding: '12px 24px', fontSize: 15 }}
              >
                <span>Lanjut ke Sesi {currentStep + 1}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const unanswered = currentTotalQuestions - currentAnsweredCount;
                  if (
                    unanswered > 0 &&
                    !confirm(`Masih ada ${unanswered} soal yang belum dijawab. Apakah Anda yakin ingin menyelesaikan tes dan melihat nilai?`)
                  ) {
                    return;
                  }
                  finishTest();
                }}
                className="btn-gform btn-primary"
                style={{
                  backgroundColor: '#0f9d58',
                  padding: '12px 28px',
                  fontSize: 15,
                  boxShadow: '0 2px 8px rgba(15, 157, 88, 0.4)',
                }}
              >
                <CheckCircle size={18} />
                <span>Kirim Jawaban &amp; Selesaikan Tes</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Halaman Hasil / Nilai */}
      {currentStep === 4 && completedSubmission && (
        <ResultView
          submission={completedSubmission}
          settings={settings}
          answerKeys={answerKeys}
          onRestart={handleRestart}
        />
      )}

      {/* Quick Question Navigator Modal */}
      <QuickNavigator
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        questions={currentQuestions}
        answers={currentAnswers}
        themeColor={settings.themeColor}
        onJumpToQuestion={jumpToQuestion}
      />

      {/* Admin Settings Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        answerKeys={answerKeys}
        onUpdateAnswerKeys={setAnswerKeys}
      />
    </div>
  );
};

export default App;
