import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyOrders } from '../services/orderService'
import styles from './Profile.module.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/giris')
      return
    }
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getStatusLabel = (status) => {
    const map = {
      pending: '⏳ Hazırlanıyor',
      preparing: '👨‍🍳 Hazırlanıyor',
      on_the_way: '🛵 Yolda',
      delivered: '✅ Teslim Edildi',
    }
    return map[status] || status
  }

  const getStatusColor = (status) => {
    const map = {
      pending: '#FF9800',
      preparing: '#2196F3',
      on_the_way: '#9C27B0',
      delivered: '#4CAF50',
    }
    return map[status] || '#888'
  }

  return (
    <div className={styles.page}>

      {/* Profil Başlık */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {user?.user_metadata?.name?.charAt(0).toUpperCase() || '👤'}
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{user?.user_metadata?.name || 'Kullanıcı'}</h1>
          <p className={styles.email}>{user?.email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Çıkış Yap
        </button>
      </div>

      {/* Sipariş Geçmişi */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📦 Sipariş Geçmişim</h2>

        {loading ? (
          <p className={styles.loading}>⏳ Siparişler yükleniyor...</p>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🛒</p>
            <p>Henüz siparişin yok</p>
            <button
              onClick={() => navigate('/restoranlar')}
              className={styles.browseButton}
            >
              Restoranlara Göz At
            </button>
          </div>
        ) : (
          <div className={styles.orders}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span
                    className={styles.orderStatus}
                    style={{ backgroundColor: getStatusColor(order.status) + '22', color: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderAddress}>
                    📍 {order.delivery_address}
                  </div>
                  <div className={styles.orderTotal}>
                    Toplam: <strong>{(Number(order.total_price) + Number(order.delivery_fee)).toFixed(2)} ₺</strong>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/siparis-takibi/${order.id}`)}
                  className={styles.trackButton}
                >
                  Siparişi Takip Et →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Profile