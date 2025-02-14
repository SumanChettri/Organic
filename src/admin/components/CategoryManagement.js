import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Form, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';

const CategoryManagementContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 60px;
  }
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled(motion.li)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryButton = styled(Button)`
  margin-left: 10px;
`;

const SearchInput = styled(Form.Control)`
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdateCategory = async (oldCategory) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/categories/${oldCategory}`, { newCategory: updatedCategory });
      setCategories(categories.map(cat => cat.category === oldCategory ? { category: updatedCategory } : cat));
      setEditingCategory(null);
      setUpdatedCategory('');
      setAlertMessage('Category updated successfully');
      setAlertVariant('success');
      setShowAlert(true);
    } catch (err) {
      console.error('Error updating category', err);
      setAlertMessage('Error updating category');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${category}`);
      setCategories(categories.filter(cat => cat.category !== category));
      setAlertMessage('Category deleted successfully');
      setAlertVariant('success');
      setShowAlert(true);
    } catch (err) {
      console.error('Error deleting category', err);
      setAlertMessage('Error deleting category');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CategoryManagementContainer>
      <h1 className="fw-bold text-secondary mb-4" style={{ fontSize: '2.5rem' }}>Category Management</h1>
      <SearchInput
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <CategoryList>
        {filteredCategories.map((category) => (
          <CategoryItem
            key={category.category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {editingCategory === category.category ? (
              <>
                <Form.Control
                  type="text"
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                  placeholder="New category name"
                />
                <CategoryButton variant="success" onClick={() => handleUpdateCategory(category.category)}>Save</CategoryButton>
                <CategoryButton variant="secondary" onClick={() => setEditingCategory(null)}>Cancel</CategoryButton>
              </>
            ) : (
              <>
                <span>{category.category}</span>
                <div>
                  <CategoryButton variant="warning" onClick={() => setEditingCategory(category.category)}>Edit</CategoryButton>
                  <CategoryButton variant="danger" onClick={() => handleDeleteCategory(category.category)}>Delete</CategoryButton>
                </div>
              </>
            )}
          </CategoryItem>
        ))}
      </CategoryList>
    </CategoryManagementContainer>
  );
};

export default CategoryManagement;