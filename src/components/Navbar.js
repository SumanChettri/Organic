import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

// Styled Components
const NavbarContainer = styled.nav`
  background: linear-gradient(90deg, #1f4037, #99f2c8);
  padding: 15px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Brand = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ffcc29;
  }
`;

const MenuButton = styled.div`
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    width: ${({ $isOpen }) => ($isOpen ? "40%" : "0")};
    background: linear-gradient(90deg, #1f4037, #99f2c8);
    overflow: hidden;
    transform: ${({ $isOpen }) => ($isOpen ? "translateY(0)" : "translateY(-200%)")};
  }
`;

const MenuItem = styled.li`
  margin: 0 15px;
  transition: margin 0.3s ease;

  @media (max-width: 768px) {
    margin: 20px 20px;
    text-align: center;
  }
`;

const MenuLink = styled(Link)`
  font-size: 1.1rem;
  color: #fff;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &.active {
    background-color: #ffcc29;
    color: #000;
  }

  &:hover {
    background-color: #ffcc29;
    color: #000;
  }
`;

const ActionButton = styled.button`
  font-size: 1rem;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  color: #fff;
  background: #ff6b6b;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ffcc29;
    color: #000;
  }
`;

const CartIcon = styled(Link)`
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #ffcc29;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff6b6b;
  color: #fff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
`;

const UserIcon = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
  margin-left: 15px;
  cursor: pointer;
  transition: border 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border: 2px solid #ffcc29;
  }
`;

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  // Handle Menu Toggle
  const handleToggle = () => setIsOpen(!isOpen);

  // Sync Login State with LocalStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Listen to localStorage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Sync Cart Count with LocalStorage
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    const handleStorageChange = () => {
      fetchCartCount();
    };

    // Listen to localStorage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch Profile Image
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile-image`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [isLoggedIn]);

  // Handle Login
  const handleLogin = () => {
    localStorage.setItem("token", "dummy-token"); // Add a token
    setIsLoggedIn(true);
    navigate('/'); // Navigate to home page to trigger re-render
  };

  return (
    <NavbarContainer>
      <MenuButton onClick={handleToggle}>
        {isOpen ? <span>&#10005;</span> : <span>&#9776;</span>}
      </MenuButton>
      <Brand to="/">OrganicStore</Brand>
      <Menu $isOpen={isOpen}>
        <MenuItem>
          <MenuLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/shop" onClick={() => setIsOpen(false)}>
            Shop
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/about" onClick={() => setIsOpen(false)}>
            About
          </MenuLink>
        </MenuItem>
        {!isLoggedIn && (
          <>
            <MenuItem>
              <ActionButton onClick={handleLogin}>Login</ActionButton>
            </MenuItem>
            <MenuItem>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <ActionButton>Signup</ActionButton>
              </Link>
            </MenuItem>
          </>
        )}
      </Menu>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isLoggedIn && (
          <>
            <CartIcon to="/cart">
              <FaShoppingCart />
              {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
            </CartIcon>
            <UserIcon to="/account">
              <img src={profileImage || "/images/default-profile.png"} alt="User Profile" />
            </UserIcon>
          </>
        )}
      </div>
    </NavbarContainer>
  );
};

export default Navbar;