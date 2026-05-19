import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Checkout.module.css'

const DELIVERY_FEE = 9.90

function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🛒</p>
        <h2>Sepetiniz boş</h2>
        <button onClick={() => navigate('/restoranlar')} className={styles.browseButton}>
          Restoranlara Git
        </button>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Ad soyad gerekli'
    if (!form.phone.trim()) newErrors.phone = 'Telefon gerekli'
    if (!form.address.trim()) newErrors.address = 'Adres gerekli'
    if (form.paymentMethod === 'card') {
      if (!form.cardNumber.trim()) newErrors.cardNumber = 'Kart numarası gerekli'
      if (!form.cardExpiry.trim()) newErrors.cardExpiry = 'Son kullanma tarihi gerekli'
      if (!form.cardCvv.trim()) newErrors.cardCvv = 'CVV gerekli'
    }
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    setTimeout(() => {
      clearCart()
      navigate('/siparis-takibi/TDM-2024-001')
    }, 1500)
  }

  const total = totalPrice + DELIVERY_FEE

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => navigate('/sepet')} className={styles.backButton}>
          ← Sepete Dön
        </button>
        <h1 className={styles.title}>Ödeme</h1>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📍 Teslimat Bilgileri</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ad Soyad</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ersin Yılmaz"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Telefon</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0555 555 55 55"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Teslimat Adresi</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Mahalle, sokak, bina no, daire no..."
                className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
                rows={3}
              />
              {errors.address && <p className={styles.error}>{errors.address}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Sipariş Notu (opsiyonel)</label>
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Zile basmayın, kapıya bırakın..."
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>💳 Ödeme Yöntemi</h2>
            <div className={styles.paymentMethods}>
              <button
                onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'card' }))}
                className={`${styles.paymentMethod} ${form.paymentMethod === 'card' ? styles.paymentActive : ''}`}
              >
                💳 Kredi / Banka Kartı
              </button>
              <button
                onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cash' }))}
                className={`${styles.paymentMethod} ${form.paymentMethod === 'cash' ? styles.paymentActive : ''}`}
              >
                💵 Kapıda Nakit
              </button>
              <button
                onClick={() => setForm(prev => ({ ...prev, paymentMethod: 'cardondoor' }))}
                className={`${styles.paymentMethod} ${form.paymentMethod === 'cardondoor' ? styles.paymentActive : ''}`}
              >
                🖥️ Kapıda Kart
              </button>
            </div>

            {form.paymentMethod === 'card' && (
              <div className={styles.cardFields}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Kart Numarası</label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                  />
                  {errors.cardNumber && <p className={styles.error}>{errors.cardNumber}</p>}
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Son Kullanma</label>
                    <input
                      name="cardExpiry"
                      value={form.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`${styles.input} ${errors.cardExpiry ? styles.inputError : ''}`}
                    />
                    {errors.cardExpiry && <p className={styles.error}>{errors.cardExpiry}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CVV</label>
                    <input
                      name="cardCvv"
                      value={form.cardCvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={3}
                      className={`${styles.input} ${errors.cardCvv ? styles.inputError : ''}`}
                    />
                    {errors.cardCvv && <p className={styles.error}>{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {(form.paymentMethod === 'cash' || form.paymentMethod === 'cardondoor') && (
              <div className={styles.infoBox}>
                <p>
                  {form.paymentMethod === 'cash'
                    ? '💵 Kurye kapınıza geldiğinde nakit ödeme yapabilirsiniz.'
                    : '🖥️ Kurye yanında POS cihazı getirecektir.'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>
            <div className={styles.summaryItems}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>
                    {item.name}
                    <span className={styles.summaryItemQty}> × {item.quantity}</span>
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Ara toplam</span>
              <span>{totalPrice.toFixed(2)} ₺</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Teslimat ücreti</span>
              <span>{DELIVERY_FEE.toFixed(2)} ₺</span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Toplam</span>
              <span className={styles.summaryTotalPrice}>{total.toFixed(2)} ₺</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${styles.submitButton} ${loading ? styles.submitLoading : ''}`}
            >
              {loading ? '⏳ Sipariş veriliyor...' : `🛵 Siparişi Onayla — ${total.toFixed(2)} ₺`}
            </button>
            <p className={styles.secureNote}>🔒 Güvenli ödeme altyapısı</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout