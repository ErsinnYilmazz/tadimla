import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import './index.css'

function Home() { return <div style={{padding: '2rem'}}>Ana Sayfa</div> }
function Restaurants() { return <div style={{padding: '2rem'}}>Restoranlar</div> }
function RestaurantDetail() { return <div style={{padding: '2rem'}}>Restoran Detay</div> }
function Cart() { return <div style={{padding: '2rem'}}>Sepet</div> }
function Checkout() { return <div style={{padding: '2rem'}}>Ödeme</div> }
function OrderTracking() { return <div style={{padding: '2rem'}}>Sipariş Takibi</div> }
function MoodFood() { return <div style={{padding: '2rem'}}>Ruh Haline Göre Yemek</div> }
function NotFound() { return <div style={{padding: '2rem'}}>Sayfa Bulunamadı</div> }

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
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
      </main>
    </BrowserRouter>
  )
}

export default App