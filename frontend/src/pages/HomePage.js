import React from 'react';
import DataTable from '../components/DataTable';

const Home = ({ darkMode }) => {
  return (
    <div>
      <DataTable darkMode={darkMode} />
    </div>
  );
};

export default Home;