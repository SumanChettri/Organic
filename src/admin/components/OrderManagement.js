import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { OrderList, OrderCard } from '../styles/AdminStyled';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://192.168.171.156:5000/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <OrderList>
      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <OrderCard>
            <h4>Order #{order.id}</h4>
            <p>Status: {order.status}</p>
            <button>View Details</button>
            <button>Cancel</button>
          </OrderCard>
        </motion.div>
      ))}
    </OrderList>
  );
};

export default OrderManagement;
