import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Typography, Box, IconButton, ButtonGroup, Button, Slider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchDataByInterval, fetchCompanies } from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartPage = ({ darkMode }) => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ ticker: [], imoex: [] });
  const [selected, setSelected] = useState({ interval: '1h', period: '1y' });
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  useEffect(() => {
    fetchCompanyData();
    fetchDataForPeriod(selected.interval, selected.period);
  }, [ticker, selected]);

  const fetchCompanyData = async () => {
    try {
      const companies = await fetchCompanies();
      const company = companies.find((item) => item.Ticker === ticker);
      if (company) {
        setCompanyInfo(company);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const fetchDataForPeriod = async (interval, period) => {
    setIsLoading(true);
    try {
      const data = await fetchDataByInterval(ticker, interval, period);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/main');
  };

  const prepareChartData = (chartData) => {
    return {
      datasets: [
        {
          label: ticker,
          data: chartData.ticker?.length > 0 ? chartData.ticker.map((item) => item.profit) : [],
          borderColor: darkMode ? '#388BFF' : '#1976D2',
          backgroundColor: darkMode ? '#388BFF' : '#1976D2',
          fill: false,
          xAxisID: 'x-ticker',
          yAxisID: 'y1',
          borderWidth: 1,
          pointRadius: 1,
        },
        {
          label: 'IMOEX',
          data: chartData.imoex?.length > 0 ? chartData.imoex.map((item) => item.profit) : [],
          borderColor: darkMode ? '#FF4D4F' : '#FF7A45',
          backgroundColor: darkMode ? '#FF4D4F' : '#FF7A45',
          fill: false,
          xAxisID: 'x-imoex',
          yAxisID: 'y2',
          borderWidth: 1,
          pointRadius: 1,
        },
        {
          label: 'Объемы',
          data: chartData.ticker?.length > 0 ? chartData.ticker.map((item) => item.Volume) : [],
          type: 'bar',
          backgroundColor: darkMode ? '#52C41A' : '#4CAF50',
          borderColor: darkMode ? '#52C41A' : '#4CAF50',
          borderWidth: 1,
          barThickness: 2,
          xAxisID: 'x-ticker',
          yAxisID: 'y3',
        },
      ],
    };
  };

  const calculateSharesAndDividends = () => {
    if (!companyInfo || !chartData.ticker?.length) return { sharesCount: 0, dividends: 0, pricePerShare: 0 };

    const lastPrice = chartData.ticker[chartData.ticker.length - 1]?.profit || 0;
    if (lastPrice <= 0) return { sharesCount: 0, dividends: 0, pricePerShare: 0 };

    const sharesCount = Math.floor(investmentAmount / lastPrice);
    const actualProfitRub = parseFloat(companyInfo.Actual_Profit_rub) || 0;
    const dividends = (actualProfitRub * sharesCount).toFixed(2);

    return { 
      sharesCount, 
      dividends, 
      pricePerShare: lastPrice.toFixed(2) 
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: darkMode ? '#E6E6E6' : '#000000',
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      'x-ticker': {
        type: 'category',
        position: 'bottom',
        ticks: {
          color: darkMode ? '#E6E6E6' : '#000000',
        },
        grid: {
          color: darkMode ? '#388BFF' : '#ccc',
          display: false,
        },
        labels: chartData.ticker?.length > 0 ? chartData.ticker.map((item) => item.name) : [],
      },
      'x-imoex': {
        type: 'category',
        position: 'top',
        display: false,
        ticks: {
          color: darkMode ? '#FF4D4F' : '#FF7A45',
        },
        grid: {
          color: darkMode ? '#FF4D4F' : '#ccc',
          display: false,
        },
        labels: chartData.imoex?.length > 0 ? chartData.imoex.map((item) => item.name) : [],
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: darkMode ? '#388BFF' : '#1976D2',
        },
        grid: {
          color: darkMode ? '#388BFF' : '#ccc',
          display: false,
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: darkMode ? '#FF4D4F' : '#FF7A45',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y3: {
        type: 'linear',
        display: false,
        position: 'right',
        offset: true,
        ticks: {
          color: darkMode ? '#52C41A' : '#4CAF50',
        },
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: chartData.ticker?.length > 0 ? Math.max(...chartData.ticker.map((item) => item.Volume)) : 0,
      },
    },
  };

  const preparedData = prepareChartData(chartData);
  const { pricePerShare } = calculateSharesAndDividends();

  return (
    <Box
      sx={{
        padding: '1rem',
        background: darkMode ? '#161B22' : '#ffffff',
        color: darkMode ? '#E6E6E6' : '#000000',
        minHeight: '100vh',
      }}
    >
      {/* Header с карточкой компании и калькулятором в одной строке */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Кнопка назад */}
        <IconButton
          onClick={handleBack}
          sx={{
            color: darkMode ? '#388BFF' : '#1976d2',
            background: darkMode ? '#1E232A' : '#f5f5f5',
            '&:hover': {
              background: darkMode ? '#2C323A' : '#e0e0e0',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Карточка компании с ценой акции */}
        <Box
          sx={{
            background: darkMode ? '#1E232A' : '#ffffff',
            color: darkMode ? '#E6E6E6' : '#000000',
            border: darkMode ? '1px solid #388BFF' : '1px solid #1976d2',
            borderRadius: '12px',
            boxShadow: darkMode
              ? '0 4px 6px rgba(56, 139, 255, 0.2)'
              : '0 4px 6px rgba(25, 118, 210, 0.2)',
            padding: '0.75rem 1rem',
            minWidth: '250px',
            height: '100%',
          }}
        >
          <Typography variant="h6" component="div">
            {companyInfo?.Name} • {companyInfo?.Ticker}
          </Typography>
          <Typography variant="body2" color={darkMode ? '#E6E6E6' : '#000000'}>
            Дата дивидендов: {companyInfo?.Dividend_Date}
          </Typography>
          <Typography variant="body2" color={darkMode ? '#E6E6E6' : '#000000'}>
            Цена акции: {pricePerShare} ₽
          </Typography>
        </Box>

        {/* Компактный дивидендный калькулятор без рамки */}
        {companyInfo && (
          <Box
            sx={{
              background: 'transparent',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              flexGrow: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {/* Ползунок суммы инвестиций */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ marginBottom: '0.5rem' }}>
                Сумма инвестиций: {investmentAmount.toLocaleString()} ₽
              </Typography>
              <Slider
                value={investmentAmount}
                onChange={(event, newValue) => setInvestmentAmount(newValue)}
                min={10000}
                max={10000000}
                step={1000}
                sx={{
                  color: darkMode ? '#388BFF' : '#1976d2',
                }}
              />
            </Box>

            {/* Расчетные значения */}
            <Box sx={{ display: 'flex', gap: '1.5rem', marginLeft: '1rem' }}>
              <Box>
                <Typography variant="body2">Акций:</Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: darkMode ? '#388BFF' : '#1976D2',
                  }}
                >
                  {calculateSharesAndDividends().sharesCount}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">Дивиденды:</Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: darkMode ? '#388BFF' : '#1976D2',
                  }}
                >
                  {calculateSharesAndDividends().dividends} ₽
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* График с кнопками выбора интервала */}
      <Box sx={{ position: 'relative', height: '400px', marginBottom: '2rem' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '0.5rem',
          }}
        >
          <ButtonGroup
            size="small"
            sx={{
              gap: '0.2rem',
            }}
          >
            {['1h', '4h', '1d', '1w'].map((int) => (
              <Button
                key={int}
                variant={selected.interval === int ? 'contained' : 'outlined'}
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    interval: int,
                  }))
                }
                sx={{
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.5rem',
                  minWidth: 'auto',
                  color: darkMode ? '#E6E6E6' : '#000000',
                  borderColor: darkMode ? '#388BFF' : '#ccc',
                  background:
                    selected.interval === int
                      ? darkMode
                        ? '#388BFF'
                        : '#1976d2'
                      : 'transparent',
                }}
              >
                {int}
              </Button>
            ))}
          </ButtonGroup>
          <ButtonGroup
            size="small"
            sx={{
              gap: '0.2rem',
            }}
          >
            {['1y', '2y', '3y', '4y', '5y'].map((int) => (
              <Button
                key={int}
                variant={selected.period === int ? 'contained' : 'outlined'}
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    period: int,
                  }))
                }
                sx={{
                  fontSize: '0.8rem',
                  padding: '0.2rem 0.5rem',
                  minWidth: 'auto',
                  color: darkMode ? '#E6E6E6' : '#000000',
                  borderColor: darkMode ? '#388BFF' : '#ccc',
                  background:
                    selected.period === int
                      ? darkMode
                        ? '#388BFF'
                        : '#1976d2'
                      : 'transparent',
                }}
              >
                {int}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        {isLoading ? (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Typography variant="h6" color={darkMode ? '#E6E6E6' : '#000000'}>
              Загрузка данных...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: '70vh' }}>
            <Line data={preparedData} options={options} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChartPage;