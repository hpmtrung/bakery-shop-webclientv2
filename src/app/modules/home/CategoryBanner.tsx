import { styled } from '@mui/material';
import { Box } from '@mui/system';
import { ICategory } from 'src/app/modules/home/model/category.model';
import React from 'react';
import { Element } from 'react-scroll';
import Slider, { Settings } from 'react-slick';
import DefaultBanner from "src/assets/images/banner/category-banner-default.jpg";

const BANNER_HEIGHT = 350;

const carouselSettings: Settings = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: false,
  autoplay: false,
  fade: true,
};

const CategoryBannerStyled = styled('div', {
  shouldForwardProp: prop => prop !== 'imageUrl',
})<{ imageUrl: string }>(({ imageUrl }) => ({
  backgroundImage: `url(${imageUrl})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundAttachment: 'local',
  width: '100%',
  height: `${BANNER_HEIGHT}px`,
}));

export type CategoryBannerProps = {
  categories: readonly ICategory[];
  tabIndex: number;
};

const CategoryBanner = ({ categories, tabIndex }: CategoryBannerProps) => {
  const slider = React.useRef<Slider>(null);

  if (slider.current != null) {
    slider.current.slickGoTo(tabIndex);
  }

  return (
		<Box id='category-banner' flexGrow={1} position='relative' zIndex={-999}>
			<Element name='category-menu-anchor'>
				{categories.length > 0 ? (
					<Slider ref={slider} {...carouselSettings}>
						{categories.map((category, idx) => (
							<CategoryBannerStyled key={idx} imageUrl={category.banner} />
						))}
					</Slider>
				) : (
					<CategoryBannerStyled imageUrl={DefaultBanner} />
				)}
				<Box
					id='banner-cover'
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: BANNER_HEIGHT,
					}}></Box>
			</Element>
		</Box>
	);
};

export default CategoryBanner;
