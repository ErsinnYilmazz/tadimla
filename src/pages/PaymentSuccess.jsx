import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './PaymentSuccess.module.css'

function PaymentSuccess() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate(`/siparis-takibi/${id}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.iconWrapper}>
          <div className={styles.icon}>✓</div>
        </div>

        <h1 className={styles.title}>Ödeme Başarılı!</h1>
        <p className={styles.subtitle}>Siparişiniz alındı ve hazırlanmaya başlandı.</p>

        <div className={styles.orderInfo}>
          <div className={styles.orderRow}>
            <span>Sipariş No</span>
            <span className={styles.orderValue}>#{id?.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className={styles.orderRow}>
            <span>Durum</span>
            <span className={styles.orderStatus}>⏳ Hazırlanıyor</span>
          </div>
          <div className={styles.orderRow}>
            <span>Tahmini Süre</span>
            <span className={styles.orderValue}>25-35 dakika</span>
          </div>
        </div>

        <div className={styles.countdown}>
          <p>{countdown} saniye içinde sipariş takibine yönlendiriliyorsunuz...</p>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => navigate(`/siparis-takibi/${id}`)}
            className={styles.trackButton}
          >
            🛵 Siparişi Takip Et
          </button>
          <button
            onClick={() => navigate('/')}
            className={styles.homeButton}
          >
            Ana Sayfaya Dön
          </button>
        </div>

      </div>
    </div>
  )
}

export default PaymentSuccess