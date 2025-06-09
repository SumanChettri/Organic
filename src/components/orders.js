import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";

// Styled Components
const Container = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #f7fafc;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 5px;
    }
  }
`;

const ActionButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &.edit {
    background-color: #48bb78;
    color: white;
    &:hover {
      background-color: #38a169;
    }
  }

  &.delete {
    background-color: #f56565;
    color: white;
    &:hover {
      background-color: #e53e3e;
    }
  }
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please login.");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/my-orders`, {
        headers,
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Search orders based on user input
  const handleSearch = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders?search=${search}`,
        { headers }
      );

      setOrders(response.data);
    } catch (error) {
      console.error("Error searching orders:", error);
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      await axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, { headers });

      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <Container>
      <Title>Order Management</Title>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ActionButton className="edit" onClick={handleSearch}>
          <FaSearch /> Search
        </ActionButton>
      </SearchBar>
      <Table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
              <td>
                <ActionButton className="edit">
                  <FaEdit /> Edit
                </ActionButton>
                <ActionButton className="delete" onClick={() => handleDelete(order.id)}>
                  <FaTrash /> Cancel
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;
