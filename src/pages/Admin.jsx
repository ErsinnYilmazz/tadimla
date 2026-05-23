import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'
import styles from './Admin.module.css'

function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalRestaurants: 0
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/giris'); return }

    const checkAdmin = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!data || data.role !== 'admin') { navigate('/'); return }
      setIsAdmin(true)

      try {
        const [ordersRes, restaurantsRes, usersRes] = await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('restaurants').select('*').order('name'),
          supabase.from('profiles').select('*').order('created_at', { ascending: false })
        ])

        const ordersData = ordersRes.data || []
        const restaurantsData = restaurantsRes.data || []
        const usersData = usersRes.data || []

        setOrders(ordersData)
        setRestaurants(restaurantsData)
        setUsers(usersData)

        const totalRevenue = ordersData.reduce((sum, o) =>
          sum + Number(o.total_price) + Number(o.delivery_fee), 0)

        setStats({
          totalOrders: ordersData.length,
          totalRevenue,
          totalRestaurants: restaurantsData.length,
          totalUsers: usersData.length
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [user, authLoading])

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const toggleRestaurant = async (id, isOpen) => {
    await supabase.from('restaurants').update({ is_open: !isOpen }).eq('id', id)
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, is_open: !isOpen } : r))
  }

  const updateUserRole = async (userId, role) => {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
  }

  const assignRestaurant = async (userId, restaurantId) => {
    await supabase.from('profiles').update({ restaurant_id: restaurantId || null }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, restaurant_id: restaurantId } : u))
  }

  const resetPassword = async (email) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/parola-sifirla`
    })
    alert(`${email} adresine şifre sıfırlama e-postası gönderildi.`)
  }

  const getStatusLabel = (status) => {
    const map = {
      pending: '⏳ Bekliyor',
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

  const getRoleLabel = (role) => {
    const map = { user: '👤 Kullanıcı', restaurant: '🍽️ Restoran', admin: '🔧 Admin' }
    return map[role] || role
  }

  const getRoleColor = (role) => {
    const map = { user: '#2196F3', restaurant: '#FF9800', admin: '#9C27B0' }
    return map[role] || '#888'
  }

  if (loading) return <div className={styles.loading}>⏳ Yükleniyor...</div>
  if (!isAdmin) return null

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>🔧 Admin Paneli</h1>
        <p className={styles.subtitle}>tadımla yönetim merkezi</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>📦</p>
          <p className={styles.statValue}>{stats.totalOrders}</p>
          <p className={styles.statLabel}>Toplam Sipariş</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>💰</p>
          <p className={styles.statValue}>{stats.totalRevenue.toFixed(2)} ₺</p>
          <p className={styles.statLabel}>Toplam Gelir</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>🍽️</p>
          <p className={styles.statValue}>{stats.totalRestaurants}</p>
          <p className={styles.statLabel}>Restoran</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>👥</p>
          <p className={styles.statValue}>{stats.totalUsers}</p>
          <p className={styles.statLabel}>Kullanıcı</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
        >
          📦 Siparişler
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`${styles.tab} ${activeTab === 'restaurants' ? styles.tabActive : ''}`}
        >
          🍽️ Restoranlar
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
        >
          👥 Kullanıcılar
        </button>
      </div>

      {/* Siparişler */}
      {activeTab === 'orders' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tüm Siparişler</h2>
          {orders.length === 0 ? (
            <p className={styles.empty}>Henüz sipariş yok</p>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Sipariş ID</span>
                <span>Tarih</span>
                <span>Adres</span>
                <span>Tutar</span>
                <span>Durum</span>
                <span>İşlem</span>
              </div>
              {orders.map(order => (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </span>
                  <span className={styles.orderAddress}>{order.delivery_address || '-'}</span>
                  <span className={styles.orderTotal}>
                    {(Number(order.total_price) + Number(order.delivery_fee)).toFixed(2)} ₺
                  </span>
                  <span className={styles.orderStatus} style={{ color: getStatusColor(order.status) }}>
                    {getStatusLabel(order.status)}
                  </span>
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="preparing">Hazırlanıyor</option>
                    <option value="on_the_way">Yolda</option>
                    <option value="delivered">Teslim Edildi</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Restoranlar */}
      {activeTab === 'restaurants' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Restoranları Yönet</h2>
          <div className={styles.restaurantGrid}>
            {restaurants.map(r => (
              <div key={r.id} className={styles.restaurantCard}>
                <img
                  src={r.image}
                  alt={r.name}
                  className={styles.restaurantImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x80/FF6B35/FFFFFF?text=Tadimla' }}
                />
                <div className={styles.restaurantInfo}>
                  <h3 className={styles.restaurantName}>{r.name}</h3>
                  <p className={styles.restaurantCategory}>{r.category}</p>
                  <p className={styles.restaurantRating}>⭐ {r.rating}</p>
                </div>
                <div className={styles.restaurantActions}>
                  <span className={`${styles.statusBadge} ${r.is_open ? styles.open : styles.closed}`}>
                    {r.is_open ? '🟢 Açık' : '🔴 Kapalı'}
                  </span>
                  <button
                    onClick={() => toggleRestaurant(r.id, r.is_open)}
                    className={`${styles.toggleButton} ${r.is_open ? styles.toggleClose : styles.toggleOpen}`}
                  >
                    {r.is_open ? 'Kapat' : 'Aç'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kullanıcılar */}
      {activeTab === 'users' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Kullanıcı Yönetimi</h2>
          <div className={styles.usersList}>
            {users.map(u => (
              <div key={u.id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {u.name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className={styles.userInfo}>
                  <p className={styles.userName}>{u.name || 'İsimsiz'}</p>
                  <p className={styles.userEmail}>{u.email}</p>
                  <span
                    className={styles.userRoleBadge}
                    style={{ backgroundColor: getRoleColor(u.role) + '22', color: getRoleColor(u.role) }}
                  >
                    {getRoleLabel(u.role)}
                  </span>
                </div>
                <div className={styles.userActions}>
                  <select
                    value={u.role}
                    onChange={e => updateUserRole(u.id, e.target.value)}
                    className={styles.roleSelect}
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="restaurant">Restoran</option>
                    <option value="admin">Admin</option>
                  </select>

                  {u.role === 'restaurant' && (
                    <select
                      value={u.restaurant_id || ''}
                      onChange={e => assignRestaurant(u.id, e.target.value)}
                      className={styles.restaurantSelect}
                    >
                      <option value="">Restoran seç</option>
                      {restaurants.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={() => resetPassword(u.email)}
                    className={styles.resetButton}
                  >
                    🔑 Şifre Sıfırla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Admin