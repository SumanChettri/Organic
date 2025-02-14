// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css'; // This imports the Bootstrap CSS
import './App.css';
import './index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./components/home";
import Shop from "./components/shop";
import Signup from "./components/signup";
import Login from "./components/login";
import ProductDetail from "./components/ProductDetails"; // Import your product detail component
import AdminPage from './admin/admin'; // Import your admin page component
import Cart from "./components/Cart";
import Acc from "./components/UserAccount";
import Order from "./components/orders"
function App() {
  return (
    <Router> {/* This Router handles all routes in the app */}
      <Routes>
        {/* User Pages with Navbar and Footer */}

        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
        <Route path="/shop" element={<><Navbar /><Shop /><Footer /></>} />
        <Route path="/account" element={<><Navbar /><Acc /><Footer /></>} />
        <Route path="/product/:id" element={<><Navbar /><ProductDetail /><Footer /></>} /> {/* Product detail page */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<><Navbar /><Order /><Footer /></>} />
 

        {/* Admin Pages without Navbar and Footer */}
        <Route path="/admin/*" element={<AdminPage />} /> {/* Admin page only renders admin layout */}

      </Routes>
    </Router>
  );
}

export default App;