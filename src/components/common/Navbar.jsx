import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

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

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>👤 {user.user_metadata?.name?.split(' ')[0] || user.email}</span>
              <button onClick={logout} className={styles.logoutButton}>Çıkış</button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/giris')}
              className={styles.loginButton}
            >
              Giriş Yap
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar