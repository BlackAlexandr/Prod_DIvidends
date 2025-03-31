import React, { useState, useEffect } from 'react';
import { Table, Spin, ConfigProvider } from 'antd';
import { TextField } from '@mui/material'; // Material-UI TextField
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Checkmark icon
import CustomSwitch from './CustomSwitch'; // Кастомный переключатель
import { fetchHistoricalData } from '../api'; // API utility functions
import { message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const HistoricalDataTable = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [hourlyData, setHourlyData] = useState({}); // Store hourly data for each ticker
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // Filter mode: 'all' or 'confirmed'
  const navigate = useNavigate(); // Для перенаправления
  const { ticker } = useParams(); // Получаем тикер из URL

  useEffect(() => {
    fetchData(ticker);
  }, []);

  const fetchData = async (ticker) => {
    setLoading(true);
    try {
      const historicalData = await fetchHistoricalData(ticker);
      if (!Array.isArray(historicalData)) {
        throw new Error('Invalid data format received from the server.');
      }
      setData(historicalData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search and approval status
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.Name.toLowerCase().includes(searchLower) ||
      item.Ticker.toLowerCase().includes(searchLower) ||
      item.Date.toLowerCase().includes(searchLower);
    const matchesApproval = filterMode === 'all' || item.Is_Approved;
    return matchesSearch && matchesApproval;
  });

  const columns = [
    {
      title: 'Company',
      dataIndex: 'Name',
      key: 'Name',
      width: 240,
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Checkmark icon */}
          <CheckCircleIcon
            style={{
              marginRight: 8,
              color: darkMode 
                  ? '#388BFF'
                  : '#1976d2',
              fontSize: '1.2rem',
            }}
          />
          {/* Company logo */}
          {record.Icon ? (
            <img
              src={`data:image/png;base64,${record.Icon}`}
              alt="Company Icon"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                marginRight: 8,
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: '#ccc',
                marginRight: 8,
              }}
            />
          )}
          {/* Company name and ticker */}
          <span>
            {text}{' '}
            <span
              style={{
                fontWeight: 'bold',
                color: darkMode ? '#388BFF' : '#1976d2',
                marginLeft: 4,
              }}
            >
              • {record.Ticker}
            </span>
          </span>
        </div>
      ),
    },
    {
      title: 'Dividend Date',
      dataIndex: 'Date',
      key: 'Date',
      width: 120,
      align: 'center',
    },
    {
      title: 'Actual Profit (RUB)',
      dataIndex: 'Profit_rub',
      key: 'Profit_rub',
      width: 140,
      align: 'center',
    },
    {
      title: 'Actual Interest (%)',
      dataIndex: 'Profit_interest',
      key: 'Profit_interest',
      width: 140,
      align: 'center',
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: darkMode ? '#161B22' : '#ffffff',
          colorText: darkMode ? '#E6E6E6' : '#000000',
        },
      }}
    >
      <div style={{ padding: '0.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            {/* Table */}
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="ID"
              pagination={false}
              scroll={{ y: 'calc(100vh - 300px)' }}
              size="small"
              rowClassName={(record) => {
                const isEven = record.ID % 2 === 0;
                return isEven ? 'even-row' : 'odd-row';
              }}
            />
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default HistoricalDataTable;