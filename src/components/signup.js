import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  animation: ${fadeIn} 1s ease-in-out;
`;

const SignupBox = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 400px;
  text-align: center;
  animation: ${slideDown} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2575fc;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6a11cb;
    outline: none;
    box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;

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
  animation: ${fadeIn} 0.5s ease-in-out;
  background-color: ${(props) => (props.success ? "#28a745" : "#dc3545")};
`;

const Link = styled.a`
  display: block;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #2575fc;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState({ text: "", success: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== confirmPassword) {
        setMessage({ text: "Passwords do not match", success: false });
        return;
    }

    if (password.length < 8) {
        setMessage({ text: "Password must be at least 8 characters", success: false });
        return;
    }

    // Phone number validation
    if (phone.length !== 10 || isNaN(phone)) {
        setMessage({ text: "Invalid phone number", success: false });
        return;
    }

    try {
        // Prepare user data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password); // Send plain password
        formData.append('phone', phone);
        formData.append('pincode', pincode);
        formData.append('profilePhoto', profilePhoto);

        // Send POST request to backend
        const response = await axios.post("http://192.168.157.156:5000/auth/register", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Handle success
        if (response.status === 201) {
            setMessage({ text: response.data.message, success: true });

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    } catch (error) {
        console.error("Error during signup:", error);
        setMessage({
            text: error.response ? error.response.data.message : "Server error, please try again",
            success: false,
        });
    }
  };

  return (
    <Container>
      <SignupBox>
        <Title>Create Account</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
          <Button type="submit">Sign Up</Button>
        </form>
        {message.text && <Message success={message.success}>{message.text}</Message>}
        <Link href="/login">Already have an account? Login</Link>
      </SignupBox>
    </Container>
  );
};

export default Signup;