import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"; // Import axios
import "tailwindcss/tailwind.css";
import withAuth from "./withAuth"; // Import the authentication HOC

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
  padding: 10px; /* Add padding around the slider */
`;

const Slide = styled.div`
  position: absolute;
  width: calc(100% - 20px); /* Adjust width to account for padding */
  height: calc(100% - 20px); /* Adjust height to account for padding */
  transition: opacity 1s ease-in-out;
  opacity: ${(props) => (props.active ? 1 : 0)};
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(65%); /* Apply brightness filter */
  border-radius: 7px; /* Add border radius for rounded corners */
`;

const SlideOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay with reduced opacity */
  border-radius: 10px; /* Match border radius of the image */
`;

const SlideContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 20px;
  border-radius: 10px;
`;

const SlideTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SlideSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const SlideButton = styled(Link)`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

function Home() {
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImages] = useState([
    {
      src: "/images/image1.jpg",
      title: "Fresh Organic Fruits",
      subtitle: "Experience the taste of nature with our fresh and delicious organic fruits, handpicked just for you.",
      quote: "Eat fresh, stay healthy. Discover the best organic fruits at OrganicStore.",
    },
    {
      src: "/images/image2.jpg",
      title: "Organic Vegetables",
      subtitle: "Enjoy the goodness of farm-fresh organic vegetables, grown without harmful chemicals and pesticides.",
      quote: "Organic vegetables for a healthier life.",
    },
    {
      src: "/images/image3.jpg",
      title: "Dairy Products",
      subtitle: "Indulge in our pure and natural dairy products, sourced from healthy and happy cows.",
      quote: "Pure and natural dairy products for your family.",
    },
  ]);
  const [reviews] = useState([
    { id: 1, name: "John Doe", comment: "Great quality products and fast delivery!" },
    { id: 2, name: "Jane Smith", comment: "I love the freshness of the fruits and vegetables." },
    { id: 3, name: "Sam Wilson", comment: "Excellent customer service and organic products." },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [sliderImages.length]);

  return (
    <div>
      {/* Hero Section with Styled Components Slider */}
      <SliderContainer>
        {sliderImages.map((img, index) => (
          <Slide key={index} active={index === currentSlide}>
            <SlideImage src={img.src} alt={`Slide ${index + 1}`} />
            <SlideOverlay />
            <SlideContent className="w-full h-full flex flex-col items-center justify-center">
              <SlideTitle style={{ color: '#f8f9fa' }}>{img.title}</SlideTitle>
              <SlideSubtitle style={{ color: '#f8f9fa' }}>{img.subtitle}</SlideSubtitle>
              <SlideButton to="/shop" className="animate-bounce">Shop Now</SlideButton>
            </SlideContent>
          </Slide>
        ))}
      </SliderContainer>

      {/* Product Categories Section */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 animate-fadeIn">
          Our Product Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-10 animate-fadeIn">
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const title = category.category || "Unknown Category";
              const imageUrl =
                title === "Fruits"
                  ? "/imag/fruits.jpg"
                  : title === "Vegetables"
                  ? "/imag/vegetables.jpg"
                  : "/imag/apples.jpg";
              return (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden w-80 hover:scale-105 transform transition duration-300"
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-category.jpg";
                    }}
                  />
                  <div className="p-5 text-center">
                    <h5 className="text-xl font-bold text-gray-700 mb-3">{title}</h5>
                    <p className="text-gray-600 mb-4">Fresh and quality {title} products</p>
                    <Link
                      to={`/shop/${title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10 animate-fadeIn">
          Customer Reviews
        </h2>
        <div className="flex flex-wrap justify-center gap-10 animate-fadeIn">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-100 shadow-lg rounded-lg w-80 p-5 text-center hover:scale-105 transform transition duration-300"
            >
              <h5 className="text-xl font-bold text-gray-700 mb-3">{review.name}</h5>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default withAuth(Home);