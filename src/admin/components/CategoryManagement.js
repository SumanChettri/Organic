import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

import { AddCategoryButton, CategoryList, CategoryCard } from '../styles/AdminStyled';
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.171.156:5000/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <AddCategoryButton>Add New Category</AddCategoryButton>
      <CategoryList>
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CategoryCard>
              <h4>{category.name}</h4>
              <button>Edit</button>
              <button>Delete</button>
            </CategoryCard>
          </motion.div>
        ))}
      </CategoryList>
    </div>
  );
};

export default CategoryManagement;
