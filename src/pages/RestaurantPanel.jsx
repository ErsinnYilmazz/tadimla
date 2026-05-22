import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'
import styles from './RestaurantPanel.module.css'

function RestaurantPanel() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', price: '' })

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/giris'); return }
    if (profile && profile.role !== 'restaurant') { navigate('/'); return }
    if (profile) fetchData()
  }, [user, profile, authLoading])

  const fetchData = async () => {
    try {
      // Profildeki restaurant_id ile restoranı getir
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', profile.restaurant_id)
        .single()

      setRestaurant(restaurantData)

      if (restaurantData) {
        // Siparişleri getir
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .order('created_at', { ascending: false })

        setOrders(ordersData || [])

        // Menü öğelerini getir
        const { data: menuData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantData.id)
          .order('name')

        setMenuItems(menuData || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const startEdit = (item) => {
    setEditingItem(item.id)
    setEditForm({ name: item.name, price: item.price })
  }

  const saveEdit = async (itemId) => {
    await supabase
      .from('menu_items')
      .update({ name: editForm.name, price: Number(editForm.price) })
      .eq('id', itemId)

    setMenuItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, name: editForm.name, price: Number(editForm.price) } : i
    ))
    setEditingItem(null)
  }

  const toggleRestaurant = async () => {
    await supabase
      .from('restaurants')
      .update({ is_open: !restaurant.is_open })
      .eq('id', restaurant.id)
    setRestaurant(prev => ({ ...prev, is_open: !prev.is_open }))
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

  if (loading || authLoading) return <div className={styles.loading}>⏳ Yükleniyor...</div>

  if (!profile?.restaurant_id) {
    return (
      <div className={styles.noRestaurant}>
        <p className={styles.noRestaurantIcon}>🍽️</p>
        <h2>Henüz bir restoranınız yok</h2>
        <p>Admin panelinden size bir restoran atanmasını bekleyin.</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* Başlık */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🍽️ {restaurant?.name || 'Restoran Paneli'}</h1>
          <p className={styles.subtitle}>{restaurant?.category}</p>
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.statusBadge} ${restaurant?.is_open ? styles.open : styles.closed}`}>
            {restaurant?.is_open ? '🟢 Açık' : '🔴 Kapalı'}
          </span>
          <button
            onClick={toggleRestaurant}
            className={`${styles.toggleButton} ${restaurant?.is_open ? styles.toggleClose : styles.toggleOpen}`}
          >
            {restaurant?.is_open ? 'Restoranı Kapat' : 'Restoranı Aç'}
          </button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>📦</p>
          <p className={styles.statValue}>{orders.length}</p>
          <p className={styles.statLabel}>Toplam Sipariş</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>⏳</p>
          <p className={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</p>
          <p className={styles.statLabel}>Bekleyen</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>✅</p>
          <p className={styles.statValue}>{orders.filter(o => o.status === 'delivered').length}</p>
          <p className={styles.statLabel}>Teslim Edildi</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statIcon}>💰</p>
          <p className={styles.statValue}>
            {orders.reduce((sum, o) => sum + Number(o.total_price), 0).toFixed(2)} ₺
          </p>
          <p className={styles.statLabel}>Toplam Gelir</p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
        >
          📦 Siparişler
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`${styles.tab} ${activeTab === 'menu' ? styles.tabActive : ''}`}
        >
          🍽️ Menü Yönetimi
        </button>
      </div>

      {/* Siparişler */}
      {activeTab === 'orders' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Siparişler</h2>
          {orders.length === 0 ? (
            <p className={styles.empty}>Henüz sipariş yok</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <p className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span
                      className={styles.orderStatus}
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items?.map((item, i) => (
                      <div key={i} className={styles.orderItem}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div>
                      <p className={styles.orderAddress}>📍 {order.delivery_address}</p>
                      <p className={styles.orderTotal}>
                        Toplam: <strong>{(Number(order.total_price) + Number(order.delivery_fee)).toFixed(2)} ₺</strong>
                      </p>
                    </div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Menü Yönetimi */}
      {activeTab === 'menu' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Menü Yönetimi</h2>
          <div className={styles.menuList}>
            {menuItems.map(item => (
              <div key={item.id} className={styles.menuItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.menuImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/FF6B35/FFFFFF?text=Yemek' }}
                />

                {editingItem === item.id ? (
                  <div className={styles.editForm}>
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className={styles.editInput}
                      placeholder="Ürün adı"
                    />
                    <input
                      value={editForm.price}
                      onChange={e => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      className={styles.editInput}
                      placeholder="Fiyat"
                      type="number"
                    />
                    <div className={styles.editActions}>
                      <button onClick={() => saveEdit(item.id)} className={styles.saveButton}>✓ Kaydet</button>
                      <button onClick={() => setEditingItem(null)} className={styles.cancelButton}>✕ İptal</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.menuInfo}>
                    <h3 className={styles.menuName}>{item.name}</h3>
                    <p className={styles.menuPrice}>{Number(item.price).toFixed(2)} ₺</p>
                  </div>
                )}

                {editingItem !== item.id && (
                  <button onClick={() => startEdit(item)} className={styles.editButton}>
                    ✏️ Düzenle
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default RestaurantPanel