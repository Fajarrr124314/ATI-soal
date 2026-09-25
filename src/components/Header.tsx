import React from 'react';
import type { FormSettings } from '../types';
import { Settings, ShieldCheck, Clock, FileCheck } from 'lucide-react';

interface HeaderProps {
  settings: FormSettings;
  onOpenAdmin: () => void;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({ settings, onOpenAdmin, currentStep }) => {
  return (
    <div className="gform-header-card">
      <div
        className="gform-header-stripe"
        style={{ backgroundColor: settings.themeColor }}
      />
      <div className="gform-header-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <div className="gform-org-badge">
              <ShieldCheck size={15} />
              <span>{settings.organization}</span>
            </div>
            <h1 className="gform-title">{settings.title}</h1>
          </div>

          {(currentStep === 0 || currentStep === 4) && (
            <button
              onClick={onOpenAdmin}
              title="Akses Pengaturan Admin"
              style={{
                background: '#ffffff',
                border: '1px solid #dadce0',
                borderRadius: '6px',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                color: '#5f6368',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f3f4')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              <Settings size={14} />
              <span>Admin</span>
            </button>
          )}
        </div>

        <p className="gform-description">{settings.description}</p>

        {currentStep === 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid #eeeeee',
              fontSize: 13,
              color: '#5f6368',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} color={settings.themeColor} />
              <span>
                Total Durasi:{' '}
                <strong>
                  {settings.sessions[1].durationMinutes +
                    settings.sessions[2].durationMinutes +
                    settings.sessions[3].durationMinutes}{' '}
                  Menit
                </strong>{' '}
                (3 Sesi)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileCheck size={16} color={settings.themeColor} />
              <span>
                Total {settings.sessions[1].totalQuestions + settings.sessions[2].totalQuestions + settings.sessions[3].totalQuestions} Pertanyaan ({settings.sessions[1].totalQuestions} + {settings.sessions[2].totalQuestions} + {settings.sessions[3].totalQuestions})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
