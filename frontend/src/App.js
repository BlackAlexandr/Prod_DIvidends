import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  // Функция для переключения темы
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
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
            {/* Главная страница */}
            <Route
              path="/main"
              element={sessionStorage.getItem('user_id') ? <HomePage darkMode={darkMode} /> : <AuthPage />}
            />
            {/* Страница авторизации */}
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;