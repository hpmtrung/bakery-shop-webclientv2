import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CustomSection } from 'src/app/components/CustomSection';

const PageNotFound = () => (
  <CustomSection even>
    <Stack direction="column" alignItems="center" textAlign="center" spacing={3} py={1}>
      <Box mx="auto">
        <img src="./../../assets/images/404.png" style={{ maxWidth: '300px' }} alt="Page not found" />
      </Box>
      <Typography variant="h4">404 Error</Typography>
      <Typography variant="h6" mb={2}>
        We can not find the page you are looking for.
      </Typography>
      <Button variant="contained" href="/">
        Return to Homepage
      </Button>
    </Stack>
  </CustomSection>
);

export default PageNotFound;
