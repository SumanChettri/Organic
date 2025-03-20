import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginBox = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 400px;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #6e8efb;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    border-color: #6e8efb;
    outline: none;
    box-shadow: 0 0 10px rgba(110, 142, 251, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
`;

const Message = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;
  animation: ${(props) => (props.$success ? fadeIn : shake)} 0.5s ease-in-out;
  background-color: ${(props) => (props.$success ? "#28a745" : "#dc3545")};
`;

const Link = styled.a`
  display: block;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #6e8efb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Login Component
const Login = () => {
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", success: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = { emailOrName, password };
  
    try {
      const response = await axios.post(
        "http://192.168.14.156:5000/auth/login",
        userData
      );
      localStorage.setItem("token", response.data.token);
      setMessage({ text: "Login successful", success: true });
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text: error.response
          ? error.response.data.message
          : "Server error, try again later",
        success: false,
      });
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Email or Name"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
        {message.text && <Message $success={message.success}>{message.text}</Message>}
        <Link href=".">Forgot Password?</Link>
        <Link href="/signup">Create an Account</Link>
      </LoginBox>
    </Container>
  );
};

export default Login;