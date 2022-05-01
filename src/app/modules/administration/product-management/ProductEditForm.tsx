import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import { ValidatedCheck } from 'src/app/components/form/ValidatedCheck';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { ValidatedSelect } from 'src/app/components/form/ValidatedSelect';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { IAdminProduct } from './model';
import { setShowProductDetailDialogReducer, updateProduct, updateProductThunk } from './product.reducer';

const ProductEditForm = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const { product, showDialog, status } = useAppSelector(state => state.productManagement.selectedProduct);

  const categories = useAppSelector(state => state.category.categories);
  const formRef = React.useRef<FormRefObject>(null);

  useEffect(() => {
    if (showDialog) {
      setReadOnlyMode(true);
    }
  }, [showDialog]);

  useEffect(() => {
    // Reset form state to the lastest update
    formRef.current.reset(product);
  }, [product]);

  useEffect(() => {
    if (status === 'updateSucceed') {
      enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
    }
  }, [status, enqueueSnackbar]);

  if (!product || categories.length === 0) return null;

  const handleToggleReadOnlyMode = (mode: boolean) => {
    setReadOnlyMode(mode);
    if (mode) {
      if (!formRef.current) throw Error();
      formRef.current.reset();
    }
  };

  const handleUpdateProductInfo = (data: IAdminProduct) => {
    dispatch(updateProduct(data));
  };

  return (
    <ValidatedForm ref={formRef} onSubmit={handleUpdateProductInfo} defaultValues={{ ...product, allergens: product.allergens || '' }}>
      <Grid container spacing={2} p={1}>
        <Grid container item spacing={2}>
          <Grid item xs={2}>
            <ValidatedInput type="text" label="Mã SP" name="id" readOnly />
          </Grid>
          <Grid item xs>
            <ValidatedInput type="text" label="Tên" name="name" readOnly={readOnlyMode} />
          </Grid>
          <Grid item xs={3}>
            <ValidatedSelect
              label="Danh mục"
              name="categoryId"
              readOnly={readOnlyMode}
              options={categories.map(category => ({
                key: category.id,
                value: category.name,
              }))}
            />
          </Grid>
        </Grid>
        <Grid container item>
          <ValidatedInput type="textarea" label="Nguyên liệu" name="ingredients" maxRows={3} readOnly={readOnlyMode} />
        </Grid>
        <Grid container item>
          <ValidatedInput type="textarea" label="Chất gây dị ứng" name="allergens" maxRows={2} readOnly={readOnlyMode} />
        </Grid>
        <Grid container item>
          <Grid item xs>
            <ValidatedCheck type="switch" name="available" size="medium" label="Tình trạng kinh doanh" disabled={readOnlyMode} />
          </Grid>
          <Grid item>
            {readOnlyMode ? (
              <Button type="button" variant="contained" color="primary" size="medium" onClick={() => handleToggleReadOnlyMode(false)}>
                Cập nhật
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  loading={status === 'updating'}
                  loadingIndicator="Đang lưu..."
                  sx={{ width: 'auto' }}
                >
                  Lưu sản phẩm
                </LoadingButton>
                <Button
                  type="button"
                  variant="contained"
                  color="inherit"
                  size="medium"
                  disabled={status === 'updating'}
                  onClick={() => handleToggleReadOnlyMode(true)}
                >
                  Hủy
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Grid>
    </ValidatedForm>
  );
};

export default ProductEditForm;
