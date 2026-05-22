import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import styles from './ForgotPassword.module.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) { setError('E-posta gerekli'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/parola-sifirla`
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError('E-posta gönderilemedi, tekrar deneyin')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>📧</div>
          <h1 className={styles.title}>E-posta Gönderildi!</h1>
          <p className={styles.subtitle}>
            <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
            Gelen kutunuzu kontrol edin.
          </p>
          <button onClick={() => navigate('/giris')} className={styles.backButton}>
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🔥 tadımla</div>
        <h1 className={styles.title}>Şifremi Unuttum</h1>
        <p className={styles.subtitle}>
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>

        <div className={styles.formGroup}>
          <label className={styles.label}>E-posta</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="ornek@email.com"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
          />
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
        >
          {loading ? '⏳ Gönderiliyor...' : '📧 Sıfırlama Bağlantısı Gönder'}
        </button>

        <button onClick={() => navigate('/giris')} className={styles.cancelButton}>
          ← Giriş Sayfasına Dön
        </button>
      </div>
    </div>
  )
}

export default ForgotPassword