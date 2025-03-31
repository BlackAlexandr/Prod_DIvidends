import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Table, Spin, ConfigProvider, Empty } from 'antd';
import { TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomSwitch from './CustomSwitch';
import { fetchCompanies, fetchHourlyData } from '../api';
import { message } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ChartDataContext } from '../context/ChartDataContext';

const MemoizedChart = React.memo(({ data, darkMode, ticker, navigate }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: darkMode ? '#E6E6E6' : '#000000', 
        fontSize: '0.8rem',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Нет данных
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        onClick={() => navigate(`/chart/${ticker}`)}
      >
        <XAxis 
          dataKey="name" 
          hide 
        />
        <YAxis 
          hide 
          domain={['auto', 'auto']} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: darkMode ? '#1E232A' : '#ffffff',
            color: darkMode ? '#E6E6E6' : '#000000',
            borderRadius: 6,
            border: darkMode ? '1px solid #30363D' : '1px solid #ddd'
          }}
          formatter={(value) => [value, 'Цена']}
          labelFormatter={(label) => `Дата: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke={darkMode ? '#388BFF' : '#1976d2'}
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}, (prevProps, nextProps) => {
  return prevProps.darkMode === nextProps.darkMode && 
         prevProps.ticker === nextProps.ticker &&
         JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});

const DataTable = ({ darkMode }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('all');
  const navigate = useNavigate();
  const { chartData, setChartData } = useContext(ChartDataContext);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setChartLoading(true);
      
      try {
        // Загружаем данные компаний
        const companies = await fetchCompanies();
        if (!Array.isArray(companies)) {
          throw new Error('Получен неверный формат данных');
        }
        setData(companies);

        // Загружаем данные графиков для всех компаний
        const chartPromises = companies.map(async company => {
          try {
            const chartData = await fetchHourlyData(company.Ticker);
            return { ticker: company.Ticker, data: chartData };
          } catch (error) {
            console.error(`Ошибка загрузки данных для ${company.Ticker}:`, error);
            return { ticker: company.Ticker, data: null };
          }
        });

        const charts = await Promise.all(chartPromises);
        const newChartData = {};
        
        charts.forEach(({ ticker, data }) => {
          if (data && data.length > 0) {
            newChartData[ticker] = data;
          }
        });

        setChartData(prev => ({ ...prev, ...newChartData }));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        message.error('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
        setChartLoading(false);
      }
    };

    fetchAllData();
  }, [setChartData]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      const matchesSearch = 
        item.Name.toLowerCase().includes(search.toLowerCase()) ||
        item.Ticker.toLowerCase().includes(search.toLowerCase()) ||
        (item.Dividend_Date && item.Dividend_Date.toLowerCase().includes(search.toLowerCase()));
      
      const matchesFilter = filterMode === 'all' || item.Is_Approved;
      
      return matchesSearch && matchesFilter;
    });
  }, [data, search, filterMode]);

  const columns = useMemo(() => [
    {
      title: 'Компания',
      dataIndex: 'Name',
      key: 'Name',
      width: 240,
      render: (text, record) => (
        <div
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 0'
          }}
          onClick={(e) => {
            e.stopPropagation(); // Предотвращаем всплытие
            navigate(`/historical/${record.Ticker}`); // Клик ведет на исторические данные
          }}
        >
          <CheckCircleIcon
            style={{
              marginRight: 8,
              color: record.Is_Approved
                ? darkMode ? '#388BFF' : '#1976d2'
                : darkMode ? '#ffffff' : '#cccccc',
              fontSize: '1.2rem',
            }}
          />
          {record.Icon ? (
            <img
              src={`data:image/png;base64,${record.Icon}`}
              alt="Логотип компании"
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                marginRight: 8,
                border: darkMode ? '1px solid #30363D' : '1px solid #eee',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: darkMode ? '#30363D' : '#f0f0f0',
                marginRight: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: darkMode ? '#E6E6E6' : '#999',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            >
              {record.Ticker[0]}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              color: darkMode ? '#E6E6E6' : '#333',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 150
            }}>
              {text}
            </span>
            <span style={{ 
              color: darkMode ? '#388BFF' : '#1976d2',
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              {record.Ticker}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Дата дивидендов',
      dataIndex: 'Dividend_Date',
      key: 'Dividend_Date',
      width: 120,
      align: 'center',
      render: (date) => date || '-',
    },
    {
      title: 'Прибыль (RUB)',
      dataIndex: 'Actual_Profit_rub',
      key: 'Actual_Profit_rub',
      width: 140,
      align: 'center',
      render: (value) => value ? `${value} ₽` : '-',
    },
    {
      title: 'Процент (%)',
      dataIndex: 'Profit_interest',
      key: 'Profit_interest',
      width: 120,
      align: 'center',
      render: (value) => value ? `${value}%` : '-',
    },
    {
      title: 'Прогноз прибыли (RUB)',
      dataIndex: 'Forecast_Profit_rub',
      key: 'Forecast_Profit_rub',
      width: 160,
      align: 'center',
      render: (value) => value ? `${value} ₽` : '-',
    },
    {
      title: 'Прогноз процента (%)',
      dataIndex: 'Forecast_Profit_interest',
      key: 'Forecast_Profit_interest',
      width: 160,
      align: 'center',
      render: (value) => value ? `${value}%` : '-',
    },
    {
      title: 'График',
      key: 'chart',
      width: 150,
      align: 'center',
      render: (record) => {
        if (chartLoading) {
          return <Spin size="small" />;
        }
        
        // Проверяем наличие данных для графика
        if (!chartData[record.Ticker] || chartData[record.Ticker].length === 0) {
          return (
            <div style={{
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: darkMode ? '#E6E6E6' : '#666',
              fontSize: '0.8rem'
            }}>
              Нет данных
            </div>
          );
        }
        
        return (
          <MemoizedChart
            data={chartData[record.Ticker]}
            darkMode={darkMode}
            ticker={record.Ticker}
            navigate={navigate}
          />
        );
      },
    },
  ], [darkMode, navigate, chartData, chartLoading]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: darkMode ? '#161B22' : '#ffffff',
          colorText: darkMode ? '#E6E6E6' : '#000000',
          colorBorder: darkMode ? '#30363D' : '#d9d9d9',
          colorFillAlter: darkMode ? '#1E232A' : '#fafafa',
        },
        components: {
          Table: {
            headerBg: darkMode ? '#1E232A' : '#fafafa',
            headerColor: darkMode ? '#E6E6E6' : '#000000',
            rowHoverBg: darkMode ? '#252B33' : '#f5f5f5',
          },
        },
      }}
    >
      <div style={{ 
        padding: 16, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: darkMode ? '#0D1117' : '#f0f2f5'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: 16,
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <TextField
            placeholder="Поиск по компании или тикеру"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              style: {
                backgroundColor: darkMode ? '#1E232A' : '#ffffff',
                color: darkMode ? '#E6E6E6' : '#000000',
                width: 300,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: darkMode ? '#30363D' : '#ccc',
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#388BFF' : '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: darkMode ? '#388BFF' : '#1976d2',
                },
              },
            }}
          />
          
          <CustomSwitch
            value={filterMode}
            onChange={setFilterMode}
            darkMode={darkMode}
          />
        </div>
        
        <div style={{ 
          flex: 1, 
          overflow: 'hidden',
          borderRadius: 8,
          border: `1px solid ${darkMode ? '#30363D' : '#d9d9d9'}`,
          backgroundColor: darkMode ? '#161B22' : '#ffffff'
        }}>
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="ID"
            pagination={false}
            scroll={{ y: 'calc(100vh - 180px)' }}
            size="small"
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  description="Нет данных для отображения"
                  imageStyle={{ height: 60 }}
                />
              )
            }}
            rowClassName={(record) => 
              `table-row ${record.ID % 2 === 0 ? 'even-row' : 'odd-row'}`
            }
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default React.memo(DataTable);