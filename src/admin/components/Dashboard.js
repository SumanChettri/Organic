import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import styled from 'styled-components';
import { FaBox, FaTags, FaShoppingCart } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

const DashboardContainer = styled(Container)`
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

const StatsGrid = styled(Row)`
  width: 100%;
  max-width: 1200px;
  gap: 20px;
`;

const StatsCard = styled(motion.create(Col))`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/stats`);
        setStats({
          products: response.data.productCount,
          categories: response.data.categoryCount,
          orders: response.data.orderCount || 0,
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };

    fetchStats();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <DashboardContainer>
      <h1 className="fw-bold text-secondary mb-4" style={{ fontSize: '2.5rem' }}>Dashboard</h1>
      <StatsGrid>
        <StatsCard
          as={motion.create.div}
          xs={12} md={4}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => handleCardClick('./products')}
        >
          <FaBox className="icon" />
          <h3>Products</h3>
          <p>{stats.products}</p>
        </StatsCard>
        <StatsCard
          as={motion.create.div}
          xs={12} md={4}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => handleCardClick('./categories')}
        >
          <FaTags className="icon" />
          <h3>Categories</h3>
          <p>{stats.categories}</p>
        </StatsCard>
        <StatsCard
          as={motion.create.div}
          xs={12} md={4}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => handleCardClick('./orders')}
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