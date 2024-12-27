import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styled from 'styled-components';
import { FaBox, FaTags, FaShoppingCart } from 'react-icons/fa';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  p {
    font-size: 2rem;
    color: #ff6600;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  .icon {
    font-size: 3rem;
    color: #ff6600;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://192.168.171.156:5000/stats');
        setStats({
          products: response.data.productCount,
          categories: response.data.categoryCount,
          orders: response.data.orderCount || 0, // Assuming you have an order count in your stats
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardContainer>
      <h1 className="fw-bold text-secondary mb-4" style={{ fontSize: '2.5rem' }}>Dashboard</h1>
      <StatsGrid>
        <StatsCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaBox className="icon" />
          <h3>Products</h3>
          <p>{stats.products}</p>
        </StatsCard>
        <StatsCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaTags className="icon" />
          <h3>Categories</h3>
          <p>{stats.categories}</p>
        </StatsCard>
        <StatsCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaShoppingCart className="icon" />
          <h3>Orders</h3>
          <p>{stats.orders}</p>
        </StatsCard>
      </StatsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;