import { useState } from 'react'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import restaurantsData from '../data/restaurants.json'
import styles from './Restaurants.module.css'

const categories = ['Tümü', 'Burger', 'Sushi', 'Ev Yemeği', 'Sağlıklı', 'Tatlı', 'Pizza']

function Restaurants() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')

  const filtered = restaurantsData.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Tümü' || r.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className={styles.page}>

      {/* Başlık */}
      <div className={styles.header}>
        <h1 className={styles.title}>Restoranlar</h1>
        <p className={styles.subtitle}>Sana en yakın lezzetleri keşfet</p>
      </div>

      {/* Arama */}
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

      {/* Kategori filtreleri */}
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

      {/* Sonuç sayısı */}
      <p className={styles.resultCount}>{filtered.length} restoran bulundu</p>

      {/* Kart grid */}
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