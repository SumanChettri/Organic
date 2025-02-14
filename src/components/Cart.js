import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./footer";

// Styled Components for Cart Page
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fa;
`;

const CartContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const CartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
`;

const CartHeader = styled(motion.h1)`
  font-size: 2.5rem;
  color: #333;
  text-align: center;
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
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: linear-gradient(135deg, #ffffff, #f1f1f1);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
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

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  color: #28a745;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #666;
`;

const QuantityButton = styled(motion.button)`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled(motion.button)`
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #c82333;
    transform: scale(1.05);
  }
`;

const CheckoutSection = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  height: fit-content;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  margin-bottom: 10px;
  color: #666;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 15px;
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #218838;
    transform: scale(1.05);
  }
`;

// Main Component
const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Cart data:", response.data); // Debug: Check the data returned by the backend
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      const token = localStorage.getItem("token");
      console.log(`Updating quantity for item ${id} to ${quantity}`); // Debug: Log the quantity update
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, {
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Update response:", response.data); // Debug: Log the response from the backend
      setCart(cart.map((item) => item.id === id ? { ...item, quantity } : item));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.Product.price) * item.quantity, 0).toFixed(2);
  };

  return (
    <PageContainer>
      <Navbar />

      <CartContainer>
        <CartHeader>Your Cart</CartHeader>
        {/* Cart Items */}
        <CartWrapper>
          {cart.map((item) => {
            const imageUrl = `${process.env.REACT_APP_API_URL}${item.Product.image}`;
            console.log("Image URL:", imageUrl); // Debug: Check the image URL
            return (
              <CartItem key={item.id}>
                <ItemDetails>
                  <ItemImage src={imageUrl} alt={item.Product.name} onError={(e) => { e.target.onerror = null; e.target.src='/images/default-image.jpg'; }} />
                  <ItemInfo>
                    <ItemTitle>{item.Product.name}</ItemTitle>
                    <ItemPrice>₹{parseFloat(item.Product.price).toFixed(2)}</ItemPrice>
                    <ItemQuantity>
                      <QuantityButton onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <FaMinus />
                      </QuantityButton>
                      {item.quantity}
                      <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FaPlus />
                      </QuantityButton>
                    </ItemQuantity>
                  </ItemInfo>
                </ItemDetails>
                <RemoveButton onClick={() => removeFromCart(item.id)}>
                  <FaTrash /> Remove
                </RemoveButton>
              </CartItem>
            );
          })}
        </CartWrapper>

        {/* Checkout Section */}
        <CheckoutSection>
          <SummaryTitle>Order Summary</SummaryTitle>
          {cart.map((item) => (
            <SummaryItem key={item.id}>
              <span>{item.Product.name}</span>
              <span>₹{(parseFloat(item.Product.price) * item.quantity).toFixed(2)}</span>
            </SummaryItem>
          ))}
          <SummaryTotal>
            <span>Total:</span>
            <span>₹{calculateTotal()}</span>
          </SummaryTotal>
          <CheckoutButton>Proceed to Checkout</CheckoutButton>
        </CheckoutSection>
      </CartContainer>

      <Footer />
    </PageContainer>
  );
};

export default Cart;