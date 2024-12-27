// Footer.js
import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background: linear-gradient(90deg, #1f4037, #99f2c8);
  color: #fff;
  padding: 20px 0;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const FooterLink = styled.a`
  color: #fff;
  margin: 0 15px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ffcc29;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  margin-top: 10px;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;

  & > a {
    color: #fff;
    margin: 0 10px;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      color: #ffcc29;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/shop">Shop</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterLinks>
        <SocialIcons>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </SocialIcons>
        <Copyright>© 2024 OrganicStore. All Rights Reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
