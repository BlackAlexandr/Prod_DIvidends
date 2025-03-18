import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
        textAlign: 'center',
        padding: '1rem',
        marginTop: 'auto',
      }}
    >
      <Typography variant="body1">© 2023 Dividend Tracker</Typography>
    </Box>
  );
};

export default Footer;