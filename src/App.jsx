import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Sayfalar — şimdilik placeholder
function Home() { return <div>Ana Sayfa</div> }
function Restaurants() { return <div>Restoranlar</div> }
function RestaurantDetail() { return <div>Restoran Detay</div> }
function Cart() { return <div>Sepet</div> }
function Checkout() { return <div>Ödeme</div> }
function OrderTracking() { return <div>Sipariş Takibi</div> }
function MoodFood() { return <div>Ruh Haline Göre Yemek</div> }
function NotFound() { return <div>Sayfa Bulunamadı</div> }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restoranlar" element={<Restaurants />} />
        <Route path="/restoran/:id" element={<RestaurantDetail />} />
        <Route path="/sepet" element={<Cart />} />
        <Route path="/odeme" element={<Checkout />} />
        <Route path="/siparis-takibi/:id" element={<OrderTracking />} />
        <Route path="/ruh-haline-gore" element={<MoodFood />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App