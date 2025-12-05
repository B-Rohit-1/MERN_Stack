import React from 'react';
import { Container, Button } from '../../GlobalStyles';

export const Home = () => {
  return (
    <>
      <div style={{
        background: '#101522',
        color: '#fff',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <Container>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Welcome to Our Website</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Discover amazing features and services</p>
          <Button primary>Get Started</Button>
        </Container>
      </div>
      
      <Container style={{ padding: '80px 0' }}>
        <h2>About Us</h2>
        <p>We are a team of passionate developers creating amazing web applications.</p>
      </Container>
    </>
  );
};

export default Home;
