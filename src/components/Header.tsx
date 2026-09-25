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

          <button
            onClick={onOpenAdmin}
            title="Buka Pengaturan Admin"
            style={{
              background: '#f1f3f4',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5f6368',
              transition: 'background 0.2s, transform 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e8eaed')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f3f4')}
          >
            <Settings size={20} />
          </button>
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
              <span>Total 222 Pertanyaan (20 + 45 + 157)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
