import React from 'react';
import { Clock, CheckCircle2, LayoutGrid } from 'lucide-react';
import type { SessionId } from '../types';

interface TimerBarProps {
  currentSession: SessionId;
  timeLeftSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  themeColor: string;
  timerMode?: 'accumulated' | 'per_session';
  onOpenNavigator: () => void;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  currentSession,
  timeLeftSeconds,
  totalQuestions,
  answeredCount,
  themeColor,
  timerMode = 'accumulated',
  onOpenNavigator,
}) => {
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const isWarning = timeLeftSeconds <= 60 && timeLeftSeconds > 0;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="sticky-timer-wrapper">
      <div className="sticky-timer-content">
        {/* Session badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              backgroundColor: themeColor,
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 14,
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
            }}
          >
            Sesi {currentSession} / 3
          </span>

          {timerMode === 'accumulated' && currentSession > 1 && (
            <span
              style={{
                fontSize: 11,
                color: '#0f9d58',
                background: '#e6f4ea',
                padding: '2px 8px',
                borderRadius: 10,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
              title="Waktu sisa dari sesi sebelumnya diakumulasikan ke sesi ini"
            >
              Akumulasi Waktu
            </span>
          )}

          <button
            onClick={onOpenNavigator}
            className="btn-gform btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              height: 30,
              gap: 4,
              borderColor: '#dadce0',
            }}
            title="Buka Daftar Nomor Soal"
          >
            <LayoutGrid size={14} />
            <span style={{ display: 'inline' }}>Navigasi</span>
          </button>
        </div>

        {/* Timer Badge */}
        <div
          className={`timer-badge ${isWarning ? 'warning' : ''}`}
          style={!isWarning ? { color: themeColor, background: '#ede7f6' } : {}}
        >
          <Clock size={16} />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Progress Info */}
        <div className="progress-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={15} color={themeColor} />
            <span>
              <strong>{answeredCount}</strong>/{totalQuestions}
            </span>
          </div>

          <div className="progress-bar-bg" title={`${progressPercent}% Terjawab`}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: themeColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
