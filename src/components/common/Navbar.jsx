import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          🔥 TADIMLA
        </Link>

        {/* Linkler */}
        <div className={styles.links}>
          <Link
            to="/"
            className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
          >
            Ana Sayfa
          </Link>
          <Link
            to="/restoranlar"
            className={`${styles.link} ${isActive('/restoranlar') ? styles.active : ''}`}
          >
            Restoranlar
          </Link>
          <Link
            to="/ruh-haline-gore"
            className={`${styles.link} ${isActive('/ruh-haline-gore') ? styles.active : ''}`}
          >
            😊 Ruh Haline Göre
          </Link>
        </div>

        {/* Sağ taraf */}
        <div className={styles.actions}>
          <Link to="/sepet" className={styles.cartButton}>
            🛒 Sepet
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Navbar