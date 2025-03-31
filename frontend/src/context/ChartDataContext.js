// В файле ChartDataContext.js
import React, { createContext, useState, useMemo } from 'react';

export const ChartDataContext = createContext();

export const ChartDataProvider = ({ children }) => {
  const [chartData, setChartData] = useState({});

  // Используем useMemo для стабилизации значения контекста
  const contextValue = useMemo(() => ({ chartData, setChartData }), [chartData]);

  return (
    <ChartDataContext.Provider value={contextValue}>
      {children}
    </ChartDataContext.Provider>
  );
};