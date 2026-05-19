import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Cart.module.css'

function Cart() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🛒</p>
        <h2 className={styles.emptyTitle}>Sepetiniz boş</h2>
        <p className={styles.emptyText}>Lezzetli yemekler sizi bekliyor!</p>
        <button
          onClick={() => navigate('/restoranlar')}
          className={styles.browseButton}
        >
          Restoranlara Göz At
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sepetim</h1>
        <button onClick={clearCart} className={styles.clearButton}>
          Sepeti Temizle
        </button>
      </div>

      <div className={styles.layout}>

        {/* Ürün listesi */}
        <div className={styles.items}>
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/80x80/FF6B35/white?text=🍽️'
                }}
              />
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>{item.price.toFixed(2)} ₺</p>
              </div>
              <div className={styles.quantity}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className={styles.quantityBtn}
                >
                  −
                </button>
                <span className={styles.quantityValue}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              <p className={styles.itemTotal}>
                {(item.price * item.quantity).toFixed(2)} ₺
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className={styles.removeButton}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Sipariş özeti */}
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>

          <div className={styles.summaryRow}>
            <span>Ürünler ({totalItems})</span>
            <span>{totalPrice.toFixed(2)} ₺</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Teslimat ücreti</span>
            <span>9.90 ₺</span>
          </div>
          <div className={styles.summaryDivider} />
          <div className={styles.summaryTotal}>
            <span>Toplam</span>
            <span>{(totalPrice + 9.90).toFixed(2)} ₺</span>
          </div>

          <button
            onClick={() => navigate('/odeme')}
            className={styles.checkoutButton}
          >
            Siparişi Tamamla →
          </button>

          <button
            onClick={() => navigate('/restoranlar')}
            className={styles.continueButton}
          >
            Alışverişe Devam Et
          </button>
        </div>

      </div>
    </div>
  )
}

export default Cart