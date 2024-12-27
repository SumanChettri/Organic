import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Styled Components
const ShopContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #f2f2f2, #e1e5ea);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }

  h2 {
    font-size: 2rem;
    color: #333;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const SearchInput = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    border-color: #ff6600;
  }

  &:focus {
    border-color: #ff6600;
    outline: none;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff6600;
    background-color: #ffe6cc;
  }

  &:focus {
    border-color: #ff6600;
    outline: none;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Adjusted minimum size */
  gap: 20px; /* Adjusted gap between cards */
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Two columns on mobile screens */
  }
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 10px; /* Adjusted border-radius */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px; /* Adjusted padding */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 300px; /* Set a maximum width for the product card */
  margin: 0 auto; /* Center the product card */

  &:hover {
    transform: scale(1.05); /* Adjusted hover effect */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px; /* Adjusted image height */
  object-fit: cover;
  border-radius: 8px; /* Match with adjusted card size */

  @media (max-width: 768px) {
    height: 150px; /* Decrease height for mobile screens */
  }
`;

const ProductName = styled.h3`
  font-size: 1.2rem; /* Adjusted font size for name */
  margin: 10px 0; /* Adjusted margin */
`;

const ProductPrice = styled.p`
  font-size: 1rem; /* Adjusted font size */
  color: #ff6600;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6600;
    color: white;
    border-color: #ff6600;
  }

  &.active {
    background: #ff6600;
    color: white;
    border-color: #ff6600;
  }
`;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/shop`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (filter) filtered = filtered.filter((p) => p.category === filter);

    if (sort === "asc") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "desc") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "alpha") filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, filter, sort, products]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <ShopContainer>
      <Header>
        <h2>Shop Our Products</h2>
        <FilterContainer>
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="">Sort by</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
            <option value="alpha">Name: A to Z</option>
          </Select>
        </FilterContainer>
      </Header>

      <ProductGrid>
        {currentProducts.map((p) => (
          <ProductCard key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
            <ProductImage src={p.image} alt={p.name} />
            <ProductName>{p.name}</ProductName>
            <ProductPrice>₹{parseFloat(p.price).toFixed(2)} / {p.priceUnit}</ProductPrice>
          </ProductCard>
        ))}
      </ProductGrid>

      <Pagination>
        {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map(
          (_, i) => (
            <PageButton
              key={i}
              onClick={() => paginate(i + 1)}
              className={i + 1 === currentPage ? "active" : ""}
            >
              {i + 1}
            </PageButton>
          )
        )}
      </Pagination>
    </ShopContainer>
  );
};

export default Shop;