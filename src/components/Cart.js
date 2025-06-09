import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Footer from './footer';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + parseFloat(item.Product.price) * item.quantity, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cart.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart/${id}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Fake order now function (no payment gateway)
  const handleOrderNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to order.');
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/fake`,
        {
          items: cart.map(item => ({
            product_id: item.Product.id,
            quantity: item.quantity
          })),
          payment_method: 'fake',
          clearCart: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order placed successfully!');
      setCart([]);
    } catch (error) {
      alert('Failed to place order');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Cart</h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-600">Your cart is empty.</div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => {
                const imageUrl = `${process.env.REACT_APP_API_URL}${item.Product.image}`;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={imageUrl}
                        alt={item.Product.name}
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-image.jpg';
                        }}
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{item.Product.name}</h2>
                        <p className="text-green-600 font-medium">₹{parseFloat(item.Product.price).toFixed(2)}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2"
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.Product.name}</span>
                    <span>₹{(parseFloat(item.Product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xl font-semibold text-gray-800 mt-4">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <button
                onClick={handleOrderNow}
                className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-lg font-medium"
              >
                Order Now
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;