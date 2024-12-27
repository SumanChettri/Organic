import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Ensure you have this import for navigation

// Admin Container
export const AdminContainer = styled.div`
  display: flex;
  flex-direction: row;
   text-decoration: none;
  min-height: 100vh;
  background-color: #f4f7fc;
`;

// Sidebar Styling
export const SidebarContainer = styled.div`
  width: 170px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  position: fixed;
  height: 100%;
  transition: all 0.3s ease;
 text-decoration: none;
  /* On small screens, reduce the width */
  @media (max-width: 500px) {
    width: 100px;  /* Medium screens */
  }

  @media (max-width: 576px) {
    width: 150px; /* Even smaller width on mobile */
    position: relative; /* Make sidebar behave as a block element */
    height: auto;
  }

  &:hover {
    width: 160px; /* Original width for larger screens */
  }
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
   text-decoration: none;
  gap: 13px;
  @media (max-width: 200px) {
   text-decoration: none;
    flex-direction: column; /* Make the sidebar links stack on smaller screens */
    align-items: flex-start;
  }
`;



// Export SidebarLink with formal design and subtle hover animations
export const SidebarLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  color: #ecf0f1;
  border-radius: 4px;
  background-color: #34495e;
  transition: all 0.3s ease;
  margin: 8px 0;
  & > a {
    text-decoration: none; /* Remove underline */
    color: inherit; /* Inherit color from parent */
  }
  /* Subtle shadow and background change on hover */
  &:hover {
  text-decoration: none;
    color: #fff;
    background-color: #2980b9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
  }

  /* Active state for a more tactile feel */
  &:active {
    background-color: #3498db;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transform: translateX(2px);
  }

  /* Focus state for better accessibility */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.4);
  }

  /* Responsive adjustments */
  @media (max-width: 576px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;




// Content Area
export const ContentArea = styled.div`
  flex-grow: 1;
  margin-left: 250px; /* Adjust based on sidebar size */
  padding: 20px;
 text-decoration: none;
  @media (max-width: 768px) {
    margin-left: 200px; /* Adjust for medium screens */
  }

  @media (max-width: 576px) {
    margin-left: 0; /* Full width for mobile */
    padding: 10px;
  }
`;

// Dashboard Styling
export const DashboardContainer = styled.div`
  h1 {
    margin-bottom: 20px;
  }
`;

// Card Components
export const StatsCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

// Add Category Button
export const AddCategoryButton = styled.button`
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

// Category Management Components
export const CategoryCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Order Management Components
export const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const OrderCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

// Product Management Components
export const AddProductButton = styled.button`
  background-color: #2ecc71;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`;

export const ProductCard = styled.div`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
