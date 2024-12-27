import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styled from "styled-components";
import withAuth from "./withAuth"; // Import the authentication HOC

// Styled Components
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin-bottom: 0;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 70vh;
  }

  @media (max-width: 480px) {
    height: 50vh;
  }
`;

const QuotationSection = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  text-align: center;
  z-index: 10;
  color: white;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    top: 25%;
  }

  @media (max-width: 480px) {
    top: 20%;
  }
`;

const QuotationText = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ShopNowButton = styled(Link)`
  padding: 15px 30px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 25px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
`;

const Section = styled.section`
  padding: 60px 20px;
  background-color: #f8f9fa;
  margin-top: 0;

  @media (max-width: 768px) {
    padding: 40px 15px;
  }

  @media (max-width: 480px) {
    padding: 30px 10px;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CategoryCard = styled.div`
  width: 300px;
  margin: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .card-body {
    padding: 20px;
    text-align: center;
  }

  h5 {
    margin-bottom: 10px;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  p {
    margin-bottom: 20px;
    color: #6c757d;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  a {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
      background-color: #218838;
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 8px 16px;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
      padding: 6px 12px;
    }
  }
`;

const ReviewSection = styled.section`
  padding: 60px 20px;
  background-color: #fff;

  @media (max-width: 768px) {
    padding: 40px 15px;
  }

  @media (max-width: 480px) {
    padding: 30px 10px;
  }
`;

const ReviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ReviewCard = styled.div`
  width: 300px;
  margin: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-10px);
  }

  .card-body {
    padding: 20px;
    text-align: center;
  }

  h5 {
    margin-bottom: 10px;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  p {
    margin-bottom: 20px;
    color: #6c757d;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
`;

function Home() {
  const [categories, setCategories] = useState([]);
  const [sliderImages] = useState([
    { src: '/images/image1.jpg', title: 'Fresh Organic Fruits', subtitle: 'Experience the taste of nature with our fresh and delicious organic fruits, handpicked just for you.', quote: 'Eat fresh, stay healthy. Discover the best organic fruits at OrganicStore.' },
    { src: '/images/image2.jpg', title: 'Organic Vegetables', subtitle: 'Enjoy the goodness of farm-fresh organic vegetables, grown without harmful chemicals and pesticides.', quote: 'Organic vegetables for a healthier life.' },
    { src: '/images/image3.jpg', title: 'Dairy Products', subtitle: 'Indulge in our pure and natural dairy products, sourced from healthy and happy cows.', quote: 'Pure and natural dairy products for your family.' }
  ]);
  const [reviews] = useState([
    { id: 1, name: 'John Doe', comment: 'Great quality products and fast delivery!' },
    { id: 2, name: 'Jane Smith', comment: 'I love the freshness of the fruits and vegetables.' },
    { id: 3, name: 'Sam Wilson', comment: 'Excellent customer service and organic products.' }
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section with Bootstrap Carousel */}
      <HeroSection>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {sliderImages.map((img, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img src={img.src} className="d-block w-100" alt={`Slide ${index + 1}`} style={{ objectFit: 'cover', height: '100vh', animation: 'slideIn 1s ease-in-out' }} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{img.title}</h5>
                  <p>{img.subtitle}</p>
                </div>
                <QuotationSection>
                  <QuotationText>{img.quote}</QuotationText>
                  <ShopNowButton to="/shop">Shop Now</ShopNowButton>
                </QuotationSection>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </HeroSection>

      {/* Product Categories Section */}
      <Section>
        <SectionTitle>Our Product Categories</SectionTitle>
        <CategoryGrid>
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const title = category.category || 'Unknown Category';
              const imageUrl = title === 'Fruits'
                ? '/imag/fruits.jpg'
                : title === 'Vegetables'
                  ? '/imag/vegetables.jpg'
                  : '/images/apples.jpg';
              return (
                <CategoryCard key={index}>
                  <img src={imageUrl} alt={title} onError={(e) => { e.target.onerror = null; e.target.src='/images/default-category.jpg'; }} />
                  <div className="card-body">
                    <h5>{title}</h5>
                    <p>Fresh and quality {title} products</p>
                    <Link to={`/shop/${title.toLowerCase().replace(/\s+/g, '-')}`}>Shop Now</Link>
                  </div>
                </CategoryCard>
              );
            })
          ) : (
            <p>Loading categories...</p>
          )}
        </CategoryGrid>
      </Section>

      {/* Customer Reviews Section */}
      <ReviewSection>
        <SectionTitle>Customer Reviews</SectionTitle>
        <ReviewGrid>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <div className="card-body">
                <h5>{review.name}</h5>
                <p>{review.comment}</p>
              </div>
            </ReviewCard>
          ))}
        </ReviewGrid>
      </ReviewSection>
    </div>
  );
}

export default withAuth(Home); // Wrap the Home component with the authentication HOC