import React from 'react';
import './App.css';
import InputForm from './InputForm';
import logo from './assets/logo.jpg'; // Import the logo image
import { Typography } from '@mui/material';
function App() {
  return (
    <div className="app-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom:'1rem' }}>
      vastra.ai
    </Typography>
    <Typography  style={{ fontWeight: 'bold', marginBottom:'1rem' }}>
      Predict future trends and identify suitable Influencers
    </Typography>
      <InputForm />
    </div>
  );
}

export default App;
