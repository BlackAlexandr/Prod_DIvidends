import React, { useState, useEffect } from 'react';
import { Table, Spin, ConfigProvider } from 'antd';
import { TextField } from '@mui/material'; // Импортируем Material-UI TextField
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Иконка галочки
import CustomSwitch from './CustomSwitch'; // Импортируем наш кастомный переключатель
import { fetchCompanies } from '../api';
import { message } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DataTable = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // Состояние фильтрации: 'all' или 'confirmed'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const companies = await fetchCompanies();
      if (!Array.isArray(companies)) {
        throw new Error('Invalid data format received from the server.');
      }
      setData(companies);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация данных: поиск + фильтр по Is_Approved
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.Name.toLowerCase().includes(searchLower) || // Поиск по названию компании
      item.Ticker.toLowerCase().includes(searchLower) || // Поиск по тикеру
      item.Dividend_Date.toLowerCase().includes(searchLower); // Поиск по дате дивидендов

    // Если выбран режим "Подтверждённые", показываем только одобренные записи
    const matchesApproval = filterMode === 'all' || item.Is_Approved;

    return matchesSearch && matchesApproval;
  });

  // Генерация данных для графика (пример)
  const generateChartData = (record) => {
    // Пример данных для графика (можно заменить на реальные данные из API)
    const chartData = [
      { name: 'Q1', profit: record.Quarter1_Profit || Math.random() * 100 },
      { name: 'Q2', profit: record.Quarter2_Profit || Math.random() * 100 },
      { name: 'Q3', profit: record.Quarter3_Profit || Math.random() * 100 },
      { name: 'Q4', profit: record.Quarter4_Profit || Math.random() * 100 },
    ];
    return chartData;
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'Name',
      key: 'Name',
      width: 240,
      filters: data.map((item) => ({ text: item.Name, value: item.Name })),
      onFilter: (value, record) => record.Name.includes(value),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Иконка галочки */}
          <CheckCircleIcon
            style={{
              marginRight: 8,
              color: record.Is_Approved
                ? darkMode
                  ? '#388BFF'
                  : '#1976d2'
                : darkMode
                ? '#ffffff'
                : '#cccccc',
              fontSize: '1.2rem',
            }}
          />
          {/* Логотип компании */}
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
          {/* Название компании и тикер */}
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
      dataIndex: 'Dividend_Date',
      key: 'Dividend_Date',
      width: 120,
      align: 'center',
      filters: data.map((item) => ({ text: item.Dividend_Date, value: item.Dividend_Date })),
      onFilter: (value, record) => record.Dividend_Date.includes(value),
    },
    {
      title: 'Actual Profit (RUB)',
      dataIndex: 'Actual_Profit_rub',
      key: 'Actual_Profit_rub',
      width: 140,
      align: 'center',
      filters: data.map((item) => ({ text: item.Actual_Profit_rub, value: item.Actual_Profit_rub })),
      onFilter: (value, record) => record.Actual_Profit_rub.toString().includes(value),
    },
    {
      title: 'Actual Interest (%)',
      dataIndex: 'Profit_interest',
      key: 'Profit_interest',
      width: 140,
      align: 'center',
      filters: data.map((item) => ({ text: item.Profit_interest, value: item.Profit_interest })),
      onFilter: (value, record) => record.Profit_interest.toString().includes(value),
    },
    {
      title: 'Forecast Profit (RUB)',
      dataIndex: 'Forecast_Profit_rub',
      key: 'Forecast_Profit_rub',
      width: 160,
      align: 'center',
      filters: data.map((item) => ({ text: item.Forecast_Profit_rub, value: item.Forecast_Profit_rub })),
      onFilter: (value, record) => record.Forecast_Profit_rub?.toString().includes(value),
    },
    {
      title: 'Forecast Profit Interest (%)',
      dataIndex: 'Forecast_Profit_interest',
      key: 'Forecast_Profit_interest',
      width: 160,
      align: 'center',
      filters: data.map((item) => ({ text: item.Forecast_Profit_interest, value: item.Forecast_Profit_interest })),
      onFilter: (value, record) => record.Forecast_Profit_interest?.toString().includes(value),
    },
    // Столбец с графиком (перенесен в конец)
    {
      title: 'Profit Chart',
      key: 'profitChart',
      width: 150,
      align: 'center',
      render: (record) => (
        <ResponsiveContainer width="100%" height={50}>
          <LineChart
            data={generateChartData(record)}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }} // Убираем отступы
          >
            <XAxis dataKey="name" hide /> {/* Скрываем ось X */}
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} /> {/* Скрываем ось Y */}
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1E232A' : '#ffffff',
                color: darkMode ? '#E6E6E6' : '#000000',
                borderColor: 'transparent', // Убираем границу подсказки
                boxShadow: 'none', // Убираем тень
                padding: '4px 8px', // Минимизируем отступы
              }}
              wrapperStyle={{
                outline: 'none', // Убираем рамку вокруг подсказки
              }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke={darkMode ? '#388BFF' : '#1976d2'}
              dot={false} // Убираем точки на линии
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: darkMode ? '#161B22' : '#ffffff',
          colorText: darkMode ? '#E6E6E6' : '#000000',
          fontWeightStrong: 700,
        },
      }}
    >
      <div style={{ padding: '0.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            {/* Поле поиска и переключатель */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {/* Поле поиска */}
              <TextField
                placeholder="Search by company name or ticker"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <span
                      style={{
                        color: darkMode ? '#E6E6E6' : '#000000',
                        marginRight: 8,
                        fontSize: '1rem',
                      }}
                    >
                      🔍
                    </span>
                  ),
                  style: {
                    color: darkMode ? '#E6E6E6' : '#000000',
                    background: darkMode ? '#1E232A' : '#ffffff',
                    borderRadius: '8px',
                    padding: '0.2rem 0.5rem',
                    transition: 'box-shadow 0.3s ease',
                    height: '36px',
                  },
                }}
                sx={{
                  width: 'calc(100% - 220px)',
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                    '& fieldset': {
                      borderColor: darkMode ? '#30363D' : '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: darkMode ? '#388BFF' : '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: darkMode ? '#388BFF' : '#1976d2',
                      boxShadow: darkMode
                        ? '0 0 8px rgba(56, 139, 255, 0.5)'
                        : '0 0 8px rgba(25, 118, 210, 0.5)',
                    },
                  },
                }}
              />

              {/* Кастомный переключатель */}
              <CustomSwitch value={filterMode} onChange={setFilterMode} darkMode={darkMode} />
            </div>

            {/* Таблица */}
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="ID"
              pagination={false}
              scroll={{ y: 'calc(100vh - 300px)' }}
              size="small"
              rowClassName={(record) => {
                const isEven = record.ID % 2 === 0;
                const isSelected = record.ID === selectedRowKey;

                const baseClass = isEven ? 'even-row' : 'odd-row';
                return isSelected ? 'selected-row' : baseClass;
              }}
              onRow={(record) => ({
                onClick: () => setSelectedRowKey(record.ID),
                style: {
                  backgroundColor: record.ID === selectedRowKey ? '#388BFF' : darkMode ? '#1E232A' : '#ffffff',
                  color: darkMode ? '#E6E6E6' : '#000000',
                },
              })}
              title={() => null} // Убираем заголовок таблицы
            />
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default DataTable;