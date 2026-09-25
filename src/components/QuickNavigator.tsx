import React, { useState } from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import type { QuestionItem } from '../types';

interface QuickNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  answers: Record<number, string>;
  themeColor: string;
  onJumpToQuestion: (id: number) => void;
}

export const QuickNavigator: React.FC<QuickNavigatorProps> = ({
  isOpen,
  onClose,
  questions,
  answers,
  themeColor,
  onJumpToQuestion,
}) => {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');

  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).length;
  const total = questions.length;

  const filteredQuestions = questions.filter((q) => {
    const isAnswered = !!answers[q.id];
    if (filter === 'answered') return isAnswered;
    if (filter === 'unanswered') return !isAnswered;
    return true;
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="gform-card"
        style={{
          width: '100%',
          maxWidth: 520,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #dadce0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Navigasi Cepat Soal
            </h3>
            <p style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>
              {answeredCount} dari {total} soal telah terisi ({Math.round((answeredCount / total) * 100)}%)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#5f6368',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: '10px 20px',
            background: '#f8f9fa',
            borderBottom: '1px solid #eeeeee',
          }}
        >
          <button
            className="btn-gform"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              backgroundColor: filter === 'all' ? themeColor : '#ffffff',
              color: filter === 'all' ? '#ffffff' : '#333333',
              border: '1px solid #dadce0',
            }}
            onClick={() => setFilter('all')}
          >
            Semua ({total})
          </button>
          <button
            className="btn-gform"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              backgroundColor: filter === 'unanswered' ? themeColor : '#ffffff',
              color: filter === 'unanswered' ? '#ffffff' : '#d93025',
              border: '1px solid #dadce0',
            }}
            onClick={() => setFilter('unanswered')}
          >
            <Circle size={12} /> Belum ({total - answeredCount})
          </button>
          <button
            className="btn-gform"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              backgroundColor: filter === 'answered' ? themeColor : '#ffffff',
              color: filter === 'answered' ? '#ffffff' : '#0f9d58',
              border: '1px solid #dadce0',
            }}
            onClick={() => setFilter('answered')}
          >
            <CheckCircle2 size={12} /> Terisi ({answeredCount})
          </button>
        </div>

        {/* Grid Nomor Soal */}
        <div className="nav-grid" style={{ padding: 16, maxHeight: '50vh' }}>
          {filteredQuestions.map((q) => {
            const isAnswered = !!answers[q.id];
            return (
              <button
                key={q.id}
                className={`nav-grid-btn ${isAnswered ? 'answered' : ''}`}
                style={
                  isAnswered
                    ? { backgroundColor: themeColor, borderColor: themeColor }
                    : {}
                }
                onClick={() => {
                  onJumpToQuestion(q.id);
                  onClose();
                }}
                title={`Soal #${q.id}: ${isAnswered ? `Jawaban [${answers[q.id]}]` : 'Belum dijawab'}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #dadce0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: '#5f6368',
            background: '#fafafa',
          }}
        >
          <span>Klik nomor untuk langsung lompat ke soal</span>
          <button
            onClick={onClose}
            className="btn-gform btn-primary"
            style={{ backgroundColor: themeColor, padding: '6px 14px', fontSize: 13 }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
