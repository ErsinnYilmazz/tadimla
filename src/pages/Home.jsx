import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import { getRestaurants } from '../services/restaurantService'
import styles from './Home.module.css'

const moods = [
  { emoji: '😄', label: 'Mutlu', value: 'happy' },
  { emoji: '😔', label: 'Üzgün', value: 'sad' },
  { emoji: '😤', label: 'Stresli', value: 'stressed' },
  { emoji: '😌', label: 'Sakin', value: 'calm' },
  { emoji: '🤩', label: 'Enerjik', value: 'energetic' },
]

function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants()
        setFeatured(data.filter(r => r.is_open).slice(0, 3))
      } catch (err) {
        console.error(err)
      }
    }
    fetchRestaurants()
  }, [])

  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Açsın mı? <br />
            <span className={styles.heroAccent}>tadımla</span> hemen gelsin!
          </h1>
          <p className={styles.heroSubtitle}>
            Yüzlerce restoran, dakikalar içinde kapınıza teslim.
          </p>
          <div className={styles.heroActions}>
            <button
              onClick={() => navigate('/restoranlar')}
              className={styles.heroPrimary}
            >
              🍽️ Restoranlara Göz At
            </button>
            <button
              onClick={() => navigate('/ruh-haline-gore')}
              className={styles.heroSecondary}
            >
              😊 Ruh Halime Göre Seç
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <span className={styles.heroEmoji}>🔥</span>
        </div>
      </section>

      {/* Mood Bar */}
      <section className={styles.moodSection}>
        <h2 className={styles.sectionTitle}>Bugün nasıl hissediyorsun?</h2>
        <p className={styles.sectionSubtitle}>Ruh haline göre sana özel yemek önerileri</p>
        <div className={styles.moodBar}>
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => navigate(`/ruh-haline-gore?mood=${mood.value}`)}
              className={styles.moodButton}
            >
              <span className={styles.moodEmoji}>{mood.emoji}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Öne Çıkan Restoranlar */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Öne Çıkan Restoranlar</h2>
            <p className={styles.sectionSubtitle}>En çok tercih edilen lezzetler</p>
          </div>
          <button
            onClick={() => navigate('/restoranlar')}
            className={styles.seeAllButton}
          >
            Tümünü Gör →
          </button>
        </div>
        <div className={styles.featuredGrid}>
          {featured.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className={styles.howSection}>
        <h2 className={styles.sectionTitle}>Nasıl Çalışır?</h2>
        <p className={styles.sectionSubtitle}>3 adımda kapınıza teslim</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>🔍</div>
            <h3 className={styles.stepTitle}>Keşfet</h3>
            <p className={styles.stepText}>Yüzlerce restoran arasından istediğini seç</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>🛒</div>
            <h3 className={styles.stepTitle}>Sipariş Ver</h3>
            <p className={styles.stepText}>Menüden seç, sepete ekle, ödemeni yap</p>
          </div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>🛵</div>
            <h3 className={styles.stepTitle}>Teslim Al</h3>
            <p className={styles.stepText}>Kuryeni canlı takip et, yemeğini kapıda al</p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home