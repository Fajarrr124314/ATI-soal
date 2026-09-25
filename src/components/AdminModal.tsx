import React, { useState, useEffect } from 'react';
import type { FormSettings, TestSubmission } from '../types';
import {
  saveSettings,
  saveAnswerKeys,
  resetAnswerKeys,
  loadSubmissions,
  deleteSubmission,
  clearAllSubmissions,
  exportSubmissionsToExcel,
} from '../services/storage';
import { fetchSubmissionsFromSupabase } from '../services/supabase';
import {
  X,
  Lock,
  Sliders,
  KeyRound,
  Users,
  Download,
  Trash2,
  RotateCcw,
  Check,
  AlertTriangle,
  Eye,
  Move,
  Sparkles,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FormSettings;
  onUpdateSettings: (newSettings: FormSettings) => void;
  answerKeys: {
    1: Record<number, string>;
    2: Record<number, string>;
    3: Record<number, string>;
  };
  onUpdateAnswerKeys: (newKeys: {
    1: Record<number, string>;
    2: Record<number, string>;
    3: Record<number, string>;
  }) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  answerKeys,
  onUpdateAnswerKeys,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'settings' | 'keys' | 'participants'>('settings');

  // Form settings state
  const [formSettings, setFormSettings] = useState<FormSettings>(settings);
  const [activeKeySession, setActiveKeySession] = useState<1 | 2 | 3>(1);
  const [currentKeys, setCurrentKeys] = useState(answerKeys);

  // Submissions state
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubDetail, setSelectedSubDetail] = useState<TestSubmission | null>(null);

  // Mode Atur Urutan Kunci Jawaban (Wobble & Drag-and-Drop)
  const [isReordering, setIsReordering] = useState(false);
  const [draggedKeyId, setDraggedKeyId] = useState<number | null>(null);
  const [dragOverKeyId, setDragOverKeyId] = useState<number | null>(null);
  const [selectedSwapKeyId, setSelectedSwapKeyId] = useState<number | null>(null);

  const swapKeys = (id1: number, id2: number) => {
    if (id1 === id2) return;
    const currentSessionKeys = { ...currentKeys[activeKeySession] };
    const temp = currentSessionKeys[id1];
    currentSessionKeys[id1] = currentSessionKeys[id2];
    currentSessionKeys[id2] = temp;

    const updated = {
      ...currentKeys,
      [activeKeySession]: currentSessionKeys,
    };
    setCurrentKeys(updated);
    saveAnswerKeys(activeKeySession, currentSessionKeys);
    onUpdateAnswerKeys(updated);
  };

  const handleDragStart = (id: number) => {
    setDraggedKeyId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (dragOverKeyId !== id) {
      setDragOverKeyId(id);
    }
  };

  const handleDrop = (targetId: number) => {
    if (draggedKeyId !== null && draggedKeyId !== targetId) {
      swapKeys(draggedKeyId, targetId);
    }
    setDraggedKeyId(null);
    setDragOverKeyId(null);
  };

  const handleClickBoxInReorder = (id: number) => {
    if (selectedSwapKeyId === null) {
      setSelectedSwapKeyId(id);
    } else if (selectedSwapKeyId === id) {
      setSelectedSwapKeyId(null);
    } else {
      swapKeys(selectedSwapKeyId, id);
      setSelectedSwapKeyId(null);
    }
  };

  useEffect(() => {
    setFormSettings(settings);
    setCurrentKeys(answerKeys);
    if (isOpen) {
      const local = loadSubmissions();
      setSubmissions(local);

      // Fetch from Supabase in background if configured
      if (settings.supabaseUrl && settings.supabaseAnonKey) {
        fetchSubmissionsFromSupabase(settings.supabaseUrl, settings.supabaseAnonKey).then((cloud) => {
          if (cloud && cloud.length > 0) {
            // Merge unique by id
            const existingIds = new Set(local.map((s) => s.id));
            const merged = [...local];
            for (const c of cloud) {
              if (!existingIds.has(c.id)) {
                merged.push(c);
              }
            }
            setSubmissions(merged);
          }
        });
      }
    }
  }, [isOpen, settings, answerKeys]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.adminPassword || passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Password salah. Silakan periksa kembali kata sandi Anda.');
    }
  };

  const handleSaveSettings = () => {
    saveSettings(formSettings);
    onUpdateSettings(formSettings);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleKeyChange = (session: 1 | 2 | 3, qId: number, val: string) => {
    const updated = {
      ...currentKeys,
      [session]: {
        ...currentKeys[session],
        [qId]: val.toUpperCase(),
      },
    };
    setCurrentKeys(updated);
    saveAnswerKeys(session, updated[session]);
    onUpdateAnswerKeys(updated);
  };

  const handleResetKeys = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua kunci jawaban ke data awal PT ATI?')) {
      const def = resetAnswerKeys();
      setCurrentKeys(def);
      onUpdateAnswerKeys(def);
      alert('Kunci jawaban berhasil direset ke standar PT ATI.');
    }
  };

  const handleDeleteSub = (id: string) => {
    if (confirm('Hapus data peserta ini?')) {
      const updated = deleteSubmission(id);
      setSubmissions(updated);
      if (selectedSubDetail?.id === id) setSelectedSubDetail(null);
    }
  };

  const handleClearAllSubs = () => {
    if (confirm('PERINGATAN: Hapus SEMUA riwayat peserta? Tindakan ini tidak dapat dibatalkan.')) {
      clearAllSubmissions();
      setSubmissions([]);
      setSelectedSubDetail(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) =>
    s.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.participant.participantNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="gform-card"
        style={{
          width: '100%',
          maxWidth: 880,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                flexShrink: 0,
              }}
            >
              <Lock size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#202124' }}>
                Panel Pengaturan Admin
              </h2>
              <p style={{ fontSize: 13, color: '#5f6368', marginTop: 2 }}>
                Atur durasi timer, kunci jawaban, acak soal, dan rekap peserta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f3f4',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5f6368',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Auth Gate if not logged in */}
        {!isAuthenticated ? (
          <div style={{ padding: '36px 24px', textAlign: 'center', maxWidth: 400, margin: '0 auto', flexShrink: 0 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <KeyRound size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Masukkan Password Admin</h3>
            <p style={{ fontSize: 13, color: '#5f6368', marginBottom: 20 }}>
              Masukkan kata sandi administrator untuk mengelola sistem
            </p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                className="gform-input"
                placeholder="Password Admin"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                style={{ textAlign: 'center', marginBottom: 12 }}
              />
              {passwordError && (
                <div style={{ color: 'var(--danger-color)', fontSize: 12, marginBottom: 12 }}>
                  {passwordError}
                </div>
              )}
              <button
                type="submit"
                className="btn-gform btn-primary"
                style={{ width: '100%', padding: '10px 0' }}
              >
                Buka Panel Admin
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation (Pill Tabs - No Overlapping) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 24px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#f8f9fa',
                flexShrink: 0,
                overflowX: 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 24,
                  border: activeTab === 'settings' ? 'none' : '1px solid #dadce0',
                  backgroundColor: activeTab === 'settings' ? 'var(--primary-color)' : '#ffffff',
                  color: activeTab === 'settings' ? '#ffffff' : '#3c4043',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: activeTab === 'settings' ? '0 1px 4px rgba(103,58,183,0.35)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Sliders size={15} />
                <span>Pengaturan &amp; Timer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('keys')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 24,
                  border: activeTab === 'keys' ? 'none' : '1px solid #dadce0',
                  backgroundColor: activeTab === 'keys' ? 'var(--primary-color)' : '#ffffff',
                  color: activeTab === 'keys' ? '#ffffff' : '#3c4043',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: activeTab === 'keys' ? '0 1px 4px rgba(103,58,183,0.35)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <KeyRound size={15} />
                <span>Kunci Jawaban</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('participants')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 24,
                  border: activeTab === 'participants' ? 'none' : '1px solid #dadce0',
                  backgroundColor: activeTab === 'participants' ? 'var(--primary-color)' : '#ffffff',
                  color: activeTab === 'participants' ? '#ffffff' : '#3c4043',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  boxShadow: activeTab === 'participants' ? '0 1px 4px rgba(103,58,183,0.35)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Users size={15} />
                <span>Data Peserta ({submissions.length})</span>
              </button>
            </div>

            {/* Tab Contents Container */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: '1 1 auto',
                minHeight: 0,
                backgroundColor: '#ffffff',
              }}
            >
              {/* TAB 1: PENGATURAN & TIMER */}
              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div>
                      <label className="gform-input-label">Judul Form</label>
                      <input
                        type="text"
                        className="gform-input"
                        value={formSettings.title}
                        onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="gform-input-label">Nama Instansi / Perusahaan</label>
                      <input
                        type="text"
                        className="gform-input"
                        value={formSettings.organization}
                        onChange={(e) => setFormSettings({ ...formSettings, organization: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="gform-input-label">Deskripsi / Petunjuk Pengisian</label>
                    <textarea
                      className="gform-input"
                      rows={2}
                      value={formSettings.description}
                      onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                    />
                  </div>

                  {/* Pengaturan Durasi Timer Per Sesi */}
                  <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #dadce0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                      ⏱️ Pengaturan Durasi Timer Per Sesi
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>Sesi 1 (20 Soal)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            className="gform-input"
                            value={formSettings.sessions[1].durationMinutes}
                            onChange={(e) =>
                              setFormSettings({
                                ...formSettings,
                                sessions: {
                                  ...formSettings.sessions,
                                  1: { ...formSettings.sessions[1], durationMinutes: Math.max(1, parseInt(e.target.value) || 1) },
                                },
                              })
                            }
                          />
                          <span style={{ fontSize: 13, color: '#666' }}>Menit</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>Sesi 2 (45 Soal)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            className="gform-input"
                            value={formSettings.sessions[2].durationMinutes}
                            onChange={(e) =>
                              setFormSettings({
                                ...formSettings,
                                sessions: {
                                  ...formSettings.sessions,
                                  2: { ...formSettings.sessions[2], durationMinutes: Math.max(1, parseInt(e.target.value) || 1) },
                                },
                              })
                            }
                          />
                          <span style={{ fontSize: 13, color: '#666' }}>Menit</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>Sesi 3 (157 Soal)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <input
                            type="number"
                            min="1"
                            max="180"
                            className="gform-input"
                            value={formSettings.sessions[3].durationMinutes}
                            onChange={(e) =>
                              setFormSettings({
                                ...formSettings,
                                sessions: {
                                  ...formSettings.sessions,
                                  3: { ...formSettings.sessions[3], durationMinutes: Math.max(1, parseInt(e.target.value) || 1) },
                                },
                              })
                            }
                          />
                          <span style={{ fontSize: 13, color: '#666' }}>Menit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pilihan Akumulasi Waktu vs Reset per Sesi */}
                  <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #dadce0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                      ⏳ Sistem Perhitungan Waktu Timer
                    </h4>
                    <p style={{ fontSize: 13, color: '#5f6368', marginBottom: 12 }}>
                      Tentukan apakah sisa waktu dari sesi sebelumnya diakumulasikan ke sesi berikutnya atau di-reset baru:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: 12,
                          borderRadius: 8,
                          border: `1.5px solid ${formSettings.timerMode === 'accumulated' ? 'var(--primary-color)' : '#dadce0'}`,
                          backgroundColor: formSettings.timerMode === 'accumulated' ? 'var(--primary-light)' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="timerMode"
                          value="accumulated"
                          checked={formSettings.timerMode === 'accumulated'}
                          onChange={() => setFormSettings({ ...formSettings, timerMode: 'accumulated' })}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>
                            Mode Akumulasi Waktu (Sisa Waktu Terbawa) — Direkomendasikan
                          </div>
                          <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>
                            Jika peserta selesai lebih cepat (misal Sesi 1 selesai dalam 3 menit dari jatah 5 menit), sisa 2 menit tidak hangus melainkan otomatis diakumulasikan ke Sesi 2 (jadi 7 menit). Jika waktu habis sebelum selesai, sistem baru otomatis memindahkan sesi.
                          </div>
                        </div>
                      </label>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: 12,
                          borderRadius: 8,
                          border: `1.5px solid ${formSettings.timerMode === 'per_session' ? 'var(--primary-color)' : '#dadce0'}`,
                          backgroundColor: formSettings.timerMode === 'per_session' ? 'var(--primary-light)' : '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="timerMode"
                          value="per_session"
                          checked={formSettings.timerMode === 'per_session'}
                          onChange={() => setFormSettings({ ...formSettings, timerMode: 'per_session' })}
                          style={{ marginTop: 2 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>
                            Mode Reset per Sesi (Mandiri)
                          </div>
                          <div style={{ fontSize: 12, color: '#5f6368', marginTop: 2 }}>
                            Setiap sesi selalu mulai dari waktu awal yang ditentukan di atas. Sisa waktu dari sesi sebelumnya tidak dibawa ke sesi berikutnya.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Pengaturan Acak / Shuffle Soal */}
                  <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #dadce0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                      🎲 Pengacakan Urutan Soal (Shuffle)
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formSettings.sessions[3].shuffleQuestions}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              sessions: {
                                ...formSettings.sessions,
                                3: { ...formSettings.sessions[3], shuffleQuestions: e.target.checked },
                              },
                            })
                          }
                          style={{ width: 18, height: 18 }}
                        />
                        <span>
                          <strong>Acak Urutan Soal Sesi 3 (Direkomendasikan)</strong> — Melatih fokus anak agar nomor pertanyaan tidak berurutan, namun penilaian tetap akurat.
                        </span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formSettings.sessions[1].shuffleQuestions}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              sessions: {
                                ...formSettings.sessions,
                                1: { ...formSettings.sessions[1], shuffleQuestions: e.target.checked },
                              },
                            })
                          }
                          style={{ width: 18, height: 18 }}
                        />
                        <span>Acak Urutan Soal Sesi 1</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formSettings.sessions[2].shuffleQuestions}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              sessions: {
                                ...formSettings.sessions,
                                2: { ...formSettings.sessions[2], shuffleQuestions: e.target.checked },
                              },
                            })
                          }
                          style={{ width: 18, height: 18 }}
                        />
                        <span>Acak Urutan Soal Sesi 2</span>
                      </label>
                    </div>
                  </div>

                  {/* Pengaturan Tambahan */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                    <div style={{ background: '#f8f9fa', padding: 14, borderRadius: 8, border: '1px solid #dadce0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formSettings.autoAdvanceOnTimeout}
                          onChange={(e) => setFormSettings({ ...formSettings, autoAdvanceOnTimeout: e.target.checked })}
                          style={{ width: 18, height: 18 }}
                        />
                        <span>Otomatis Pindah Sesi saat Waktu Habis</span>
                      </label>
                    </div>

                    <div style={{ background: '#f8f9fa', padding: 14, borderRadius: 8, border: '1px solid #dadce0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                        <input
                          type="checkbox"
                          checked={formSettings.showScoreToUser}
                          onChange={(e) => setFormSettings({ ...formSettings, showScoreToUser: e.target.checked })}
                          style={{ width: 18, height: 18 }}
                        />
                        <span>Tampilkan Skor di Akhir kepada Peserta</span>
                      </label>
                    </div>

                    <div>
                      <label className="gform-input-label">Ganti Password Admin</label>
                      <input
                        type="text"
                        className="gform-input"
                        value={formSettings.adminPassword}
                        onChange={(e) => setFormSettings({ ...formSettings, adminPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button
                      onClick={handleSaveSettings}
                      className="btn-gform btn-primary"
                      style={{ padding: '10px 24px' }}
                    >
                      <Check size={16} /> Simpan Pengaturan
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: KUNCI JAWABAN */}
              {activeTab === 'keys' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3].map((s) => (
                        <button
                          key={s}
                          className="btn-gform"
                          style={{
                            fontSize: 13,
                            padding: '6px 14px',
                            backgroundColor: activeKeySession === s ? 'var(--primary-color)' : '#f1f3f4',
                            color: activeKeySession === s ? '#ffffff' : '#333333',
                          }}
                          onClick={() => setActiveKeySession(s as 1 | 2 | 3)}
                        >
                          Sesi {s} ({s === 1 ? '20 Soal' : s === 2 ? '45 Soal' : '157 Soal'})
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsReordering(!isReordering);
                          setSelectedSwapKeyId(null);
                        }}
                        className="btn-gform"
                        style={{
                          padding: '6px 14px',
                          fontSize: 13,
                          fontWeight: 600,
                          backgroundColor: isReordering ? '#0f9d58' : 'var(--primary-light)',
                          color: isReordering ? '#ffffff' : 'var(--primary-color)',
                          border: isReordering ? '1px solid #0f9d58' : '1px solid var(--primary-border)',
                          boxShadow: isReordering ? '0 2px 8px rgba(15,157,88,0.35)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isReordering ? <Check size={15} /> : <Move size={15} />}
                        <span>{isReordering ? 'Selesai Atur & Simpan' : 'Atur Urutan (Geser)'}</span>
                      </button>

                      <button
                        onClick={handleResetKeys}
                        className="btn-gform btn-secondary"
                        style={{ padding: '6px 12px', fontSize: 12, color: 'var(--danger-color)', borderColor: '#fad2cf' }}
                      >
                        <RotateCcw size={14} /> Reset ke Kunci PT ATI Bawaan
                      </button>
                    </div>
                  </div>

                  {/* Banner Mode Goyang / Atur Urutan */}
                  {isReordering && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: 'var(--primary-light)',
                        border: '1.5px dashed var(--primary-color)',
                        color: 'var(--primary-color)',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 14,
                        animation: 'pulse 1.5s infinite alternate',
                      }}
                    >
                      <Sparkles size={18} style={{ flexShrink: 0 }} />
                      <span>
                        <strong>Mode Atur Urutan Aktif! (Kotak Bergoyang)</strong>: Geser (drag &amp; drop) kotak ke nomor lain, atau klik kotak pertama lalu klik kotak tujuan untuk menukar urutan kunci jawabannya.
                      </span>
                    </div>
                  )}

                  {activeKeySession === 3 && !isReordering && (
                    <div
                      style={{
                        padding: 10,
                        borderRadius: 6,
                        backgroundColor: '#e8f0fe',
                        border: '1px solid #d2e3fc',
                        fontSize: 12,
                        color: '#1a73e8',
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                      <span>
                        Info: Kunci Jawaban Sesi 3 telah dipetakan lengkap sesuai tabel spreadsheet PT ATI (1-157). Anda dapat mengubah kunci nomor apa saja langsung pada kolom di bawah.
                      </span>
                    </div>
                  )}

                  {/* Answer Key Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                      gap: 10,
                      maxHeight: '52vh',
                      overflowY: 'auto',
                      padding: 6,
                    }}
                  >
                    {(() => {
                      const total = activeKeySession === 1 ? 20 : activeKeySession === 2 ? 45 : 157;
                      const sessionKeys = currentKeys[activeKeySession];
                      const items = [];

                      for (let i = 1; i <= total; i++) {
                        const currentVal = sessionKeys[i] || '';
                        const isSelectedSwap = selectedSwapKeyId === i;
                        const isDragged = draggedKeyId === i;
                        const isDragOver = dragOverKeyId === i;

                        items.push(
                          <div
                            key={i}
                            draggable={isReordering}
                            onDragStart={() => isReordering && handleDragStart(i)}
                            onDragOver={(e) => isReordering && handleDragOver(e, i)}
                            onDrop={() => isReordering && handleDrop(i)}
                            onClick={() => isReordering && handleClickBoxInReorder(i)}
                            className={`answer-key-box ${isReordering ? 'jiggle-box' : ''} ${isDragged ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''} ${isSelectedSwap ? 'selected-swap' : ''}`}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              border: isSelectedSwap ? '2px solid #1a73e8' : '1px solid #dadce0',
                              backgroundColor: isSelectedSwap ? '#e8f0fe' : '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 6,
                              cursor: isReordering ? 'grab' : 'default',
                              transition: 'all 0.15s ease',
                              position: 'relative',
                            }}
                            title={isReordering ? `Klik atau geser soal #${i} untuk menukar kunci` : undefined}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              {isReordering && <Move size={12} color="var(--primary-color)" style={{ opacity: 0.8 }} />}
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#5f6368' }}>#{i}</span>
                            </div>

                            <div style={{ pointerEvents: isReordering ? 'none' : 'auto' }}>
                              {activeKeySession === 1 ? (
                                <input
                                  type="text"
                                  maxLength={3}
                                  value={currentVal}
                                  onChange={(e) => handleKeyChange(1, i, e.target.value)}
                                  style={{
                                    width: 44,
                                    textAlign: 'center',
                                    padding: '4px 2px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    borderRadius: 4,
                                    border: '1px solid #ced4da',
                                  }}
                                />
                              ) : activeKeySession === 2 ? (
                                <select
                                  value={currentVal}
                                  onChange={(e) => handleKeyChange(2, i, e.target.value)}
                                  style={{
                                    padding: '4px',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    borderRadius: 4,
                                    border: '1px solid #ced4da',
                                  }}
                                >
                                  <option value="B">B</option>
                                  <option value="S">S</option>
                                </select>
                              ) : (
                                <select
                                  value={currentVal}
                                  onChange={(e) => handleKeyChange(3, i, e.target.value)}
                                  style={{
                                    padding: '4px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    borderRadius: 4,
                                    border: '1px solid #ced4da',
                                  }}
                                >
                                  <option value="SS">SS</option>
                                  <option value="S">S</option>
                                  <option value="TS">TS</option>
                                  <option value="STS">STS</option>
                                </select>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return items;
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 3: DATA PESERTA */}
              {activeTab === 'participants' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Cari nama atau nomor peserta..."
                      className="gform-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ maxWidth: 320, padding: '8px 12px', fontSize: 13 }}
                    />

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => exportSubmissionsToExcel(submissions, formSettings.title)}
                        disabled={submissions.length === 0}
                        className="btn-gform btn-primary"
                        style={{
                          padding: '8px 14px',
                          fontSize: 13,
                          backgroundColor: '#0f9d58',
                          opacity: submissions.length === 0 ? 0.6 : 1,
                        }}
                      >
                        <Download size={15} /> Ekspor Excel (.xlsx)
                      </button>

                      {submissions.length > 0 && (
                        <button
                          onClick={handleClearAllSubs}
                          className="btn-gform btn-secondary"
                          style={{
                            padding: '8px 14px',
                            fontSize: 13,
                            color: 'var(--danger-color)',
                            borderColor: '#fad2cf',
                          }}
                        >
                          <Trash2 size={15} /> Hapus Semua
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submissions Table */}
                  {filteredSubmissions.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#5f6368', background: '#fafafa', borderRadius: 8 }}>
                      Belum ada peserta yang mengumpulkan tes.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', border: '1px solid #dadce0', borderRadius: 8 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: '#f1f3f4', textAlign: 'left', borderBottom: '1px solid #dadce0' }}>
                            <th style={{ padding: '10px 12px' }}>Waktu</th>
                            <th style={{ padding: '10px 12px' }}>Nama Peserta</th>
                            <th style={{ padding: '10px 12px' }}>No. Peserta</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Sesi 1</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Sesi 2</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Sesi 3</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Total (%)</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSubmissions.map((sub) => (
                            <tr
                              key={sub.id}
                              style={{ borderBottom: '1px solid #eeeeee', backgroundColor: '#ffffff' }}
                            >
                              <td style={{ padding: '10px 12px', color: '#5f6368', whiteSpace: 'nowrap' }}>
                                {new Date(sub.submittedAt).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{sub.participant.name}</td>
                              <td style={{ padding: '10px 12px', color: '#5f6368' }}>
                                {sub.participant.participantNumber}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                {sub.session1.correctCount}/{sub.session1.totalQuestions} ({sub.session1.scorePercentage.toFixed(0)}%)
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                {sub.session2.correctCount}/{sub.session2.totalQuestions} ({sub.session2.scorePercentage.toFixed(0)}%)
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                {sub.session3.correctCount}/{sub.session3.totalQuestions} ({sub.session3.scorePercentage.toFixed(0)}%)
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: 'var(--primary-color)' }}>
                                {sub.totalScorePercentage.toFixed(1)}%
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                                  <button
                                    onClick={() => setSelectedSubDetail(sub)}
                                    title="Lihat Detail Jawaban"
                                    style={{
                                      border: 'none',
                                      background: '#f1f3f4',
                                      padding: '4px 8px',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSub(sub.id)}
                                    title="Hapus Peserta Ini"
                                    style={{
                                      border: 'none',
                                      background: '#fce8e6',
                                      color: 'var(--danger-color)',
                                      padding: '4px 8px',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Detail Modal if viewing single submission */}
                  {selectedSubDetail && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: 16,
                        borderRadius: 8,
                        background: '#f8f9fa',
                        border: '1px solid #dadce0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <h4 style={{ fontWeight: 700 }}>
                          Rincian Jawaban: {selectedSubDetail.participant.name} ({selectedSubDetail.participant.participantNumber})
                        </h4>
                        <button
                          onClick={() => setSelectedSubDetail(null)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
                        Total Nilai: {selectedSubDetail.totalScorePercentage.toFixed(1)}% ({selectedSubDetail.totalCorrect}/{selectedSubDetail.totalQuestions} Soal Benar)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '12px 24px',
                borderTop: '1px solid #dadce0',
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: '#fafafa',
                flexShrink: 0,
              }}
            >
              <button onClick={onClose} className="btn-gform btn-secondary" style={{ padding: '8px 20px' }}>
                Tutup Panel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
