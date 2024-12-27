import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

// Styled Components
const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  z-index: 1000;

  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  background: #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SiteName = styled.h1`
  font-size: 1.6rem;
  color: #fff;
  margin-left: 40px;
`;

const MenuIcon = styled(FaBars)`
  font-size: 1.5rem;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SidebarLink = styled.div`
  margin-bottom: 20px;

  a {
    color: #fff;
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.3s;

    &:hover {
      color: #ff6600;
    }
  }
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <SiteName>OrganicStore</SiteName>
        </SidebarHeader>
        <SidebarContent>
          <SidebarLink>
            <Link to="/admin" onClick={toggleSidebar}>Dashboard</Link>
          </SidebarLink>
          <SidebarLink>
            <Link to="/admin/products" onClick={toggleSidebar}>Products</Link>
          </SidebarLink>
          <SidebarLink>
            <Link to="/admin/categories" onClick={toggleSidebar}>Categories</Link>
          </SidebarLink>
          <SidebarLink>
            <Link to="/admin/orders" onClick={toggleSidebar}>Orders</Link>
          </SidebarLink>
        </SidebarContent>
      </SidebarContainer>
      <MenuIcon onClick={toggleSidebar} style={{ position: 'fixed', top: '20px', left: '20px', color: '#000', zIndex: '1000' }} />
    </>
  );
};

export default Sidebar;