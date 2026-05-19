import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, loading } = useAuth()

  const [tab, setTab] = useState(location.state?.tab || 'login')
  const [errors, setErrors] = useState({})

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateLogin = () => {
    const newErrors = {}
    if (!loginForm.email.trim()) newErrors.email = 'E-posta gerekli'
    if (!loginForm.password.trim()) newErrors.password = 'Şifre gerekli'
    return newErrors
  }

  const validateRegister = () => {
    const newErrors = {}
    if (!registerForm.name.trim()) newErrors.name = 'Ad soyad gerekli'
    if (!registerForm.email.trim()) newErrors.email = 'E-posta gerekli'
    if (!registerForm.password.trim()) newErrors.password = 'Şifre gerekli'
    if (registerForm.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı'
    if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    return newErrors
  }

  const handleLogin = async () => {
    const newErrors = validateLogin()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    const success = await login(loginForm.email, loginForm.password)
    if (success) navigate('/')
  }

  const handleRegister = async () => {
    const newErrors = validateRegister()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    const success = await register(registerForm.name, registerForm.email, registerForm.password)
    if (success) navigate('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logo}>🔥 tadımla</div>
        <p className={styles.logoSub}>Lezzetin adresi</p>

        {/* Sekmeler */}
        <div className={styles.tabs}>
          <button
            onClick={() => { setTab('login'); setErrors({}) }}
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => { setTab('register'); setErrors({}) }}
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Giriş Formu */}
        {tab === 'login' && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>E-posta</label>
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="ornek@email.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Şifre</label>
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
              {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            >
              {loading ? '⏳ Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <p className={styles.switchText}>
              Hesabın yok mu?{' '}
              <button onClick={() => { setTab('register'); setErrors({}) }} className={styles.switchLink}>
                Kayıt ol
              </button>
            </p>
          </div>
        )}

        {/* Kayıt Formu */}
        {tab === 'register' && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ad Soyad</label>
              <input
                name="name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                placeholder="Ersin Yılmaz"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-posta</label>
              <input
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="ornek@email.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Şifre</label>
              <input
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
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
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Şifreni tekrar gir"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
            >
              {loading ? '⏳ Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>

            <p className={styles.switchText}>
              Zaten hesabın var mı?{' '}
              <button onClick={() => { setTab('login'); setErrors({}) }} className={styles.switchLink}>
                Giriş yap
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Auth