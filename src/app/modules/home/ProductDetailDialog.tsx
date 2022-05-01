import { Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { setShowProductDetailDialog } from 'src/app/modules/home/category.reducer';
import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import React from 'react';
import Slider from 'react-slick';

const ProductDetailDialog = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.category.showProductDetalDialog);
  const product = useAppSelector(state => {
    const id = state.category.selectedProductId;
    return id !== -1 ? state.product.products.find(p => p.id === id) : null;
  });

  const handleClose = () => {
    dispatch(setShowProductDetailDialog({ show: false }));
  };

  return (
    open &&
    product && (
      <BootstrapDialog maxWidth={'md'} open={open} onClose={handleClose} titleContent={product.name}>
        <Grid container pt={2} pb={4} spacing={3}>
          <Grid item md={7}>
            <Slider dots={true} arrows={false} slidesToShow={1} slidesToScroll={1} swipeToSlide={true}>
              {product.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt="ProductImage" style={{ height: '80px', width: 'auto' }} />
              ))}
            </Slider>
          </Grid>
          <Grid item md={5} pt={2}>
            <Typography variant="h6" mb={1}>
              Thành phần:
            </Typography>
            <p>{product.ingredients}</p>
            <Typography variant="h6" mb={1}>
              Dị ứng:
            </Typography>
            <p>{product.allergens || 'Không'}</p>
          </Grid>
        </Grid>
      </BootstrapDialog>
    )
  );
};

export default ProductDetailDialog;
