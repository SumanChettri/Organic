import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserEdit, FaLock, FaImage, FaClipboardList, FaHeart, FaTicketAlt, FaBell, FaStar, FaSignOutAlt } from "react-icons/fa";

// Styled Components
const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
`;

const AccountTitle = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const AccountOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 1s ease-in-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OptionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f2f2f2;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  color: #fff;
  background-color: #ff6b6b;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4b4b;
  }

  svg {
    font-size: 1.5rem;
  }
`;

// User Account Component
const UserAccount = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // Force refresh the page after logout
  };

  return (
    <AccountContainer>
      <AccountTitle>My Account</AccountTitle>
      <AccountOptions>
        <OptionLink to="/orders">
          <FaClipboardList /> My Orders
        </OptionLink>
        <OptionLink to="/wishlist">
          <FaHeart /> Wishlist
        </OptionLink>
        <OptionLink to="/coupons">
          <FaTicketAlt /> Coupons
        </OptionLink>
        <OptionLink to="/notifications">
          <FaBell /> Manage Notifications
        </OptionLink>
        <OptionLink to="/edit-profile">
          <FaUserEdit /> Edit Profile
        </OptionLink>
        <OptionLink to="/reviews">
          <FaStar /> Reviews
        </OptionLink>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </AccountOptions>
    </AccountContainer>
  );
};

export default UserAccount;