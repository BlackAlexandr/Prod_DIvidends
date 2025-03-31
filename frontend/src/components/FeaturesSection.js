// src/components/FeaturesSection.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Event,
  TrendingUp,
  Assessment,
  Star,
  Lightbulb,
  Timeline
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';

  const features = [
    {
      title: "Дивиденды и купоны на ближайший год",
      description: "Добавьте акции в портфель на сервисе и следите за ближайшими дивидендами",
      icon: <Event fontSize="large" color="primary" />
    },
    {
      title: "12 дивидендных стратегий",
      description: "Используйте сервис для любой дивидендной стратегии",
      icon: <TrendingUp fontSize="large" color="primary" />
    },
    {
      title: "Прогнозы по дивидендам от 55 аналитиков",
      description: "Первыми узнавайте о прогнозах по дивидендам",
      icon: <Assessment fontSize="large" color="primary" />
    },
    {
      title: "Дивидендный рейтинг",
      description: "Рейтинг дивидендных акций в сервисе Investmint",
      icon: <Star fontSize="large" color="primary" />
    },
    {
      title: "45 аналитиков ежедневно публикуют инвестидеи",
      description: "Следите за идеями, получите доступ к консенсус-прогнозам",
      icon: <Lightbulb fontSize="large" color="primary" />
    },
    {
      title: "Как закрывается дивидендный гэп",
      description: "Изучайте статистику закрытия гэпа на истории",
      icon: <Timeline fontSize="large" color="primary" />
    }
  ];

const FeaturesSection = ({ darkMode }) => (
  <Box sx={sectionStyle(darkMode)}>
    <Typography 
      variant="h4" 
      component="h2" 
      sx={sectionTitleStyle(darkMode)}
    >
      Основные возможности
    </Typography>
    
    <Box sx={gridStyle}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          darkMode={darkMode}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </Box>
  </Box>
);

// Вынесенные стили
const sectionStyle = darkMode => ({
  marginBottom: '40px',
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: darkMode ? '#161B22' : '#f8f9fa',
  boxShadow: darkMode 
    ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
    : '0 8px 16px rgba(0, 0, 0, 0.1)'
});

const sectionTitleStyle = darkMode => ({ 
  mb: 4,
  textAlign: 'center',
  fontWeight: 600,
  color: darkMode ? '#E6E6E6' : '#333'
});

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  margin: '40px 0'
};

export default FeaturesSection;