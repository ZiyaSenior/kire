import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loginAsAdmin, loginAsDemoUser, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setError && setError('')
    const identifier = (formData.email || '').trim()
    const password = (formData.password || '')
    if (!identifier || !password) {
      setError && setError('Məlumatları daxil edin')
      return
    }
    const res = login(identifier, password)
    if (!res || !res.success) {
      setError && setError(res?.error || 'Giriş alınmadı')
      return
    }
    // success
    onClose && onClose()
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setError && setError('')
    const name = (formData.name || '').trim()
    const surname = (formData.surname || '').trim()
    const phone = (formData.phone || '').trim()
    const email = (formData.email || '').trim()
    const password = (formData.password || '')
    if (!name || !surname || !phone || !email || !password) {
      setError && setError('Məlumatları daxil edin')
      return
    }
    const res = register({ name, surname, phone, email, password })
    if (res?.success) {
      onClose && onClose()
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        <h3>{isLogin ? 'Sistemə Giriş' : 'Qeydiyyat'}</h3>

        {/* Xəta Mesajı */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Demo Tək-Tıkla Giriş Düymələri */}
        <div style={styles.demoBox}>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Sürətli Test Girişi:</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { loginAsAdmin(); onClose(); }}
              style={styles.adminDemoBtn}
            >
              👑 Admin Kimi Gir
            </button>
            <button
              type="button"
              onClick={() => { loginAsDemoUser(); onClose(); }}
              style={styles.userDemoBtn}
            >
              👤 Qonaq Kimi Gir
            </button>
          </div>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="E-poçt və ya Telefon"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Şifrə"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
            />

            <button type="submit" style={styles.submitBtn}>Daxil Ol</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Ad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Soyad"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              style={styles.input}
            />
            <input
              type="tel"
              placeholder="Telefon (məs: 0501234567)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="E-poçt"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Şifrə"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
            />

            <button type="submit" style={styles.submitBtn}>Qeydiyyatı Tamamla</button>
          </form>
        )}

        <p style={styles.toggleText} onClick={() => { setIsLogin(!isLogin); setError && setError(''); }}>
          {isLogin ? 'Hesabınız yoxdur? Qeydiyyatdan keçin' : 'Artıq hesabınız var? Daxil olun'}
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '360px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  closeBtn: { position: 'absolute', top: '12px', right: '12px', border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' },
  errorBox: { padding: '8px 12px', backgroundColor: '#ffe6e6', color: '#d93025', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' },
  demoBox: { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '15px' },
  adminDemoBtn: { flex: 1, padding: '6px', backgroundColor: '#7000ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  userDemoBtn: { flex: 1, padding: '6px', backgroundColor: '#00a859', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  submitBtn: { padding: '12px', backgroundColor: '#ff6600', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
  toggleText: { marginTop: '15px', textAlign: 'center', color: '#0066cc', cursor: 'pointer', fontSize: '13px' }
};
