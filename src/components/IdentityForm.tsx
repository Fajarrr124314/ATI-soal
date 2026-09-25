import React, { useState } from 'react';
import type { ParticipantInfo, FormSettings } from '../types';
import { ArrowRight, User, Hash, Building2, AlertCircle, Sparkles } from 'lucide-react';

interface IdentityFormProps {
  settings: FormSettings;
  onStart: (info: ParticipantInfo) => void;
}

export const IdentityForm: React.FC<IdentityFormProps> = ({ settings, onStart }) => {
  const [name, setName] = useState('');
  const [participantNumber, setParticipantNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [errors, setErrors] = useState<{ name?: string; number?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; number?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }
    if (!participantNumber.trim()) {
      newErrors.number = 'Nomor peserta / identitas wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStart({
      name: name.trim(),
      participantNumber: participantNumber.trim(),
      institution: institution.trim(),
      startedAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Kartu Petunjuk Sesi */}
      <div className="gform-card" style={{ padding: '20px 24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 12,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sparkles size={18} color={settings.themeColor} />
          Struktur Pelaksanaan Tes (3 Sesi)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 700, color: settings.themeColor, fontSize: 14 }}>Sesi 1</div>
            <div style={{ fontSize: 13, color: '#333', marginTop: 4 }}>Pilihan Ganda (A - E)</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              <strong>20 Soal</strong> • {settings.sessions[1].durationMinutes} Menit
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 700, color: settings.themeColor, fontSize: 14 }}>Sesi 2</div>
            <div style={{ fontSize: 13, color: '#333', marginTop: 4 }}>Benar / Salah (B / S)</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              <strong>45 Soal</strong> • {settings.sessions[2].durationMinutes} Menit
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1.5px solid var(--primary-border)',
              backgroundColor: 'var(--primary-light)',
            }}
          >
            <div style={{ fontWeight: 700, color: settings.themeColor, fontSize: 14 }}>
              Sesi 3 🎲 (Fokus Acak)
            </div>
            <div style={{ fontSize: 13, color: '#333', marginTop: 4 }}>Skala Respon (SS / S / TS / STS)</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              <strong>157 Soal</strong> • {settings.sessions[3].durationMinutes} Menit
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: 10,
            borderRadius: 6,
            background: '#fff8e1',
            color: '#b78103',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>
            Perhatian: Setiap sesi memiliki batas waktu mandiri. Pastikan jawaban terisi sebelum waktu berakhir!
          </span>
        </div>
      </div>

      {/* Kartu Identitas Peserta */}
      <div className="gform-card" style={{ padding: '24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 16,
            color: 'var(--text-main)',
          }}
        >
          Identitas Peserta
        </h3>

        {/* Nama Lengkap */}
        <div className="gform-input-group">
          <label className="gform-input-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <User size={16} /> Nama Lengkap
            </span>
            <span className="required">*</span>
          </label>
          <input
            type="text"
            className="gform-input"
            placeholder="Jawaban Anda"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            autoFocus
          />
          {errors.name && (
            <div style={{ color: 'var(--danger-color)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={14} /> {errors.name}
            </div>
          )}
        </div>

        {/* Nomor Peserta */}
        <div className="gform-input-group">
          <label className="gform-input-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Hash size={16} /> Nomor Peserta / No. WhatsApp / NIK
            </span>
            <span className="required">*</span>
          </label>
          <input
            type="text"
            className="gform-input"
            placeholder="Contoh: ATI-001 atau 08123456789"
            value={participantNumber}
            onChange={(e) => {
              setParticipantNumber(e.target.value);
              if (errors.number) setErrors((prev) => ({ ...prev, number: undefined }));
            }}
          />
          {errors.number && (
            <div style={{ color: 'var(--danger-color)', fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={14} /> {errors.number}
            </div>
          )}
        </div>

        {/* Asal Sekolah / Bagian */}
        <div className="gform-input-group" style={{ marginBottom: 0 }}>
          <label className="gform-input-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={16} /> Asal Sekolah / Divisi / Keterangan (Opsional)
            </span>
          </label>
          <input
            type="text"
            className="gform-input"
            placeholder="Jawaban Anda"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="bottom-action-bar" style={{ justifyContent: 'flex-end' }}>
        <button
          type="submit"
          className="btn-gform btn-primary"
          style={{ backgroundColor: settings.themeColor, padding: '12px 28px', fontSize: 15 }}
        >
          <span>Mulai Tes Sesi 1</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
};
