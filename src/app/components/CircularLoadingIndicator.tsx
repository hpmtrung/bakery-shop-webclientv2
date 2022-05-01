import { Box, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

const CircularLoadingIndicator = React.memo(() => {
  return (
    <Box py={5} textAlign="center">
      <CircularProgress sx={{ color: grey['400'] }} />
    </Box>
  );
});

export default CircularLoadingIndicator;
