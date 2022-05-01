import { LoadingButton } from '@mui/lab';
import { Button, Grid, Link, Stack, TableFooter, TablePagination, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';
import { ValidatedCheck } from 'src/app/components/form/ValidatedCheck';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { ValidatedSelect } from 'src/app/components/form/ValidatedSelect';
import TablePaginationActions from 'src/app/components/TablePaginationActions';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { getAllCategories } from 'src/app/modules/home/category.reducer';
import { translate } from 'src/app/shared/language/Translate';
import { getSortState } from 'src/app/shared/util/pagination-utils';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { IAdminProduct } from './model';
import { getAllProductTypes } from './product-type.reducer';
import { getOverviewProducts, insertProduct, showProductDetailDialog } from './product.reducer';
import { useLocation } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 5;

const ProductManagement = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const categories = useAppSelector(state => state.category.categories);

  const { status, errorMessage, products, total } = useAppSelector(state => state.productManagement.productList);
  const [showForm, setShowForm] = React.useState(false);

  const formRef = React.useRef<FormRefObject>(null);

  const [pagination, setPagination] = React.useState(getSortState(location, PRODUCTS_PER_PAGE, 'id'));
  const { activePage, itemsPerPage } = pagination;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = activePage > 0 ? Math.max(0, (1 + activePage) * itemsPerPage - total) : 0;

  React.useEffect(() => {
    if (status === 'failed') {
      enqueueSnackbar(translate(errorMessage), { variant: 'error' });
    }
  }, [status, errorMessage, enqueueSnackbar]);

  React.useEffect(() => {
    if (status === 'insertSucceed') {
      formRef.current.reset();
      enqueueSnackbar('Thêm sản phẩm thành công', { variant: 'success' });
      dispatch(
        getOverviewProducts({
          page: activePage,
          size: itemsPerPage,
        })
      );
    }
  }, [dispatch, enqueueSnackbar, status, activePage, itemsPerPage]);

  React.useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProductTypes());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(
      getOverviewProducts({
        page: activePage,
        size: itemsPerPage,
      })
    );
  }, [dispatch, activePage, itemsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({
      ...pagination,
      activePage: newPage,
    });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPagination({
      ...pagination,
      itemsPerPage: parseInt(e.target.value, 10),
    });
  };

  const handleShowDetail = (productId: number) => {
    dispatch(showProductDetailDialog(productId));
  };

  const handleSubmitAddProduct = (data: IAdminProduct) => {
    dispatch(insertProduct(data));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formRef.current.reset();
  };

  return status === 'loading' ? (
    <CircularLoadingIndicator />
  ) : products.length === 0 ? (
    <Paper elevation={0} sx={{ p: 1, width: '100%', textAlign: 'center' }}>
      Không có sản phẩm
    </Paper>
  ) : (
    <Paper sx={{ p: 1 }}>
      <Stack direction="column" spacing={2}>
        <TableContainer elevation={0} component={Paper}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell align="center">Tên SP</TableCell>
                <TableCell align="center">Danh mục</TableCell>
                <TableCell align="center">Nguyên liệu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                  <TableCell component="th" scope="row">
                    <Link component="button" color="primary" onClick={() => handleShowDetail(product.id)}>
                      {product.id}
                    </Link>
                  </TableCell>
                  <TableCell align="left">{product.name}</TableCell>
                  <TableCell align="center">{product.categoryName}</TableCell>
                  <TableCell align="left">
                    {product.ingredients.length < 100 ? product.ingredients : product.ingredients.substring(0, 100).concat('...')}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 5 * emptyRows }}>
                  <TableCell colSpan={12} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  colSpan={12}
                  count={total}
                  rowsPerPage={itemsPerPage}
                  page={activePage}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        {!showForm ? (
          <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-end' }} onClick={() => setShowForm(true)}>
            Thêm sản phẩm
          </Button>
        ) : categories.length === 0 ? (
          <CircularLoadingIndicator />
        ) : (
          <>
            <Typography variant="subtitle1">Thêm sản phẩm</Typography>
            <ValidatedForm
              ref={formRef}
              onSubmit={handleSubmitAddProduct}
              defaultValues={{
                id: '',
                name: '',
                categoryId: categories[0].id,
                ingredients: '',
                allergens: 'Không',
                available: true,
              }}
            >
              <Grid container spacing={1}>
                <Grid container item spacing={1}>
                  <Grid item xs>
                    <ValidatedInput type="text" label="Tên sản phẩm" name="name" rules={{ required: 'Name is required' }} />
                  </Grid>
                  <Grid item xs={4}>
                    <ValidatedSelect label="Danh mục" name="categoryId" options={categories.map(c => ({ key: c.id, value: c.name }))} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <ValidatedInput type="textarea" label="Nguyên liệu" name="ingredients" maxRows={3} />
                </Grid>
                <Grid item xs={12}>
                  <ValidatedInput type="textarea" label="Chất gây dị ứng" name="allergens" maxRows={2} />
                </Grid>
                <Grid container item spacing={1}>
                  <Grid item xs>
                    <ValidatedCheck type="switch" name="available" size="medium" label="Tình trạng kinh doanh" />
                  </Grid>
                  <Grid item xs="auto">
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="medium"
                      loading={status === 'inserting'}
                      loadingIndicator="Đang lưu..."
                      sx={{ width: 'auto' }}
                    >
                      Lưu sản phẩm
                    </LoadingButton>
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      type="button"
                      variant="contained"
                      color="inherit"
                      size="medium"
                      disabled={status === 'inserting'}
                      onClick={handleCloseForm}
                    >
                      Hủy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </ValidatedForm>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default ProductManagement;
