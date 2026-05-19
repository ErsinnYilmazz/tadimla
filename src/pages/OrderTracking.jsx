import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './OrderTracking.module.css'

// Leaflet ikon fix (Vite ile gerekli)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Kurye ikonu
const courierIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830312.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

// Mock kurye rotası (İstanbul - Kadıköy civarı)
const courierRoute = [
  [40.9900, 29.0300],
  [40.9880, 29.0280],
  [40.9860, 29.0260],
  [40.9840, 29.0240],
  [40.9820, 29.0220],
  [40.9800, 29.0200],
  [40.9780, 29.0180],
  [40.9760, 29.0160],
]

const orderSteps = [
  { id: 1, label: 'Sipariş Alındı', icon: '✅', duration: 2000 },
  { id: 2, label: 'Hazırlanıyor', icon: '👨‍🍳', duration: 4000 },
  { id: 3, label: 'Yola Çıktı', icon: '🛵', duration: 6000 },
  { id: 4, label: 'Kapınızda', icon: '🎉', duration: 8000 },
]

function OrderTracking() {
  const [currentStep, setCurrentStep] = useState(0)
  const [courierPos, setCourierPos] = useState(courierRoute[0])
  const [routeIndex, setRouteIndex] = useState(0)
  const [eta, setEta] = useState(28)

  // Sipariş adımlarını simüle et
  useEffect(() => {
    const timers = orderSteps.map((step, i) =>
      setTimeout(() => setCurrentStep(i), step.duration)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Kurye hareketini simüle et
  useEffect(() => {
    if (currentStep < 2) return
    const interval = setInterval(() => {
      setRouteIndex(prev => {
        if (prev >= courierRoute.length - 1) {
          clearInterval(interval)
          return prev
        }
        const next = prev + 1
        setCourierPos(courierRoute[next])
        setEta(prev => Math.max(0, prev - 3))
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [currentStep])

  return (
    <div className={styles.page}>

      {/* Başlık */}
      <div className={styles.header}>
        <h1 className={styles.title}>Sipariş Takibi</h1>
        <p className={styles.orderId}>Sipariş #TDM-2024-001</p>
      </div>

      <div className={styles.layout}>

        {/* Sol — Durum */}
        <div className={styles.left}>

          {/* Adımlar */}
          <div className={styles.steps}>
            {orderSteps.map((step, i) => (
              <div key={step.id} className={styles.stepRow}>
                <div className={`${styles.stepCircle} ${i <= currentStep ? styles.stepDone : ''}`}>
                  {i <= currentStep ? step.icon : <span className={styles.stepNumber}>{i + 1}</span>}
                </div>
                <div className={styles.stepInfo}>
                  <p className={`${styles.stepLabel} ${i === currentStep ? styles.stepCurrent : ''}`}>
                    {step.label}
                  </p>
                  {i === currentStep && (
                    <p className={styles.stepActive}>Şu an bu aşamada</p>
                  )}
                </div>
                {i < orderSteps.length - 1 && (
                  <div className={`${styles.stepLine} ${i < currentStep ? styles.stepLineDone : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* Kurye Bilgisi */}
          {currentStep >= 2 && (
            <div className={styles.courierCard}>
              <div className={styles.courierAvatar}>🧑‍💼</div>
              <div className={styles.courierInfo}>
                <p className={styles.courierName}>Ahmet K.</p>
                <p className={styles.courierText}>Kuryen yolda</p>
              </div>
              <div className={styles.eta}>
                <p className={styles.etaValue}>{eta} dk</p>
                <p className={styles.etaLabel}>tahmini süre</p>
              </div>
            </div>
          )}

          {/* Sipariş Özeti */}
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Sipariş Özeti</h3>
            <div className={styles.summaryItem}>
              <span>Klasik Burger × 1</span>
              <span>89.90 ₺</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Patates Kızartması × 2</span>
              <span>79.80 ₺</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Toplam</span>
              <span>179.60 ₺</span>
            </div>
          </div>

        </div>

        {/* Sağ — Harita */}
        <div className={styles.right}>
          <div className={styles.mapWrapper}>
            <MapContainer
              center={courierPos}
              zoom={14}
              className={styles.map}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Marker position={courierPos} icon={courierIcon}>
                <Popup>Kuryen burada 🛵</Popup>
              </Marker>
              <Marker position={courierRoute[courierRoute.length - 1]}>
                <Popup>Teslimat adresi 📍</Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className={styles.mapLabel}>📍 Kurye konumu canlı takip ediliyor</p>
        </div>

      </div>
    </div>
  )
}

export default OrderTracking