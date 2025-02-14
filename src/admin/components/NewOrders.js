import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Table } from 'react-bootstrap';

const NewOrdersContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
`;

const NewOrders = () => {
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    const fetchNewOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/new`);
        setNewOrders(response.data);
      } catch (error) {
        console.error('Error fetching new orders:', error);
      }
    };

    fetchNewOrders();
  }, []);

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/approve`, { order_id: orderId });
      alert(response.data.message);
      setNewOrders(newOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  return (
    <NewOrdersContainer>
      <h1 className="fw-bold text-secondary mb-4" style={{ fontSize: '2.5rem' }}>New Orders</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Payment Method</th>
            <th>Order Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {newOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_id}</td>
              <td>{order.product_id}</td>
              <td>{order.quantity}</td>
              <td>{order.payment_method}</td>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>
                <Button variant="success" onClick={() => handleApproveOrder(order.id)}>Approve</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </NewOrdersContainer>
  );
};

export default NewOrders;