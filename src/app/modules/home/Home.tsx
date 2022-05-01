import { useAppDispatch } from 'src/app/config/store';
import { setHeaderElevationEffect } from 'src/app/shared/reducers/header';
import React, { useEffect } from 'react';
import CategoryMenu from './CategoryMenu';
import Showcase from './Showcase';
import Testimonial from './Testimonial';

const Home = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderElevationEffect(true));
    return () => {
      dispatch(setHeaderElevationEffect(false));
    };
  }, [dispatch]);

  return (
    <>
      <Showcase />
      <CategoryMenu />
      <Testimonial />
    </>
  );
};

export default Home;
