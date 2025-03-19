import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Box, Typography, IconButton } from '@mui/material';

const AuthPage = ({ darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Обработка отправки формы
  const handleAuth = async (values) => {
    setLoading(true); // Включаем индикатор загрузки
    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Успешная авторизация/регистрация
        message.success(data.message || 'Успешно!');
        sessionStorage.setItem('user_id', 'true'); // Сохраняем состояние авторизации
        window.location.href = '/main'; // Перенаправляем на главную страницу
      } else {
        // Ошибка
        message.error(data.error || 'Произошла ошибка.');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      message.error('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false); // Выключаем индикатор загрузки
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: darkMode ? '#161B22' : '#f5f5f5',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          background: darkMode ? '#1E232A' : '#ffffff',
          borderRadius: '12px',
          boxShadow: darkMode ? '0px 4px 12px rgba(0, 0, 0, 0.3)' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: darkMode ? '#E6E6E6' : '#388BFF' }}
        >
          {isLogin ? 'Вход' : 'Регистрация'}
        </Typography>

        <Form onFinish={handleAuth} layout="vertical">
          {/* Поле ввода имени (только для регистрации) */}
          {!isLogin && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: darkMode ? '#E6E6E6' : 'rgba(0,0,0,.25)' }} />}
                placeholder="Имя"
                size="large"
                style={{ background: darkMode ? '#1E232A' : '#ffffff', color: darkMode ? '#E6E6E6' : '#000000' }}
              />
            </Form.Item>
          )}

          {/* Поле ввода логина */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Пожалуйста, введите ваш логин!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: darkMode ? '#E6E6E6' : 'rgba(0,0,0,.25)' }} />}
              placeholder="Логин"
              size="large"
              style={{ background: darkMode ? '#1E232A' : '#ffffff', color: darkMode ? '#E6E6E6' : '#000000' }}
            />
          </Form.Item>

          {/* Поле ввода email (только для регистрации) */}
          {!isLogin && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваш email!' },
                { type: 'email', message: 'Неверный формат email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: darkMode ? '#E6E6E6' : 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                size="large"
                style={{ background: darkMode ? '#1E232A' : '#ffffff', color: darkMode ? '#E6E6E6' : '#000000' }}
              />
            </Form.Item>
          )}

          {/* Поле ввода пароля */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите ваш пароль!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: darkMode ? '#E6E6E6' : 'rgba(0,0,0,.25)' }} />}
              placeholder="Пароль"
              size="large"
              style={{ background: darkMode ? '#1E232A' : '#ffffff', color: darkMode ? '#E6E6E6' : '#000000' }}
            />
          </Form.Item>

          {/* Кнопка отправки формы */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                background: darkMode ? '#388BFF' : '#1976d2',
                borderColor: darkMode ? '#388BFF' : '#1976d2',
                '&:hover': {
                  background: darkMode ? '#1c6ab9' : '#115293',
                },
              }}
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Form.Item>

          {/* Ссылка на переключение между входом и регистрацией */}
          <Typography
            variant="body2"
            align="center"
            sx={{ color: darkMode ? '#E6E6E6' : '#000000', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </Typography>
        </Form>
      </Box>
    </Box>
  );
};

export default AuthPage;