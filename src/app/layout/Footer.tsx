import { Facebook, Google, Instagram } from '@mui/icons-material';
import { Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Footer = () => (
  <Box component="footer" sx={{ py: 5, backgroundColor: 'secondary.main' }}>
    <Container maxWidth="md">
      <Grid container item spacing={3} justifyContent="center">
        <Grid item sm={4}>
          <Typography variant="h5">The Cake Corner ™</Typography>
        </Grid>
        <Grid item sm={4}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6">Về chúng tôi</Typography>
            <Link href="#">Giới thiệu</Link>
            <Link href="#">Tuyển dụng</Link>
            <Link href="#">Khuyến mãi</Link>
          </Stack>
        </Grid>
        <Grid item sm={4}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6">Liên hệ</Typography>
            <Stack direction="row" justifyItems="flex-start" alignItems="center" spacing={1}>
              <Facebook color="primary" />
              <Link href="#">Facebook</Link>
            </Stack>
            <Stack direction="row" justifyItems="flex-start" alignItems="center" spacing={1}>
              <Instagram color="primary" />
              <Link href="#">Instagram</Link>
            </Stack>
            <Stack direction="row" justifyItems="flex-start" alignItems="center" spacing={1}>
              <Google color="primary" />
              <Link href="#">Gmail</Link>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Grid container item mt={5} spacing={2} justifyContent="space-between" textAlign="center">
        <Grid item xs={12} md={3}>
          <Typography variant="body2">© All rights reserved</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Link href="#">Chính sách bảo mật</Link>
            <Link href="#">Điều khoản sử dụng</Link>
            <Link href="#">Khả năng truy cập Web</Link>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Footer;
