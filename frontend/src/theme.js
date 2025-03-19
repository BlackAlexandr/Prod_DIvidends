import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#000000' },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeightBold: 700,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#388BFF' }, // Синий акцент
    secondary: { main: '#1DB954' }, // Зеленый акцент
    background: {
      default: '#0D1117', // Темно-синий фон
      paper: '#161B22', // Темно-серый фон для контейнеров
    },
    text: {
      primary: '#E6E6E6', // Светло-серый текст
      secondary: '#A0A0A0', // Вторичный текст
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    fontWeightBold: 700,
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E232A', // Темно-серый фон для заголовков
          color: '#E6E6E6', // Белый текст
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(56, 139, 255, 0.1)', // Подсветка при наведении
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };