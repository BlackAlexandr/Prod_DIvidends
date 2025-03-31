import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ChartPage from './pages/ChartPage';
import HelloPage from './pages/HelloPage';
import HistoricalPage from './pages/HistoricalPage';
import { ChartDataProvider } from './context/ChartDataContext';

function App() {
  // Загрузка темы из localStorage
  const savedDarkMode = localStorage.getItem('darkMode');
  const [darkMode, setDarkMode] = useState(savedDarkMode === 'true'); // Преобразуем строку в boolean

  // Функция для переключения темы
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode); // Сохраняем тему в localStorage
    console.log('Тема изменена:', newDarkMode);
  };

  return (
    <ChartDataProvider>
      <Router>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: darkMode ? '#161B22' : '#ffffff',
            color: darkMode ? '#E6E6E6' : '#000000',
          }}
        >
          {/* Header */}
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Основной контент */}
          <main style={{ flex: 1, padding: '0.5rem' }}>
            <Routes>
            <Route
                path="/"
                element={<HelloPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
              />
              {/* Главная страница */}
              <Route
                path="/main"
                element={
                  sessionStorage.getItem('user_id') ? (
                    <HomePage darkMode={darkMode} />
                  ) : (
                    <AuthPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                  )
                }
              />
              <Route
                path="/historical/:ticker"
                element={
                  sessionStorage.getItem('user_id') ? (
                    <HistoricalPage darkMode={darkMode} />
                  ) : (
                    <AuthPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                  )
                }
              />
              {/* Страница авторизации */}
              <Route
                path="/auth"
                element={<AuthPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
              />
              <Route
                path="/chart/:ticker"
                element={
                  sessionStorage.getItem('user_id') ? (
                    <ChartPage darkMode={darkMode} />
                  ) : (
                    <AuthPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                  )
                }
              />
            </Routes>

          </main>

          {/* Footer */}
          <Footer darkMode={darkMode} />
        </div>
      </Router>
    </ChartDataProvider>
  );
}

export default App;