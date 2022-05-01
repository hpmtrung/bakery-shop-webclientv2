import { Button, Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-scroll';
import Slider, { Settings } from 'react-slick';
import background1 from 'src/assets/images/showcase/showcase-1.jpg';
import background2 from 'src/assets/images/showcase/showcase-2.jpg';
import background3 from 'src/assets/images/showcase/showcase-3.jpg';

const carouselSettings: Settings = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnFocus: false,
  pauseOnHover: false,
  fade: true,
};

const SliderItemStyled = styled('div', {
  shouldForwardProp: prop => prop !== 'imageUrl',
})<{ imageUrl: string }>(({ imageUrl }) => ({
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'cover',
  backgroundSize: 'cover',
  height: '100vh',
  backgroundImage: `url(${imageUrl})`
}));

const SliderItemCaption = ({ subTitle, mainTitle }) => (
  <Container maxWidth="md">
    <Stack direction="column" justifyContent="center" alignItems="center" textAlign="center" sx={{ color: 'text.secondary' }}>
      <Typography
        sx={{
          mt: 18,
          mb: 10,
          typography: 'h6',
          letterSpacing: 3,
          textTransform: 'uppercase',
          display: { xs: 'none', sm: 'inline-block' },
        }}
      >
        {subTitle}
      </Typography>
      <Typography sx={{ mb: 8, letterSpacing: 8, fontWeight: 'bold', lineHeight: 1.2, fontSize: { xs: 'h4.fontSize', sm: 'h2.fontSize' } }}>
        {mainTitle}
      </Typography>
      <Link to="category-menu-anchor" smooth={true} duration={600}>
        <Button variant="contained" color="primary" size="large">
          What is your choice today?
        </Button>
      </Link>
    </Stack>
  </Container>
);

const Showcase = React.memo(() => (
	<section>
		<Slider {...carouselSettings}>
			<SliderItemStyled imageUrl={background1}>
				<SliderItemCaption
					subTitle='The Cake Corner is a well-known bakery supplier since 2010'
					mainTitle='Our mission is to provide delicious cake and bakery'
				/>
			</SliderItemStyled>
			<SliderItemStyled imageUrl={background2}>
				<SliderItemCaption
					subTitle='The Cake Corner is a well-known bakery supplier since 2010'
					mainTitle='Our products are under European cake quality standards'
				/>
			</SliderItemStyled>
			<SliderItemStyled imageUrl={background3}>
				<SliderItemCaption
					subTitle='The Cake Corner is a well-known bakery supplier since 2010'
					mainTitle='We hightly prioritize customer satisfaction first'
				/>
			</SliderItemStyled>
		</Slider>
	</section>
));

export default Showcase;
