import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'
import styles from './Profile.module.css'

function Profile() {
  const { user, profile, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/giris'); return }
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
    fetchOrders()
  }, [user, profile])

  const fetchOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
      })
      setSaveSuccess(true)
      setEditMode(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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

  return (
    <div className={styles.page}>

      {/* Profil Kartı */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '👤'}
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.name}>{profile?.name || 'Kullanıcı'}</h1>
          <p className={styles.email}>{user?.email}</p>
          <span className={styles.roleBadge}>
            {profile?.role === 'admin' ? '🔧 Admin' : profile?.role === 'restaurant' ? '🍽️ Restoran' : '👤 Kullanıcı'}
          </span>
        </div>
        <div className={styles.profileActions}>
          <button onClick={() => setEditMode(!editMode)} className={styles.editButton}>
            {editMode ? '✕ İptal' : '✏️ Düzenle'}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Başarı mesajı */}
      {saveSuccess && (
        <div className={styles.successMessage}>
          ✅ Profiliniz başarıyla güncellendi!
        </div>
      )}

      {/* Sekmeler */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
        >
          📦 Siparişlerim
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
        >
          👤 Bilgilerim
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`${styles.tab} ${activeTab === 'password' ? styles.tabActive : ''}`}
        >
          🔐 Şifre Değiştir
        </button>
      </div>

      {/* Siparişler */}
      {activeTab === 'orders' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sipariş Geçmişim</h2>
          {loading ? (
            <p className={styles.loading}>⏳ Yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyIcon}>🛒</p>
              <p>Henüz siparişin yok</p>
              <button onClick={() => navigate('/restoranlar')} className={styles.browseButton}>
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
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
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
                    {order.items?.map((item, i) => (
                      <div key={i} className={styles.orderItem}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.orderAddress}>📍 {order.delivery_address}</div>
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
      )}

      {/* Bilgiler */}
      {activeTab === 'profile' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Kişisel Bilgilerim</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ad Soyad</label>
            {editMode ? (
              <input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className={styles.input}
                placeholder="Ad Soyad"
              />
            ) : (
              <p className={styles.infoValue}>{profile?.name || '-'}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>E-posta</label>
            <p className={styles.infoValue}>{user?.email}</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Telefon</label>
            {editMode ? (
              <input
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className={styles.input}
                placeholder="0555 555 55 55"
              />
            ) : (
              <p className={styles.infoValue}>{profile?.phone || '-'}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Varsayılan Adres</label>
            {editMode ? (
              <textarea
                value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                className={styles.textarea}
                placeholder="Adresinizi girin..."
                rows={3}
              />
            ) : (
              <p className={styles.infoValue}>{profile?.address || '-'}</p>
            )}
          </div>

          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? '⏳ Kaydediliyor...' : '✓ Kaydet'}
            </button>
          )}
        </div>
      )}

      {/* Şifre Değiştir */}
      {activeTab === 'password' && (
        <ChangePassword />
      )}

    </div>
  )
}

function ChangePassword() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    const newErrors = {}
    if (!form.password) newErrors.password = 'Şifre gerekli'
    if (form.password.length < 6) newErrors.password = 'En az 6 karakter'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: form.password })
      if (error) throw error
      setSuccess(true)
      setForm({ password: '', confirmPassword: '' })
    } catch (err) {
      setErrors({ general: 'Şifre güncellenemedi' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Şifre Değiştir</h2>

      {success && (
        <div className={styles.successMessage}>✅ Şifreniz başarıyla güncellendi!</div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Yeni Şifre</label>
        <input
          type="password"
          value={form.password}
          onChange={e => { setForm(prev => ({ ...prev, password: e.target.value })); setErrors({}) }}
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          placeholder="En az 6 karakter"
        />
        {errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Şifre Tekrar</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={e => { setForm(prev => ({ ...prev, confirmPassword: e.target.value })); setErrors({}) }}
          className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          placeholder="Şifreni tekrar gir"
        />
        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
      </div>

      {errors.general && <div className={styles.errorMessage}>⚠️ {errors.general}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={styles.saveButton}
      >
        {loading ? '⏳ Güncelleniyor...' : '🔐 Şifremi Güncelle'}
      </button>
    </div>
  )
}

export default Profile