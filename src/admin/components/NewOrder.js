import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Table } from 'react-bootstrap';

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const StyledTable = styled(Table)`
  th, td {
    text-align: center;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    th, td {
      padding: 5px;
    }
  }
`;

const NewOrders = () => {
  const [newOrders, setNewOrders] = useState([]);

  const fetchNewOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/new`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNewOrders(response.data);
    } catch (error) {
      console.error('Error fetching new orders:', error);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/approve`,
        { order_id: orderId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(response.data.message);
      setNewOrders(newOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  useEffect(() => {
    fetchNewOrders();
  }, []);

  return (
    <Container>
      <Title>New Orders</Title>
      <StyledTable striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Placed At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {newOrders.map(order => (
            <motion.tr 
              key={order.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <td>{order.id}</td>
              <td>{order.user_id}</td>
              <td>{order.Product ? order.Product.name : 'N/A'}</td>
              <td>{order.quantity}</td>
              <td>{order.payment_method}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => handleApproveOrder(order.id)}>
                  Approve
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </StyledTable>
    </Container>
  );
};

export default NewOrders;