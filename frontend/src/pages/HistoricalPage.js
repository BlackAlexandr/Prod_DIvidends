import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HistoricalDataTable from '../components/HistoricalDataTable';

const HistoricalPage = ({ darkMode }) => {
    const { ticker } = useParams(); // Получаем тикер из URL

    return (
        <div>
        <h1 style={{ color: darkMode ? '#ffffff' : '#000000' }}>Historical Data</h1>
        <HistoricalDataTable darkMode={darkMode} />
        </div>
        );
    };

export default HistoricalPage;