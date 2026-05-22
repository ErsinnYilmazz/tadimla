import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import styles from './ResetPassword.module.css'

function ResetPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    const newErrors = {}
    if (!form.password.trim()) newErrors.password = 'Şifre gerekli'
    if (form.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: form.password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/giris'), 3000)
    } catch (err) {
      setErrors({ general: 'Şifre güncellenemedi, tekrar deneyin' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.title}>Şifre Güncellendi!</h1>
          <p className={styles.subtitle}>Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🔥 tadımla</div>
        <h1 className={styles.title}>Yeni Şifre Belirle</h1>
        <p className={styles.subtitle}>Lütfen yeni şifrenizi girin.</p>

        <div className={styles.formGroup}>
          <label className={styles.label}>Yeni Şifre</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="En az 6 karakter"
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Şifre Tekrar</label>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Şifreni tekrar gir"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
        </div>

        {errors.general && <div className={styles.generalError}>⚠️ {errors.general}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
        >
          {loading ? '⏳ Güncelleniyor...' : '🔐 Şifremi Güncelle'}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword