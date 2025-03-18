import React, { useState, useEffect } from 'react';
import { Table, Input, Spin } from 'antd';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRowKey, setSelectedRowKey] = useState(null); // Для выделения строки

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/companies');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const companies = await response.json();
      console.log("Data received from backend:", companies); // Выводим данные в консоль
      setData(companies);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Company',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
      filters: data.map((item) => ({ text: item.Name, value: item.Name })),
      onFilter: (value, record) => record.Name.includes(value),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <span style={{ fontSize: '0.9rem', color: '#000' }}>{record.Name}</span>
        </div>
      ),
    },
    {
      title: 'Ticker',
      dataIndex: 'Ticker',
      key: 'Ticker',
      width: 80,
      align: 'center',
      filters: data.map((item) => ({ text: item.Ticker, value: item.Ticker })),
      onFilter: (value, record) => record.Ticker.includes(value),
      render: (text) => (
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#000' }}>{text}</span>
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
      render: (text) => <span style={{ fontSize: '0.9rem', color: '#000' }}>{text}</span>,
    },
    {
      title: 'Actual Profit (RUB)',
      dataIndex: 'Actual_Profit_rub',
      key: 'Actual_Profit_rub',
      width: 140,
      align: 'center',
      filters: data.map((item) => ({ text: item.Actual_Profit_rub, value: item.Actual_Profit_rub })),
      onFilter: (value, record) => record.Actual_Profit_rub.toString().includes(value),
      render: (text) => <span style={{ fontSize: '0.9rem', color: '#000' }}>{text}</span>,
    },
    {
      title: 'Actual Interest (%)',
      dataIndex: 'Actual_Profit_interest',
      key: 'Actual_Profit_interest',
      width: 140,
      align: 'center',
      filters: data.map((item) => ({ text: item.Actual_Profit_interest, value: item.Actual_Profit_interest })),
      onFilter: (value, record) => record.Actual_Profit_interest.toString().includes(value),
      render: (text) => <span style={{ fontSize: '0.9rem', color: '#000' }}>{text ? `${text}%` : '-'}</span>,
    },
    {
      title: 'Forecast Profit (RUB)',
      dataIndex: 'Forecast_Profit_rub',
      key: 'Forecast_Profit_rub',
      width: 160,
      align: 'center',
      filters: data.map((item) => ({ text: item.Forecast_Profit_rub, value: item.Forecast_Profit_rub })),
      onFilter: (value, record) => record.Forecast_Profit_rub?.toString().includes(value),
      render: (text) => <span style={{ fontSize: '0.9rem', color: '#000' }}>{text || '-'}</span>, // Если данных нет, показываем '-'
    },
    {
      title: 'Forecast Profit Interest (%)',
      dataIndex: 'Forecast_Profit_interest',
      key: 'Forecast_Profit_interest',
      width: 160,
      align: 'center',
      filters: data.map((item) => ({ text: item.Forecast_Profit_interest, value: item.Forecast_Profit_interest })),
      onFilter: (value, record) => record.Forecast_Profit_interest?.toString().includes(value),
      render: (text) => <span style={{ fontSize: '0.9rem', color: '#000' }}>{text ? `${text}%` : '-'}</span>, // Если данных нет, показываем '-'
    },
  ];

  return (
    <div style={{ padding: '0.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Input.Search
        placeholder="Search by company name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, marginBottom: '0.5rem' }}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="ID"
          pagination={false}
          scroll={{ y: 'calc(100vh - 250px)' }}
          size="small"
          rowClassName={(record) => {
            const isEven = record.ID % 2 === 0;
            const isSelected = record.ID === selectedRowKey;

            const baseClass = isEven ? 'even-row' : 'odd-row';
            return isSelected ? 'selected-row' : baseClass;
          }}
          onRow={(record) => ({
            onClick: () => setSelectedRowKey(record.ID),
          })}
        />
      )}
    </div>
  );
};

export default DataTable;