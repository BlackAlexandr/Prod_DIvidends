import React from 'react';
import DataTable from '../components/DataTable';

const Home = ({ darkMode }) => {
  return (
    <div>
      <h1 style={{ color: darkMode ? '#ffffff' : '#000000' }}>Welcome to Dividend Tracker</h1>
      <DataTable darkMode={darkMode} />
    </div>
  );
};

export default Home;