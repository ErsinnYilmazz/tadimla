import { Link } from 'react-router-dom'
import styles from './RestaurantCard.module.css'

function RestaurantCard({ restaurant }) {
  const { id, name, category, rating, review_count, delivery_time, delivery_fee, image, is_open } = restaurant

  return (
    <Link to={`/restoran/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={name}
          className={styles.image}
          onError={(e) => { e.target.src = 'https://placehold.co/400x250/FF6B35/white?text=🍽️' }}
        />
        {!is_open && (
          <div className={styles.closedOverlay}>
            <span>Şu an kapalı</span>
          </div>
        )}
        <span className={styles.category}>{category}</span>
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.rating}>
            ⭐ {rating}
            <span className={styles.reviewCount}>({review_count})</span>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>🕐 {delivery_time} dk</span>
          <span className={styles.dot}>•</span>
          <span className={styles.metaItem}>
            {Number(delivery_fee) === 0 ? '🎉 Ücretsiz teslimat' : `🛵 ${Number(delivery_fee).toFixed(2)} ₺`}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard