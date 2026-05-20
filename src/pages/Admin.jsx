import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import styles from "./Admin.module.css";

function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalRestaurants: 0,
  });

  useEffect(() => {
  if (authLoading) return
  if (!user) { navigate('/giris'); return }

  const checkAdmin = async () => {
    const { data } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!data) { navigate('/'); return }
    setIsAdmin(true)

    try {
      const [ordersRes, restaurantsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('restaurants').select('*').order('name')
      ])

      const ordersData = ordersRes.data || []
      const restaurantsData = restaurantsRes.data || []

      setOrders(ordersData)
      setRestaurants(restaurantsData)

      const totalRevenue = ordersData.reduce((sum, o) =>
        sum + Number(o.total_price) + Number(o.delivery_fee), 0)

      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        totalRestaurants: restaurantsData.length,
        totalUsers: new Set(ordersData.map(o => o.user_id)).size
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
    await supabase.from("orders").update({ status }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const toggleRestaurant = async (id, isOpen) => {
    await supabase
      .from("restaurants")
      .update({ is_open: !isOpen })
      .eq("id", id);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_open: !isOpen } : r)),
    );
  };

  const getStatusLabel = (status) => {
    const map = {
      pending: "⏳ Bekliyor",
      preparing: "👨‍🍳 Hazırlanıyor",
      on_the_way: "🛵 Yolda",
      delivered: "✅ Teslim Edildi",
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "#FF9800",
      preparing: "#2196F3",
      on_the_way: "#9C27B0",
      delivered: "#4CAF50",
    };
    return map[status] || "#888";
  };

  if (loading) return <div className={styles.loading}>⏳ Yükleniyor...</div>;
  if (!isAdmin) return null;

  return (
    <div className={styles.page}>
      {/* Başlık */}
      <div className={styles.header}>
        <h1 className={styles.title}>🔧 Admin Paneli</h1>
        <p className={styles.subtitle}>tadımla yönetim merkezi</p>
      </div>

      {/* İstatistikler */}
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
          <p className={styles.statLabel}>Aktif Kullanıcı</p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("orders")}
          className={`${styles.tab} ${activeTab === "orders" ? styles.tabActive : ""}`}
        >
          📦 Siparişler
        </button>
        <button
          onClick={() => setActiveTab("restaurants")}
          className={`${styles.tab} ${activeTab === "restaurants" ? styles.tabActive : ""}`}
        >
          🍽️ Restoranlar
        </button>
      </div>

      {/* Siparişler */}
      {activeTab === "orders" && (
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
              {orders.map((order) => (
                <div key={order.id} className={styles.tableRow}>
                  <span className={styles.orderId}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString("tr-TR")}
                  </span>
                  <span className={styles.orderAddress}>
                    {order.delivery_address || "-"}
                  </span>
                  <span className={styles.orderTotal}>
                    {(
                      Number(order.total_price) + Number(order.delivery_fee)
                    ).toFixed(2)}{" "}
                    ₺
                  </span>
                  <span
                    className={styles.orderStatus}
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
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
      {activeTab === "restaurants" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Restoranları Yönet</h2>
          <div className={styles.restaurantGrid}>
            {restaurants.map((r) => (
              <div key={r.id} className={styles.restaurantCard}>
                <img
                  src={r.image}
                  alt={r.name}
                  className={styles.restaurantImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/120x80/FF6B35/FFFFFF?text=Tadimla";
                  }}
                />
                <div className={styles.restaurantInfo}>
                  <h3 className={styles.restaurantName}>{r.name}</h3>
                  <p className={styles.restaurantCategory}>{r.category}</p>
                  <p className={styles.restaurantRating}>⭐ {r.rating}</p>
                </div>
                <div className={styles.restaurantActions}>
                  <span
                    className={`${styles.statusBadge} ${r.is_open ? styles.open : styles.closed}`}
                  >
                    {r.is_open ? "🟢 Açık" : "🔴 Kapalı"}
                  </span>
                  <button
                    onClick={() => toggleRestaurant(r.id, r.is_open)}
                    className={`${styles.toggleButton} ${r.is_open ? styles.toggleClose : styles.toggleOpen}`}
                  >
                    {r.is_open ? "Kapat" : "Aç"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
