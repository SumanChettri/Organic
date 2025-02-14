import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #343a40, #495057);
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginBox = styled.div`
  background:#fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow:0 0 10px rgba(0,0,0,0.3);
  width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #343a40;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border:1px solid #ccc;
  border-radius: 5px;
  font-size:1rem;
`;

const Button = styled.button`
  width:100%;
  padding:12px;
  margin-top:20px;
  background: #343a40;
  color: #fff;
  border:none;
  border-radius: 5px;
  cursor:pointer;
  &:hover {
    background: #495057;
  }
`;

const Message = styled.div`
  margin-top:20px;
  color: ${props => props.success ? "#28a745" : "#dc3545"};
`;

const AdminLogin = () => {
  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/login`,
        { emailOrName, password }
      );
      localStorage.setItem("token", response.data.token);
      setMessage("Admin login successful");
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error logging in"
      );
      setSuccess(false);
    }
  };
  
  return (
    <Container>
      <LoginBox>
        <Title>Admin Login</Title>
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
        {message && <Message success={success}>{message}</Message>}
      </LoginBox>
    </Container>
  );
};

export default AdminLogin;