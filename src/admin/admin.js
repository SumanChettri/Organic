import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import CategoryManagement from './components/CategoryManagement';
import OrderManagement from './components/OrderManagement';
import NewOrders from './components/NewOrders';
import AdminLogin from './components/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AdminContainer, ContentArea } from './styles/AdminStyled';

const Admin = () => {
  return (
    <AdminContainer>
      <Sidebar />
      <ContentArea>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/" 
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <AdminProtectedRoute>
                <ProductManagement />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <AdminProtectedRoute>
                <CategoryManagement />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <AdminProtectedRoute>
                <OrderManagement />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/orders/new" 
            element={
              <AdminProtectedRoute>
                <NewOrders />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </ContentArea>
    </AdminContainer>
  );
};

export default Admin;