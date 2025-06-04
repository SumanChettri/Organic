import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartCount(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    const handleStorageChange = () => {
      fetchCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile-image`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    if (isLoggedIn) fetchProfileImage();
  }, [isLoggedIn]);

  return (
    <nav className="bg-gradient-to-r from-[#1f4037] to-[#99f2a0] px-4 py-2 sticky top-0 z-50 min-h-[55px] shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Brand */}
        <Link to="/" className="text-white font-bold text-xl sm:text-2xl uppercase">
          Organic Sikkim
        </Link>

        {/* Hamburger */}
        <button
          onClick={handleToggle}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Menu */}
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:items-center gap-4 absolute md:static top-full left-0 w-full md:w-auto bg-[#1f4037] md:bg-transparent px-6 md:px-0 py-4 md:py-0 transition-all duration-300`}
        >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-black hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-black hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            Shop
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-black hover:bg-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            About
          </Link>

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition text-sm"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/signup");
                }}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition text-sm"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="relative text-white text-xl hover:text-yellow-400 transition"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                to="/account"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white"
              >
                <img
                  src={profileImage || "/images/default-profile.png"}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
