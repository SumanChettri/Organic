import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCartPlus, FaShoppingCart, FaStar } from "react-icons/fa";

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
      }, 2000);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart`, {
        productId: product.id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setErrorMessage("");
      alert(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage("Failed to add product to cart");
    }
  };

  const handleOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to continue shopping.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
        product_id: product.id,
        quantity,
        paymentMethod: "Online"
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Failed to place order');
    }
  };

  if (!product) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => window.open(mainImage, '_blank')}
          />
          <div className="flex mt-4 space-x-4 overflow-x-auto">
            {product.images && product.images.map((img, index) => (
              <img
                key={index}
                src={`${process.env.REACT_APP_API_URL}/${img}`}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setMainImage(`${process.env.REACT_APP_API_URL}/${img}`)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-xl text-green-600 mt-2">₹{parseFloat(product.price).toFixed(2)} / {product.priceUnit}</p>
             {/* Static Ratings */}
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} className={`mr-1 ${index < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.6/5 - 23 reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mt-4">{product.description}</p>

                {/* Static Product Details */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Product Highlights:</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>100% organic and pesticide-free</li>
                    <li>Grown locally by certified farmers</li>
                    <li>Storage: Keep refrigerated between 2–4°C</li>
                  </ul>
                </div>
              </div>
          {/* Quantity Selector */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-16 text-center border-t border-b border-gray-300"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={addToCart}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              <FaCartPlus className="mr-2" /> Add to Cart
            </button>
            <button
              onClick={handleOrder}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <FaShoppingCart className="mr-2" /> Order Now
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
