import { useState, useEffect } from 'react'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import { getRestaurants } from '../services/restaurantService'
import styles from './Restaurants.module.css'

const categories = ['Tümü', 'Burger', 'Sushi', 'Ev Yemeği', 'Sağlıklı', 'Tatlı', 'Pizza']

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants()
        setRestaurants(data)
      } catch (err) {
        setError('Restoranlar yüklenemedi')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  const filtered = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Tümü' || r.category === activeCategory
    return matchSearch && matchCategory
  })

  if (loading) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loading}>⏳ Restoranlar yükleniyor...</div>
    </div>
  )

  if (error) return (
    <div className={styles.loadingWrapper}>
      <div className={styles.error}>😕 {error}</div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Restoranlar</h1>
        <p className={styles.subtitle}>Sana en yakın lezzetleri keşfet</p>
      </div>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Restoran ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryActive : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className={styles.resultCount}>{filtered.length} restoran bulundu</p>

      {filtered.length > 0 ? (
        <div className={styles.grid}>
          {filtered.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>😕 Aradığın restoran bulunamadı</p>
        </div>
      )}
    </div>
  )
}

export default Restaurants