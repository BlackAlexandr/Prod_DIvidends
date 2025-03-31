// src/pages/Hello.jsx
import React from 'react';
import InformationBlock from '../components/InformationBlock';
import FeaturesSection from '../components/FeaturesSection';
import FreeDataTable from '../components/FreeDataTable';
import { Typography, Box } from '@mui/material';

const Hello = ({ darkMode }) => {
  const containerStyle = {
    maxWidth: '85%',
    margin: '0 auto',
    padding: '20px',
    color: darkMode ? '#ffffff' : '#000000',
    backgroundColor: darkMode ? '#0D1117' : '#ffffff',
    minHeight: '100vh'
  };

  return (
    <div style={containerStyle}>
      <InformationBlock darkMode={darkMode} />
      <FeaturesSection darkMode={darkMode} />
      
      <Box sx={calendarSectionStyle(darkMode)}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={calendarTitleStyle(darkMode)}
        >
          Дивидендный календарь
        </Typography>
        <FreeDataTable darkMode={darkMode} />
      </Box>
    </div>
  );
};

// Вынесенные стили для секции календаря
const calendarSectionStyle = darkMode => ({
  marginBottom: '40px',
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: darkMode ? '#161B22' : '#f8f9fa',
  boxShadow: darkMode 
    ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
    : '0 8px 16px rgba(0, 0, 0, 0.1)'
});

const calendarTitleStyle = darkMode => ({
  mb: 3,
  fontWeight: 600,
  color: darkMode ? '#E6E6E6' : '#333'
});

export default Hello;