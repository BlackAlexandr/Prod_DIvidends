// src/components/FeatureCard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const FeatureCard = ({ darkMode, icon, title, description }) => (
  <Box
    sx={{
      background: darkMode 
        ? 'linear-gradient(145deg, #1E232A 0%, #161B22 100%)' 
        : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      color: darkMode ? '#E6E6E6' : '#333',
      border: 'none',
      borderRadius: '16px',
      boxShadow: darkMode
        ? '0 8px 20px rgba(56, 139, 255, 0.15)'
        : '0 8px 20px rgba(25, 118, 210, 0.15)',
      padding: '2rem',
      height: '100%',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: darkMode
          ? '0 12px 24px rgba(56, 139, 255, 0.25)'
          : '0 12px 24px rgba(25, 118, 210, 0.25)'
      },
    }}
  >
    <Box sx={{
      width: 60,
      height: 60,
      borderRadius: '50%',
      backgroundColor: darkMode ? 'rgba(56, 139, 255, 0.1)' : 'rgba(25, 118, 210, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 2
    }}>
      {icon}
    </Box>
    <Typography 
      variant="h5" 
      component="h3" 
      sx={{ 
        mb: 2,
        fontWeight: 600,
        color: darkMode ? '#E6E6E6' : '#333'
      }}
    >
      {title}
    </Typography>
    <Typography 
      variant="body1" 
      sx={{ 
        color: darkMode ? '#8B949E' : '#666',
        lineHeight: 1.6
      }}
    >
      {description}
    </Typography>
  </Box>
);

export default FeatureCard;