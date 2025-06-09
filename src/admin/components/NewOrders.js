import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Table, Form, Modal } from 'react-bootstrap';

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
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [form, setForm] = useState({
    user_id: '',
    product_id: '',
    quantity: 1,
    payment_method: 'stripe',
    status: 'pending'
  });

  // Fetch orders
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

  // Approve order
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

  // Open modal for add/edit
  const handleShowModal = (order = null) => {
    setEditOrder(order);
    setForm(order ? {
      user_id: order.user_id,
      product_id: order.product_id,
      quantity: order.quantity,
      payment_method: order.payment_method,
      status: order.status
    } : {
      user_id: '',
      product_id: '',
      quantity: 1,
      payment_method: 'stripe',
      status: 'pending'
    });
    setShowModal(true);
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit add/edit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editOrder) {
        // Edit order
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/orders/${editOrder.id}`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert('Order updated!');
      } else {
        // Add order
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/orders`,
          form,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        alert('Order added!');
      }
      setShowModal(false);
      fetchNewOrders();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete order
  const handleDelete = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewOrders(newOrders.filter(order => order.id !== orderId));
    } catch (error) {
      alert('Error deleting order');
    }
  };

  useEffect(() => {
    fetchNewOrders();
  }, []);

  return (
    <Container>
      <Title>New Orders</Title>
      <Button variant="primary" onClick={() => handleShowModal()}>Add Order</Button>
      <StyledTable striped bordered hover responsive className="mt-3">
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
                </Button>{' '}
                <Button variant="warning" size="sm" onClick={() => handleShowModal(order)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
                  Delete
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </StyledTable>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editOrder ? 'Edit Order' : 'Add Order'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>User ID</Form.Label>
              <Form.Control
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                min={1}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                name="payment_method"
                as="select"
                value={form.payment_method}
                onChange={handleChange}
              >
                <option value="stripe">Stripe</option>
                <option value="cod">Cash on Delivery</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                name="status"
                as="select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="delivered">Delivered</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" className="mt-3" variant="primary">
              {editOrder ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default NewOrders;