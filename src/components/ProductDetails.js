import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCartPlus, FaShoppingCart, FaStar } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Styled Components
const ProductDetailContainer = styled(motion.div)`
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
`;

const ProductDetailWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImageGallery = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MainImage = styled(motion.img)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: zoom-in;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ThumbnailContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const Thumbnail = styled(motion.img)`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const ProductInfo = styled(motion.div)`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductTitle = styled(motion.h1)`
  font-size: 2.5rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductPrice = styled(motion.p)`
  font-size: 1.5rem;
  color: #ff6600;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ProductDescription = styled(motion.p)`
  font-size: 1rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const RatingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StarIcon = styled(FaStar)`
  color: #ffcc00;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const AddToCartButton = styled(motion.button)`
  padding: 15px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 1rem;
  }
`;

const OrderNowButton = styled(motion.button)`
  padding: 15px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    font-size: 1rem;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    width: 50px;
    text-align: center;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  color: #ffffff;
  font-size: 1rem;
  background-color: #dc3545;
  text-align: center;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}`);
        setProduct(response.data);
        if (response.data.image) {
          const fullImagePath = `${process.env.REACT_APP_API_URL}${response.data.image}`;
          setMainImage(fullImagePath);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage("Please log in to continue shopping.");
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Delay the redirection by 2 seconds
      return;
    }

    try {
      console.log("Token:", token); // Debug: Check if token is being retrieved correctly
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart`, {
        product_id: product.id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrorMessage(""); // Clear any previous error messages
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage("Failed to add product to cart");
    }
  };

  const orderNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage("Please log in to continue shopping.");
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Delay the redirection by 2 seconds
      return;
    }

    navigate('/cart');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <ProductDetailContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ProductDetailWrapper
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProductImageGallery>
          <MainImage
            src={mainImage}
            alt={product.name}
            whileHover={{ scale: 1.1 }}
            onClick={() => window.open(mainImage, '_blank')}
          />
          <ThumbnailContainer>
            {product.images && product.images.map((img, index) => (
              <Thumbnail
                key={index}
                src={`${process.env.REACT_APP_API_URL}/${img}`}
                alt={product.name}
                onClick={() => setMainImage(`${process.env.REACT_APP_API_URL}/${img}`)}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </ThumbnailContainer>
        </ProductImageGallery>
        <ProductInfo
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>₹{parseFloat(product.price).toFixed(2)} / {product.priceUnit}</ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>
          <RatingContainer>
            {Array.from({ length: product.rating }).map((_, index) => (
              <StarIcon key={index} />
            ))}
          </RatingContainer>
          <QuantitySelector>
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </QuantitySelector>
          <ButtonContainer>
            <AddToCartButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addToCart}
            >
              <FaCartPlus /> Add to Cart
            </AddToCartButton>
            <OrderNowButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={orderNow}
            >
              <FaShoppingCart /> Order Now
            </OrderNowButton>
          </ButtonContainer>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </ProductInfo>
      </ProductDetailWrapper>
    </ProductDetailContainer>
  );
};

export default ProductDetail;