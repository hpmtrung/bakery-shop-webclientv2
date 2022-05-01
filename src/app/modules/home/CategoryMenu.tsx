import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';
import { ResponsiveTab } from 'src/app/components/ResponsiveTab';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import CartNotificationSnackbar from 'src/app/modules/checkout/CartNotificationSnackbar';
import { getAllCategories, setShowProductDetailDialog } from 'src/app/modules/home/category.reducer';
import { getProductsOfCategory, reset } from 'src/app/modules/home/product.reducer';
import { getSortState } from 'src/app/shared/util/pagination-utils';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import { CustomSection } from '../../components/CustomSection';
import {ReactComponent as BirthdayCakeIcon} from './../../../assets/icon/category/birthday.svg';
import { ReactComponent as BrownieCakeIcon } from './../../../assets/icon/category/brownie.svg';
import { ReactComponent as CheeseCakeIcon } from './../../../assets/icon/category/cheese.svg';
import { ReactComponent as CupCakeIcon } from './../../../assets/icon/category/cupcake.svg';
import { ReactComponent as IceCreamCakeIcon } from './../../../assets/icon/category/ice-cream.svg';
import { ReactComponent as IceBoxCakeIcon } from './../../../assets/icon/category/icebox.svg';
import CategoryBanner from './CategoryBanner';
import ProductCard from './ProductCard';
import ProductDetailDialog from './ProductDetailDialog';

const PRODUCT_ITEMS_PER_PAGE = 6;

const ProductsNotFound = React.memo(() => (
  <Box py={5} textAlign="center">
    <Typography variant="body1" color="text.secondary">
      Không tìm thấy sản phẩm
    </Typography>
  </Box>
));

const CategoryMenu = () => {
  const location = useLocation();
  const theme = useTheme();
  const matchW320 = useMediaQuery('(min-width:320px)');
  const matchW375 = useMediaQuery('(min-width:375px)');
  const matchW425 = useMediaQuery('(min-width:425px)');

  let maxVariantChips = 0;
  if (matchW320) {
    maxVariantChips = 3;
  } else if (matchW375) {
    maxVariantChips = 4;
  } else {
    maxVariantChips = 5;
  }

  const dispatch = useAppDispatch();

  const categoryLoading = useAppSelector(state => state.category.loading);
  const categories = useAppSelector(state => state.category.categories);
  const products = useAppSelector(state => state.product.products);
  const productLoading = useAppSelector(state => state.product.loading);
  const linksProduct = useAppSelector(state => state.product.links);
  const productsNotFound = useAppSelector(state => state.product.productsNotFound);

  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const [productPagination, setProductPagination] = React.useState(getSortState(location, PRODUCT_ITEMS_PER_PAGE, 'id'));

  React.useLayoutEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  React.useEffect(() => {
    if (categories.length > 0) {
      if (productPagination.activePage === 0) {
        dispatch(reset());
      }
      dispatch(
        getProductsOfCategory({
          categoryId: categories[selectedCategoryIndex].id,
          params: {
            page: productPagination.activePage,
            size: productPagination.itemsPerPage,
          },
        })
      );
    }
  }, [dispatch, categories, selectedCategoryIndex, productPagination.activePage, productPagination.itemsPerPage]);

  const handleTabChange = (e: React.SyntheticEvent, selectedTabIndex: number) => {
    setSelectedCategoryIndex(selectedTabIndex);
    setProductPagination({
      ...productPagination,
      activePage: 0,
    });
  };

  const handleShowProductDetailModal = (productId: number) => {
    dispatch(
      setShowProductDetailDialog({
        show: true,
        productId,
      })
    );
  };

  const handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      setProductPagination({
        ...productPagination,
        activePage: productPagination.activePage + 1,
      });
    }
  };

  return (
    <>
      {/* Banner */}
      <CategoryBanner categories={categories} tabIndex={selectedCategoryIndex} />
      {/* Menu */}
      {!categoryLoading && (
        <CustomSection sx={{ mt: -19 }}>
          <Paper elevation={1}>
            {/* Tabs */}
            <ResponsiveTab
              breakpoint={theme.breakpoints.up('lg')}
              value={selectedCategoryIndex}
              onChange={handleTabChange}
              iconSVG
              tabItems={[
                { icon: CupCakeIcon, label: 'Cup Cake' },
                { icon: BirthdayCakeIcon, label: 'Birthday Cake' },
                { icon: CheeseCakeIcon, label: 'Cheese Cake' },
                { icon: IceCreamCakeIcon, label: 'Pudding Cake' },
                { icon: IceBoxCakeIcon, label: 'Icebox Cake' },
                { icon: BrownieCakeIcon, label: 'Brownie Cake' },
              ]}
            />
            {/* Product grid */}
            <Box sx={{ p: 3 }}>
              {productLoading ? (
                <CircularLoadingIndicator />
              ) : productsNotFound ? (
                <ProductsNotFound />
              ) : (
                <InfiniteScroll
                  dataLength={products.length}
                  next={handleLoadMore}
                  hasMore={productPagination.activePage < linksProduct.next}
                  loader={<CircularLoadingIndicator />}
                >
                  <Grid container spacing={3} p={2}>
                    {products.map(
                      product =>
                        product.variants.length > 0 && (
                          <ProductCard
                            key={product.id}
                            product={product}
                            variantChipsPerPane={maxVariantChips}
                            onShowProductDetailModal={handleShowProductDetailModal}
                          />
                        )
                    )}
                  </Grid>
                </InfiniteScroll>
              )}
            </Box>
          </Paper>
        </CustomSection>
      )}
      <ProductDetailDialog />
      <CartNotificationSnackbar />
    </>
  );
};

export default CategoryMenu;
