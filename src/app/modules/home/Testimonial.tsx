import { Avatar, Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import React from 'react';
import { CustomSection, SectionTitle } from '../../components/CustomSection';

const TestimonialItem = ({ avatarName, bgColor }) => (
  <Card>
    <CardHeader avatar={<Avatar sx={{ bgcolor: bgColor }}>{avatarName}</Avatar>} title="Professional" subheader="September 14, 2016" />
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Typography>
    </CardContent>
  </Card>
);

const Testimonial = () => (
  <CustomSection even>
    <Stack direction="column" spacing={5}>
      <SectionTitle title="Đánh giá từ chuyên gia" />
      <Grid container spacing={2} justifyContent="center">
        <Grid item sm={6} md={3}>
          <TestimonialItem avatarName="M" bgColor={deepOrange[500]} />
        </Grid>
        <Grid item sm={6} md={3}>
          <TestimonialItem avatarName="N" bgColor={deepPurple[500]} />
        </Grid>
        <Grid item sm={6} md={3}>
          <TestimonialItem avatarName="A" bgColor={deepOrange[500]} />
        </Grid>
        <Grid item sm={6} md={3}>
          <TestimonialItem avatarName="S" bgColor={deepPurple[500]} />
        </Grid>
      </Grid>
    </Stack>
  </CustomSection>
);

export default Testimonial;
