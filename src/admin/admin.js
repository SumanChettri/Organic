import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

import ProductManagement from './components/ProductManagement';
import CategoryManagement from './components/CategoryManagement';
import OrderManagement from './components/OrderManagement';
import { AdminContainer, ContentArea } from './styles/AdminStyled';

const Admin = () => {
  return (
    <AdminContainer>
      <Sidebar />
      <ContentArea>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Routes>
      </ContentArea>
    </AdminContainer>
  );
};

export default Admin;
