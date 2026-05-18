import { Link } from 'react-router-dom'
import styles from './RestaurantCard.module.css'

function RestaurantCard({ restaurant }) {
  const { id, name, category, rating, reviewCount, deliveryTime, deliveryFee, image, isOpen } = restaurant

  return (
    <Link to={`/restoran/${id}`} className={styles.card}>

      {/* Fotoğraf */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        {!isOpen && (
          <div className={styles.closedOverlay}>
            <span>Şu an kapalı</span>
          </div>
        )}
        <span className={styles.category}>{category}</span>
      </div>

      {/* Bilgiler */}
      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.rating}>
            ⭐ {rating}
            <span className={styles.reviewCount}>({reviewCount})</span>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>🕐 {deliveryTime} dk</span>
          <span className={styles.dot}>•</span>
          <span className={styles.metaItem}>
            {deliveryFee === 0 ? '🎉 Ücretsiz teslimat' : `🛵 ${deliveryFee.toFixed(2)} ₺`}
          </span>
        </div>
      </div>

    </Link>
  )
}

export default RestaurantCard