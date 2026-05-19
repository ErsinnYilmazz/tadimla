import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'
import './index.css'

function Checkout() { return <div>Ödeme</div> }
function OrderTracking() { return <div>Sipariş Takibi</div> }
function MoodFood() { return <div>Ruh Haline Göre Yemek</div> }
function NotFound() { return <div>Sayfa Bulunamadı</div> }

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
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
        </Layout>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App