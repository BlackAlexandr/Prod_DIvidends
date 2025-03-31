// src/components/HeroSection.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const InformationBlock = ({ darkMode }) => (
  <Box sx={{ 
    textAlign: 'center', 
    marginBottom: '40px',
    padding: '20px',
    borderRadius: '16px',
    background: darkMode 
      ? 'linear-gradient(135deg, #161B22 0%, #0D1117 100%)' 
      : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  }}>
    <Typography 
      variant="h3" 
      component="h1" 
      sx={{ 
        mb: 2,
        fontWeight: 700,
        background: darkMode 
          ? 'linear-gradient(90deg, #388BFF, #00BFFF)' 
          : 'linear-gradient(90deg, #1976d2, #2196F3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      Диман Company - инвистируй и зарабатывай
    </Typography>
    <Typography 
      variant="h6" 
      sx={{ 
        color: darkMode ? '#8B949E' : '#666',
        fontStyle: 'italic'
      }}
    >
      Дивиденды по акциям и купоны по облигациям
    </Typography>
  </Box>
);

export default InformationBlock;