import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { TestSubmission, FormSettings } from '../types';
import {
  CheckCircle,
  Trophy,
  RefreshCw,
  Clock,
  User,
} from 'lucide-react';

interface ResultViewProps {
  submission: TestSubmission;
  settings: FormSettings;
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  submission,
  settings,
  onRestart,
}) => {

  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
  };

  const getGradeBadge = (score: number) => {
    if (score >= 85) return { label: 'Sangat Baik (A)', color: '#0f9d58', bg: '#e6f4ea' };
    if (score >= 70) return { label: 'Baik (B)', color: '#1a73e8', bg: '#e8f0fe' };
    if (score >= 55) return { label: 'Cukup (C)', color: '#f29900', bg: '#fef7e0' };
    return { label: 'Perlu Evaluasi (D)', color: '#d93025', bg: '#fce8e6' };
  };

  const grade = getGradeBadge(submission.totalScorePercentage);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Kartu Sukses Google Form Header */}
      <div className="gform-header-card">
        <div
          className="gform-header-stripe"
          style={{ backgroundColor: settings.themeColor }}
        />
        <div className="gform-header-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#e6f4ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f9d58',
                flexShrink: 0,
              }}
            >
              <CheckCircle size={28} />
            </div>
            <div>
              <h1 className="gform-title" style={{ marginBottom: 2 }}>
                {settings.title}
              </h1>
              <p style={{ color: '#5f6368', fontSize: 14 }}>Tanggapan Anda telah berhasil direkam.</p>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              marginTop: 14,
              fontSize: 13,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              color: '#3c4043',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={15} color={settings.themeColor} />
              <span>
                Peserta: <strong>{submission.participant.name}</strong> ({submission.participant.participantNumber})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} color={settings.themeColor} />
              <span>Durasi Tes: {formatDuration(submission.durationSecondsUsed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Ringkasan Skor (Jika diizinkan admin) */}
      {settings.showScoreToUser && (
        <div className="gform-card" style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              borderBottom: '1px solid #eeeeee',
              paddingBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={24} color="#f9ab00" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700 }}>
                Hasil & Perolehan Nilai
              </h2>
            </div>
            <span
              style={{
                backgroundColor: grade.bg,
                color: grade.color,
                fontWeight: 700,
                fontSize: 13,
                padding: '4px 12px',
                borderRadius: 16,
              }}
            >
              {grade.label}
            </span>
          </div>

          {/* Big Score Hero */}
          <div
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: settings.themeColor, textTransform: 'uppercase', letterSpacing: 1 }}>
              Total Nilai Akhir
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 54,
                fontWeight: 700,
                color: settings.themeColor,
                lineHeight: 1.1,
                margin: '8px 0',
              }}
            >
              {submission.totalScorePercentage.toFixed(1)}%
            </div>
            <div style={{ fontSize: 14, color: '#5f6368' }}>
              Benar <strong>{submission.totalCorrect}</strong> dari total <strong>{submission.totalQuestions}</strong> soal
            </div>
          </div>

          {/* Breakdown Per Sesi */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {/* Sesi 1 */}
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid #dadce0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: settings.themeColor }}>Sesi 1</span>
                <span style={{ fontSize: 12, color: '#5f6368' }}>Pilihan Ganda</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0', color: '#202124' }}>
                {submission.session1.scorePercentage.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#5f6368' }}>
                Benar: {submission.session1.correctCount} / {submission.session1.totalQuestions}
              </div>
            </div>

            {/* Sesi 2 */}
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid #dadce0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: settings.themeColor }}>Sesi 2</span>
                <span style={{ fontSize: 12, color: '#5f6368' }}>Beda / Sama</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0', color: '#202124' }}>
                {submission.session2.scorePercentage.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#5f6368' }}>
                Benar: {submission.session2.correctCount} / {submission.session2.totalQuestions}
              </div>
            </div>

            {/* Sesi 3 */}
            <div
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid #dadce0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: settings.themeColor }}>Sesi 3</span>
                <span style={{ fontSize: 12, color: '#5f6368' }}>Fokus Respon (Acak)</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, margin: '8px 0', color: '#202124' }}>
                {submission.session3.scorePercentage.toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#5f6368' }}>
                Benar: {submission.session3.correctCount} / {submission.session3.totalQuestions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="bottom-action-bar" style={{ justifyContent: 'center', marginTop: 24 }}>
        <button
          onClick={onRestart}
          className="btn-gform btn-primary"
          style={{ backgroundColor: settings.themeColor, padding: '12px 28px', fontSize: 15 }}
        >
          <RefreshCw size={18} />
          <span>Kirim Tanggapan Lain / Ulangi Tes</span>
        </button>
      </div>
    </div>
  );
};
