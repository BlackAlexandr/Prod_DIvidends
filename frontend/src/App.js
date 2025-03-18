import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header с минимальными отступами */}
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} style={{ padding: '0.5rem' }} />

          {/* Основной контент (занимает всё доступное пространство) */}
          <main style={{ flex: 1, overflowY: 'hidden', padding: '0.5rem' }}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>

          {/* Footer с минимальными отступами */}
          <Footer style={{ padding: '0.5rem' }} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;