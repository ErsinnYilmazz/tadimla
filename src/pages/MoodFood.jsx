import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import { getRestaurants } from '../services/restaurantService'
import moodMap from '../data/moodMap.json'
import styles from './MoodFood.module.css'

const moods = [
  { emoji: '😄', label: 'Mutlu', value: 'happy' },
  { emoji: '😔', label: 'Üzgün', value: 'sad' },
  { emoji: '😤', label: 'Stresli', value: 'stressed' },
  { emoji: '😌', label: 'Sakin', value: 'calm' },
  { emoji: '🤩', label: 'Enerjik', value: 'energetic' },
]

function MoodFood() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState(searchParams.get('mood') || null)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants()
        setRestaurants(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  useEffect(() => {
    const moodFromUrl = searchParams.get('mood')
    if (moodFromUrl) setSelectedMood(moodFromUrl)
  }, [searchParams])

  const handleMoodSelect = (value) => {
    setSelectedMood(value)
    setSearchParams({ mood: value })
  }

  const moodData = selectedMood ? moodMap[selectedMood] : null
  const filtered = selectedMood
    ? restaurants.filter(r => r.tags?.includes(selectedMood) && r.is_open)
    : []

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>Ruh Haline Göre Yemek</h1>
        <p className={styles.subtitle}>Bugün nasıl hissediyorsun? Sana özel öneriler sunalım.</p>
      </div>

      <div className={styles.moodGrid}>
        {moods.map(mood => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`${styles.moodCard} ${selectedMood === mood.value ? styles.moodActive : ''}`}
            style={selectedMood === mood.value ? {
              borderColor: moodMap[mood.value].color,
              backgroundColor: moodMap[mood.value].color + '22'
            } : {}}
          >
            <span className={styles.moodEmoji}>{mood.emoji}</span>
            <span className={styles.moodLabel}>{mood.label}</span>
          </button>
        ))}
      </div>

      {moodData && (
        <div
          className={styles.moodBanner}
          style={{ backgroundColor: moodData.color + '22', borderColor: moodData.color }}
        >
          <div className={styles.moodBannerLeft}>
            <span className={styles.moodBannerEmoji}>{moodData.emoji}</span>
            <div>
              <h2 className={styles.moodBannerTitle}>{moodData.label} hissediyorsun</h2>
              <p className={styles.moodBannerDesc}>{moodData.description}</p>
            </div>
          </div>
          <div className={styles.suggestions}>
            {moodData.suggestions.map((s, i) => (
              <span key={i} className={styles.suggestionTag}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {selectedMood && (
        <div className={styles.results}>
          {loading ? (
            <p>⏳ Yükleniyor...</p>
          ) : (
            <>
              <h2 className={styles.resultsTitle}>
                {filtered.length > 0
                  ? `${filtered.length} restoran seni bekliyor`
                  : 'Uygun restoran bulunamadı'}
              </h2>
              {filtered.length > 0 ? (
                <div className={styles.grid}>
                  {filtered.map(r => (
                    <RestaurantCard key={r.id} restaurant={r} />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <p>😕 Bu ruh hali için açık restoran bulunamadı.</p>
                  <button
                    onClick={() => navigate('/restoranlar')}
                    className={styles.browseButton}
                  >
                    Tüm Restoranları Gör
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!selectedMood && (
        <div className={styles.prompt}>
          <span className={styles.promptEmoji}>☝️</span>
          <p>Yukarıdan ruh halini seç, sana özel restoranları gösterelim!</p>
        </div>
      )}

    </div>
  )
}

export default MoodFood