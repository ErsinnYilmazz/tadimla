import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import MoodFood from './pages/MoodFood'
import OrderTracking from './pages/OrderTracking'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

function NotFound() { return <div style={{padding: '2rem', textAlign: 'center'}}>404 — Sayfa Bulunamadı</div> }

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restoranlar" element={<Restaurants />} />
              <Route path="/restoran/:id" element={<RestaurantDetail />} />
              <Route path="/sepet" element={<Cart />} />
              <Route path="/odeme" element={<Checkout />} />
              <Route path="/siparis-takibi/:id" element={<OrderTracking />} />
              <Route path="/siparis-takibi" element={<OrderTracking />} />
              <Route path="/ruh-haline-gore" element={<MoodFood />} />
              <Route path="/giris" element={<Auth />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App