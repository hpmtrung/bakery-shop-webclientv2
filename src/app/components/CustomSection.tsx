import { Container, Stack, Typography, Divider } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export const SectionSubTitle = ({ title }) => (
  <Typography variant="overline" textAlign="center">
    {title}
  </Typography>
);

export const SectionTitle = ({ title }) => (
  <Typography variant="h4" textAlign="center">
    {title}
  </Typography>
);

export const CustomSection = ({ children, ...other }) => (
  <Box component="section" py={10} flexGrow={1} {...other}>
    <Container maxWidth="lg">{children}</Container>
  </Box>
);
