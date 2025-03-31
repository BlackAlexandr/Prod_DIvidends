import React from 'react';
import styled from 'styled-components';
import { IconButton, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Иконка полумесяца
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Иконка солнца
import LoginIcon from '@mui/icons-material/Login'; // Иконка входа
import LogoutIcon from '@mui/icons-material/Logout'; // Иконка выхода

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  background-color: ${({ $darkMode }) => ($darkMode ? '#1E232A' : '#388BFF')}; /* Голубой цвет для светлой темы */
  color: ${({ $darkMode }) => ($darkMode ? '#E6E6E6' : '#ffffff')}; /* Белый текст для светлой темы */
  border-bottom: 1px solid ${({ $darkMode }) => ($darkMode ? '#30363D' : '#ccc')};

  @media (max-width: 600px) {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 16px;
    text-align: center;
  }
`;

const StyledIconButton = styled(IconButton)`
  && {
    color: ${({ $darkMode }) => ($darkMode ? '#E6E6E6' : '#ffffff')}; /* Цвет иконки */
    transition: all 0.3s ease; /* Плавные переходы */

    &:hover {
      transform: scale(1.1); /* Увеличение размера при наведении */
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Легкая тень */
    }

    &:active {
      transform: scale(1); /* Возвращаем размер при клике */
    }

    @media (max-width: 600px) {
      margin: 5px 0;
    }
  }
`;

const AuthButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

const StyledText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $darkMode }) => ($darkMode ? '#E6E6E6' : '#ffffff')}; /* Цвет текста */
  transition: all 0.3s ease; /* Плавные переходы */

  @media (max-width: 600px) {
    font-size: 12px;
    margin-left: 5px;
  }
`;

const Header = ({ darkMode, toggleDarkMode }) => {
  const isLoggedIn = sessionStorage.getItem('user_id'); // Проверяем, авторизован ли пользователь

  const handleLogout = () => {
    sessionStorage.removeItem('user_id'); // Удаляем данные авторизации
    window.location.href = '/auth'; // Перенаправляем на страницу авторизации
  };

  return (
    <HeaderContainer $darkMode={darkMode}>
      {/* Заголовок */}
      <Title>Dividend Tracker</Title>

      {/* Иконки авторизации и переключатель темы */}
      <AuthButtonWrapper>
        {isLoggedIn ? (
          <StyledIconButton $darkMode={darkMode} onClick={handleLogout} title="Logout">
            <LogoutIcon fontSize="medium" />
            <StyledText $darkMode={darkMode}>Выход</StyledText>
          </StyledIconButton>
        ) : (
          <StyledIconButton $darkMode={darkMode} href="/auth" title="Login">
            <LoginIcon fontSize="medium" />
            <StyledText $darkMode={darkMode}>Вход</StyledText>
          </StyledIconButton>
        )}

        {/* Переключатель темы */}
        <StyledIconButton onClick={toggleDarkMode} $darkMode={darkMode} title="Toggle Theme">
          {darkMode ? (
            <WbSunnyIcon fontSize="medium" />
          ) : (
            <DarkModeIcon fontSize="medium" />
          )}
        </StyledIconButton>
      </AuthButtonWrapper>
    </HeaderContainer>
  );
};

export default Header;