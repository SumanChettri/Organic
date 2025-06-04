import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./components/home";
import Shop from "./components/shop";
import Signup from "./components/signup";
import Login from "./components/login";
import ProductDetail from "./components/ProductDetails";
import AdminPage from './admin/admin';
import Cart from "./components/Cart";
import Acc from "./components/UserAccount";
import Order from "./components/orders";
import About from './components/About';

function AppContent({ isLoggedIn, setIsLoggedIn, handleLogin }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/account" element={<Acc />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Order />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  };

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogin={handleLogin} />
    </Router>
  );
}

export default App;