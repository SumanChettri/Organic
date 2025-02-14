import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import tw from 'twin.macro';
import { motion } from 'framer-motion';
import { FaSort, FaSearch } from 'react-icons/fa';

const Container = styled.div`
  ${tw`min-h-screen p-4 sm:p-8 bg-gradient-to-r from-indigo-50 to-green-50`}
`;

const InnerContainer = styled.div`
  ${tw`container mx-auto`}
`;

const Header = styled(motion.h1)`
  ${tw`text-center font-extrabold text-gray-800 mb-6 sm:mb-8`}
  font-size: 2rem;
  @media (min-width: 640px) {
    font-size: 3rem;
  }
`;

const FiltersWrapper = styled.div`
  ${tw`flex flex-col sm:flex-row sm:justify-between items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0`}
`;

const SearchWrapper = styled.div`
  ${tw`relative w-full sm:w-1/3`}
`;

const StyledInput = styled.input`
  ${tw`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
`;

const StyledSelect = styled.select`
  ${tw`w-full sm:w-auto pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
`;

const TableWrapper = styled.div`
  ${tw`overflow-x-auto shadow-lg rounded-lg`}
`;

const StyledTable = styled.table`
  ${tw`min-w-full bg-white`}
`;

const TheadRow = styled.tr`
  ${tw`bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base`}
`;

const Th = styled.th`
  ${tw`py-3 px-4 cursor-pointer`}
`;

const TbodyRow = styled(motion.tr)`
  ${tw`border-b hover:bg-gray-50 text-xs sm:text-sm`}
`;

const Td = styled.td`
  ${tw`py-3 px-4 text-gray-700`}
`;

const PaginationWrapper = styled.div`
  ${tw`flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4`}
`;

const StyledButton = styled.button`
  ${tw`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50`}
`;

const DeleteButton = styled(StyledButton)`
  background-color: #f56565;
  &:hover {
    background-color: #e53e3e;
  }
  margin-top: 0.5rem;
  font-size: 0.8rem;
`;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/all`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatusId(orderId);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.user_id.toString().includes(searchTerm) ||
        (order.Product && order.Product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    filtered.sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];
      if (sortField === "created_at") {
        aField = new Date(aField);
        bField = new Date(bField);
      }
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [orders, searchTerm, statusFilter, sortField, sortOrder]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container>
      <InnerContainer>
        <Header
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Order Management
        </Header>
        
        {/* Filters */}
        <FiltersWrapper>
          <SearchWrapper>
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <StyledInput
              type="text"
              placeholder="Search by User ID or Product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
          <div className="w-full sm:w-auto">
            <StyledSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </StyledSelect>
          </div>
        </FiltersWrapper>
        
        <TableWrapper>
          <StyledTable>
            <thead>
              <TheadRow>
                <Th onClick={() => handleSort("id")}>
                  Order ID <FaSort className="inline" />
                </Th>
                <Th onClick={() => handleSort("user_id")}>
                  User ID <FaSort className="inline" />
                </Th>
                <Th>Product</Th>
                <Th>Quantity</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th onClick={() => handleSort("created_at")}>
                  Placed At <FaSort className="inline" />
                </Th>
                <Th>Actions</Th>
              </TheadRow>
            </thead>
            <tbody>
              {currentOrders.map(order => (
                <TbodyRow
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Td>{order.id}</Td>
                  <Td>{order.user_id}</Td>
                  <Td>{order.Product ? order.Product.name : 'N/A'}</Td>
                  <Td>{order.quantity}</Td>
                  <Td>{order.payment_method}</Td>
                  <Td className="capitalize">{order.status}</Td>
                  <Td>{new Date(order.created_at).toLocaleString()}</Td>
                  <Td>
                    <StyledSelect
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="complete">Complete</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </StyledSelect>
                    {updatingStatusId === order.id && (
                      <span className="text-xs text-indigo-500 ml-1">Updating...</span>
                    )}
                    <DeleteButton onClick={() => handleCancelOrder(order.id)}>
                      Cancel Order
                    </DeleteButton>
                  </Td>
                </TbodyRow>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
        
        {/* Pagination */}
        <PaginationWrapper>
          <StyledButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </StyledButton>
          <span className="text-gray-700 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <StyledButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </StyledButton>
        </PaginationWrapper>
      </InnerContainer>
    </Container>
  );
};

export default OrderManagement;