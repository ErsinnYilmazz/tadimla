import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './Navbar.module.css'

function Navbar() {
  const location = useLocation()
  const { totalItems } = useCart()

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        <Link to="/" className={styles.logo}>
          🔥 tadımla
        </Link>

        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Ana Sayfa
          </Link>
          <Link to="/restoranlar" className={`${styles.link} ${isActive('/restoranlar') ? styles.active : ''}`}>
            Restoranlar
          </Link>
          <Link to="/ruh-haline-gore" className={`${styles.link} ${isActive('/ruh-haline-gore') ? styles.active : ''}`}>
            😊 Ruh Haline Göre
          </Link>
        </div>

        <div className={styles.actions}>
          <Link to="/sepet" className={styles.cartButton}>
            🛒 Sepet
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar