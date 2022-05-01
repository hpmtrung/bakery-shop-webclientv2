import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import SwipeableViews from 'react-swipeable-views';

import React, { useEffect } from 'react';
import { AppBar, Tab, Tabs } from '@mui/material';
import SwipeablePanel from 'src/app/components/SwipeablePanel';
import ProductEditForm from './ProductEditForm';
import ProductVariantEditForm from './ProductVariantEditForm';
import ProductImageEditForm from './ProductImageEditForm';
import { setShowProductDetailDialogReducer } from './product.reducer';

const ProductDetailDialog = () => {
  const dispatch = useAppDispatch();

  const { product, showDialog } = useAppSelector(state => state.productManagement.selectedProduct);
  const [panelIndex, setPanelIndex] = React.useState(0);

  useEffect(() => {
    if (showDialog) {
      setPanelIndex(0); // Show info panel first when open dialog
    }
  }, [showDialog]);

  if (!product) return null;

  const onPanelChange = (e: React.SyntheticEvent, selectedPanelIndex: number) => {
    setPanelIndex(selectedPanelIndex);
  };

  const handleClose = () => {
    dispatch(setShowProductDetailDialogReducer(false));
  };

  return (
    <BootstrapDialog open={showDialog} titleContent={product.name} onClose={handleClose} maxWidth="md" fullWidth>
      <AppBar elevation={0} color="secondary" position="static" sx={{ mb: 3 }}>
        <Tabs value={panelIndex} onChange={onPanelChange} indicatorColor="primary" textColor="inherit" variant="fullWidth">
          <Tab label="Thông tin" />
          <Tab label="Các loại của sản phẩm" />
          <Tab label="Hình ảnh" />
        </Tabs>
      </AppBar>
      <SwipeableViews axis={'x'} index={panelIndex} onChangeIndex={onPanelChange}>
        <SwipeablePanel value={panelIndex} index={0}>
          <ProductEditForm />
        </SwipeablePanel>
        <SwipeablePanel value={panelIndex} index={1}>
          <ProductVariantEditForm />
        </SwipeablePanel>
        <SwipeablePanel value={panelIndex} index={2}>
          <ProductImageEditForm />
        </SwipeablePanel>
      </SwipeableViews>
    </BootstrapDialog>
  );
};

export default ProductDetailDialog;
