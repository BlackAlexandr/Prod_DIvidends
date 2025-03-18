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

export const createCompany = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/companies`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};