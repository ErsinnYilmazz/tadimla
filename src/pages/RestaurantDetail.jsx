import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import restaurantsData from "../data/restaurants.json";
import styles from "./RestaurantDetail.module.css";

function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items, totalItems, totalPrice } = useCart();
  const [added, setAdded] = useState({});

  const restaurant = restaurantsData.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className={styles.notFound}>
        <p>😕 Restoran bulunamadı</p>
        <button onClick={() => navigate("/restoranlar")}>Geri Dön</button>
      </div>
    );
  }

  const handleAdd = (item) => {
    addItem(item, restaurant.id);
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1000);
  };

  const getItemQuantity = (itemId) => {
    const found = items.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className={styles.page}>
      {/* Üst banner */}
      <div className={styles.banner}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Geri
          </button>
        </div>
      </div>

      {/* Restoran bilgileri */}
      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <div>
            <h1 className={styles.name}>{restaurant.name}</h1>
            <p className={styles.category}>{restaurant.category}</p>
          </div>
          <div className={styles.badge}>
            ⭐ {restaurant.rating}
            <span>({restaurant.reviewCount} yorum)</span>
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🕐</span>
            <div>
              <p className={styles.metaLabel}>Teslimat süresi</p>
              <p className={styles.metaValue}>{restaurant.deliveryTime} dk</p>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🛵</span>
            <div>
              <p className={styles.metaLabel}>Teslimat ücreti</p>
              <p className={styles.metaValue}>
                {restaurant.deliveryFee.toFixed(2)} ₺
              </p>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🧾</span>
            <div>
              <p className={styles.metaLabel}>Min. sipariş</p>
              <p className={styles.metaValue}>{restaurant.minimumOrder} ₺</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menü */}
      <div className={styles.menu}>
        <h2 className={styles.menuTitle}>Menü</h2>
        <div className={styles.menuGrid}>
          {restaurant.menu.map((item) => (
            <div key={item.id} className={styles.menuCard}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.menuImage}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/80x80/FF6B35/white?text=🍽️";
                }}
              />
              <div className={styles.menuInfo}>
                <h3 className={styles.menuName}>{item.name}</h3>
                <p className={styles.menuPrice}>{item.price.toFixed(2)} ₺</p>
              </div>
              <button
                onClick={() => handleAdd(item)}
                className={`${styles.addButton} ${added[item.id] ? styles.addedButton : ""}`}
              >
                {added[item.id]
                  ? "✓"
                  : getItemQuantity(item.id) > 0
                    ? `+${getItemQuantity(item.id)}`
                    : "+"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sepet özeti */}
      {totalItems > 0 && (
        <div className={styles.cartBar}>
          <span>{totalItems} ürün</span>
          <span className={styles.cartBarTotal}>{totalPrice.toFixed(2)} ₺</span>
          <button
            onClick={() => navigate("/sepet")}
            className={styles.cartBarButton}
          >
            Sepete Git →
          </button>
        </div>
      )}
    </div>
  );
}

export default RestaurantDetail;
