import Navbar from './Navbar'
import styles from './Layout.module.css'

function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <span className={styles.logo}>🔥 TADIMLA </span>
          <p className={styles.text}>© 2026 Tadımla. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout