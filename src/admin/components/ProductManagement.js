import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', priceUnit: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('price', newProduct.price);
    formData.append('priceUnit', newProduct.priceUnit);
    formData.append('image', newProduct.image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', category: '', price: '', priceUnit: '', image: '' });
      setShowModal(false);
      setMessage({ text: 'Product added successfully', error: false });
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ text: 'Error adding product', error: true });
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('category', editingProduct.category);
    formData.append('price', editingProduct.price);
    formData.append('priceUnit', editingProduct.priceUnit);
    if (editingProduct.image) {
      formData.append('image', editingProduct.image);
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts(products.map(product => (product.id === editingProduct.id ? response.data : product)));
      setEditingProduct(null);
      setShowModal(false);
      setMessage({ text: 'Product updated successfully', error: false });
    } catch (error) {
      console.error('Error editing product:', error);
      setMessage({ text: 'Error editing product', error: true });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
      setMessage({ text: 'Product deleted successfully', error: false });
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage({ text: 'Error deleting product', error: true });
    }
  };

  const openAddModal = () => {
    setNewProduct({ name: '', category: '', price: '', priceUnit: '', image: '' });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="container p-3" style={{ backgroundColor: "#f8f9fa" }}>
      <header className="d-flex justify-content-center align-items-center mb-4">
        <h2 className="fw-bold text-secondary" style={{ fontSize: '2rem', marginBottom: '35px' }}>Manage your Products</h2>
      </header>
      {message && (
        <div className={`alert ${message.error ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message.text}
        </div>
      )}
      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="card shadow-sm border-0 rounded-4"
              style={{ width: "20rem" }}
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${product.image}`}
                alt={product.name}
                className="card-img-top rounded-top-4"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body bg-white text-center">
                <h5 className="card-title fw-bold mb-2">{product.name}</h5>
                <p className="card-text text-muted mb-1">Category: {product.category}</p>
                <p className="fw-bold text-success mb-3">Price: ₹{parseFloat(product.price).toFixed(2)} / {product.priceUnit}</p>
                <div className="d-flex justify-content-around">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-outline-primary rounded-pill px-3"
                    onClick={() => openEditModal(product)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                  >
                    <FaEdit className="me-2" /> Edit
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-outline-danger rounded-pill px-3"
                    onClick={() => handleDeleteProduct(product.id)}
                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                  >
                    <FaTrash className="me-2" /> Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-success rounded-circle"
        onClick={openAddModal}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <FaPlus />
      </motion.button>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, category: e.target.value }) : setNewProduct({ ...newProduct, category: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price Unit</label>
              <input
                type="text"
                name="priceUnit"
                value={editingProduct ? editingProduct.priceUnit : newProduct.priceUnit}
                onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, priceUnit: e.target.value }) : setNewProduct({ ...newProduct, priceUnit: e.target.value })}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 1024 * 1024) {
                    setMessage({ text: 'Image size should not exceed 1024KB', error: true });
                  } else {
                    setMessage(null);
                    editingProduct ? setEditingProduct({ ...editingProduct, image: file }) : setNewProduct({ ...newProduct, image: file });
                  }
                }}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="success" onClick={editingProduct ? handleEditProduct : handleAddProduct}>
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;