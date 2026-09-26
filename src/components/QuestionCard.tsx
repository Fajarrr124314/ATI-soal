import React from 'react';
import type { QuestionItem, SessionId } from '../types';

interface QuestionCardProps {
  question: QuestionItem;
  displayIndex: number;
  totalQuestions: number;
  session: SessionId;
  selectedAnswer?: string;
  isShuffled: boolean;
  themeColor: string;
  onSelectAnswer: (questionId: number, answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  displayIndex,
  totalQuestions,
  session,
  selectedAnswer,
  isShuffled,
  themeColor,
  onSelectAnswer,
}) => {
  const isAnswered = !!selectedAnswer;

  const renderOptionContent = (opt: string) => {
    if (session === 2) {
      return (
        <>
          <span>{opt === 'B' ? 'Beda (B)' : 'Sama (S)'}</span>
        </>
      );
    }
    if (session === 3) {
      const descriptions: Record<string, string> = {
        SS: 'Sangat Setuju',
        S: 'Setuju',
        TS: 'Tidak Setuju',
        STS: 'Sangat Tidak Setuju',
      };
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{opt}</div>
          <div className="option-pill-sub">{descriptions[opt] || opt}</div>
        </div>
      );
    }
    // Sesi 1
    return <span>Pilihan {opt}</span>;
  };

  return (
    <div
      id={`question-card-${question.id}`}
      className={`gform-card question-card ${isAnswered ? 'active' : ''}`}
      style={{
        borderLeftColor: isAnswered ? themeColor : undefined,
        scrollMarginTop: '80px',
      }}
    >
      <div className="question-header">
        <div className="question-num-tag">
          <span
            className="question-num-badge"
            style={{
              backgroundColor: isAnswered ? themeColor : '#e8eaf6',
              color: isAnswered ? '#ffffff' : themeColor,
            }}
          >
            {question.id}
          </span>
          <span>Nomor {question.id}</span>
        </div>

        {isShuffled && (
          <span className="question-shuffled-info">
            Tampil ke-{displayIndex + 1} dari {totalQuestions}
          </span>
        )}
      </div>

      {session === 1 ? (
        // Classic Google Forms Radio Row for Sesi 1
        <div className="question-options-list">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            return (
              <div
                key={opt}
                className={`option-row ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectAnswer(question.id, opt)}
                style={{
                  backgroundColor: isSelected ? 'var(--primary-light)' : undefined,
                  borderColor: isSelected ? themeColor : undefined,
                }}
              >
                <div
                  className="option-radio-circle"
                  style={{ borderColor: isSelected ? themeColor : undefined }}
                >
                  <div
                    className="option-radio-dot"
                    style={{
                      transform: isSelected ? 'scale(1)' : 'scale(0)',
                      backgroundColor: themeColor,
                    }}
                  />
                </div>
                <div className="option-label">
                  <strong>{opt}</strong> — {renderOptionContent(opt)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Grid pill touch-buttons for Sesi 2 & Sesi 3 (Very convenient on mobile & web)
        <div className="options-pill-grid">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            return (
              <button
                type="button"
                key={opt}
                className={`option-pill ${isSelected ? 'selected' : ''}`}
                style={
                  isSelected
                    ? {
                        backgroundColor: themeColor,
                        borderColor: themeColor,
                        color: '#ffffff',
                      }
                    : {}
                }
                onClick={() => onSelectAnswer(question.id, opt)}
              >
                {renderOptionContent(opt)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
