import { AddShoppingCart, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import SwipeablePanel from 'src/app/components/SwipeablePanel';
import { useAppDispatch } from 'src/app/config/store';
import { addCartItem } from 'src/app/modules/checkout/checkout.reducer';
import { IProduct } from 'src/app/modules/home/model/product.model';
import React from 'react';
import NumberFormat from 'react-number-format';
import SwipeableViews from 'react-swipeable-views';
import FadeTruncateTypograhy from '../../components/FadeTruncateTypograhy';
import LightTopShadowDiv from '../../components/LightTopShadowDiv';

const VariantChipsPanel = ({
  variants,
  paneIdx,
  selectedVariantPaneIdx,
  selectedVariantChipId,
  variantChipsPerPane,
  handleClickVariantChip,
}) => {
  return (
    <SwipeablePanel value={selectedVariantPaneIdx} index={paneIdx}>
      {[...Array(variantChipsPerPane)].map((_, chipIdx) => {
        const variantIdx = paneIdx * 2 + chipIdx;
        return (
          variants[variantIdx] && (
            <Chip
              key={variantIdx}
              label={variants[variantIdx].typeName}
              size="small"
              color={selectedVariantChipId === variantIdx ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
              onClick={() => handleClickVariantChip(variantIdx)}
            />
          )
        );
      })}
    </SwipeablePanel>
  );
};

export interface ProductCardProps {
  product: IProduct;
  variantChipsPerPane: number;
  onShowProductDetailModal: (productId) => any;
}

const ProductCard = ({ product, variantChipsPerPane, onShowProductDetailModal: handleShowProductDetailModal }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [selectedVariantPaneIdx, setSelectedVariantPaneIdx] = React.useState(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = React.useState(0);

  const handleSwipeLeft = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedVariantPaneIdx(selectedVariantPaneIdx - 1);
  };

  const handleSwipeRight = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedVariantPaneIdx(selectedVariantPaneIdx + 1);
  };

  const handleClickVariantChip = (variantIdx: number) => {
    setSelectedVariantIdx(variantIdx);
  };

  const handleAddToCart = () => {
    const variant = product.variants[selectedVariantIdx];
    dispatch(
      addCartItem({
        variantId: variant.id,
        typeName: variant.typeName,
        unitPrice: variant.unitPrice,
        productName: product.name,
        imageUrl: product.imageUrls[0],
        quantity: 1,
      })
    );
  };

  const variants = product.variants;
  const variantsNum = variants.length;
  const panesNum = Math.ceil(variantsNum / variantChipsPerPane);

  const ProductTitle = React.useMemo(
    () => (
      <FadeTruncateTypograhy variant="h6" line={2} gutterBottom>
        {product.name}
      </FadeTruncateTypograhy>
    ),
    [product.name]
  );

  const ProductIngredients = React.useMemo(
    () => (
      <FadeTruncateTypograhy variant="body2" line={2} color="text.secondary" gutterBottom>
        <Typography variant="body2" component="span" color="text.primary">
          Thành phần:&nbsp;
        </Typography>
        {product.ingredients}
      </FadeTruncateTypograhy>
    ),
    [product.ingredients]
  );

  const ProductAllergens = React.useMemo(
    () => (
      <FadeTruncateTypograhy variant="body2" line={1} color="text.secondary" sx={{ mb: 2 }}>
        <Typography variant="body2" component="span" color="text.primary">
          Dị ứng:&nbsp;
        </Typography>
        {product.allergens || 'Không'}
      </FadeTruncateTypograhy>
    ),
    [product.allergens]
  );

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <LightTopShadowDiv>
        <Card elevation={0}>
          <CardActionArea onClick={() => handleShowProductDetailModal(product.id)}>
            <CardMedia component="img" height="160" image={product.imageUrls[0]} alt="Product image" />
          </CardActionArea>
          <CardContent>
            {ProductTitle}
            {ProductIngredients}
            {ProductAllergens}
            <Stack direction="row" justifyContent="center" justifyItems="center" alignItems="center" flexWrap="wrap">
              {selectedVariantPaneIdx !== 0 && (
                <IconButton size="small" onClick={handleSwipeLeft}>
                  <KeyboardArrowLeft fontSize="inherit" />
                </IconButton>
              )}
              <Box flexGrow={1}>
                <SwipeableViews axis={'x'} index={selectedVariantPaneIdx}>
                  {[...Array(panesNum)].map((_, paneIdx) => (
                    <VariantChipsPanel
                      key={paneIdx}
                      handleClickVariantChip={handleClickVariantChip}
                      paneIdx={paneIdx}
                      selectedVariantChipId={selectedVariantIdx}
                      selectedVariantPaneIdx={selectedVariantPaneIdx}
                      variantChipsPerPane={variantChipsPerPane}
                      variants={variants}
                    />
                  ))}
                </SwipeableViews>
              </Box>
              {selectedVariantPaneIdx !== panesNum - 1 && (
                <IconButton size="small" onClick={handleSwipeRight}>
                  <KeyboardArrowRight fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
          </CardContent>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" color="primary" ml={2}>
              <NumberFormat
                value={variants[selectedVariantIdx].unitPrice}
                thousandSeparator={true}
                prefix="$"
                inputMode="numeric"
                displayType={'text'}
              />
            </Typography>

            <Typography variant="caption" color="text.secondary" paddingTop={0.8}>
              {'/' + variants[selectedVariantIdx].typeName}
            </Typography>
            <Box flexGrow={1} />
            <CardActions>
              <Button variant="contained" color="primary" size="small" disableElevation onClick={handleAddToCart}>
                <AddShoppingCart fontSize="small" />
              </Button>
            </CardActions>
          </Stack>
        </Card>
      </LightTopShadowDiv>
    </Grid>
  );
};

export default ProductCard;
