import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Адрес бэкенда

export const fetchCompanies = async (ticker = '') => {
  try {
    const response = await axios.get(`${API_URL}/companies`, {
      params: { ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const fetchFreeCompanies = async (ticker = '') => {
  try {
    const response = await axios.get(`${API_URL}/freecompanies`, {
      params: { ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const createCompany = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/companies`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Функция для получения часовых данных
export const fetchHourlyData = async (ticker) => {
  try {
    const response = await axios.get(`${API_URL}/hourly_data`, {
      params: { ticker },
    });
    const formattedData = response.data.map((item) => ({
      name: item.Timestamp,
      profit: item.Close, // Используем цену закрытия как прибыль
    }));
    return formattedData;
  } catch (error) {
    console.error('Error fetching hourly data:', error);
    throw error;
  }
};

export const fetchDataByInterval = async (ticker, interval, period) => {
  try {
    const response = await axios.get(`${API_URL}/data/${interval}`, {
      params: { ticker, period },
    });

    // Обрабатываем данные для тикера
    const formattedTickerData = response.data.ticker.map((item) => {
      const date = new Date(item.Timestamp);
      const formattedDate = date.toISOString().split('T')[0]; // Форматируем дату
      return {
        name: formattedDate, // Используем отформатированную дату
        profit: item.Close, // Используем цену закрытия как прибыль
        Volume: item.Volume || 0, // Добавляем данные объема
      };
    });

    // Обрабатываем данные для IMOEX
    const formattedImoexData = response.data.imoex.map((item) => {
      const date = new Date(item.Timestamp);
      const formattedDate = date.toISOString().split('T')[0]; // Форматируем дату
      return {
        name: formattedDate, // Используем отформатированную дату
        profit: item.Close, // Используем цену закрытия как прибыль
      };
    });
    console.log(formattedTickerData);
    // Возвращаем оба набора данных
    return {
      ticker: formattedTickerData,
      imoex: formattedImoexData,
    };
  } catch (error) {
    console.error(`Error fetching ${interval} data:`, error);
    throw error;
  }
};

export const fetchHistoricalData = async (ticker) => {
  try {
    const response = await axios.get(`${API_URL}/historicaldividends`, {
      params: { ticker },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical dividends:', error);
    throw error;
  }
};

