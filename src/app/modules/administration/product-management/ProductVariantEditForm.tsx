import { Delete, Edit } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import CustomPaginationTable from 'src/app/components/CustomPaginationTable';
import { ValidatedCheck } from 'src/app/components/form/ValidatedCheck';
import { FormRefObject, ValidatedForm } from 'src/app/components/form/ValidatedForm';
import { ValidatedInput } from 'src/app/components/form/ValidatedInput';
import { ValidatedSelect } from 'src/app/components/form/ValidatedSelect';
import { useConfirm } from 'src/app/components/notification';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { translate } from 'src/app/shared/language/Translate';
import { IPaginationBaseState } from 'src/app/shared/util/pagination-utils';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { IAdminVariant } from './model';
import { deleteVariant, getVariantsOfProduct, insertVariant, setStatusVariants, updateVariant } from './product.reducer';

const VariantTable = ({ disableAction, handleShowEditForm, variants }) => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const [selectedVariantId, setSelectedVariantId] = React.useState(null);
  const productTypes = useAppSelector(state => state.productType.productTypes);

  const [pagination, setPagination] = React.useState<IPaginationBaseState>({ activePage: 0, itemsPerPage: 3, order: 'id', sort: 'DESC' });
  const { activePage, itemsPerPage } = pagination;

  React.useEffect(() => {
    if (!disableAction) {
      setSelectedVariantId(null);
    }
  }, [disableAction]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({ ...pagination, activePage: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPagination({ ...pagination, itemsPerPage: parseInt(event.target.value, 10) });
  };

  const handleDeleteVariant = (variantId: IAdminVariant['id']) => {
    confirm({ title: 'Xác nhận', content: 'Bạn có muốn xóa biến thể của sản phẩm' }).then(() => dispatch(deleteVariant(variantId)));
  };

  const handleEditVariant = (variantId: IAdminVariant['id']) => {
    setSelectedVariantId(variantId);
    handleShowEditForm(variantId);
  };

  const slicedVariants = variants.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage);

  return (
    <CustomPaginationTable
      rowsPerPageOptions={[3, 5]}
      disabledPagination={disableAction}
      head={{
        row: {
          cells: [
            { content: 'Mã sản phẩm' },
            { content: 'Loại', cellProps: { align: 'center' } },
            { content: 'Giá gốc', cellProps: { align: 'center' } },
            { content: 'Giá bán', cellProps: { align: 'center' } },
            { content: 'Tình trạng', cellProps: { align: 'center' } },
            { content: 'Hành động', cellProps: { align: 'center' } },
          ],
        },
      }}
      body={{
        rows: slicedVariants.map(variant => ({
          rowProps: { hover: true, role: 'checkbox', tabIndex: -1, selected: variant.id === selectedVariantId },
          cells: [
            { content: variant.id, cellProps: { component: 'th', scope: 'row' } },
            { content: productTypes.find(v => v.id === variant.typeId).name, cellProps: { align: 'center' } },
            { content: variant.cost, cellProps: { align: 'center' } },
            { content: variant.price, cellProps: { align: 'center' } },
            { content: variant.available ? 'Còn hàng' : 'Hết hàng', cellProps: { align: 'center' } },
            {
              content: (
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <IconButton type="button" color="info" disabled={disableAction} onClick={() => handleEditVariant(variant.id)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton type="button" color="error" disabled={disableAction} onClick={() => handleDeleteVariant(variant.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              ),
              cellProps: { align: 'center' },
            },
          ],
        })),
      }}
      pagination={{ page: pagination.activePage, rowsPerPage: pagination.itemsPerPage, totalRows: variants.length }}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

const ProductVariantEditForm = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.productManagement.selectedProduct.product);
  const productTypes = useAppSelector(state => state.productType.productTypes);
  const { status, errorMessage, variants } = useAppSelector(state => state.productManagement.selectedProduct.variants);
  const { enqueueSnackbar } = useSnackbar();
  // const [filterProductTypes, setFilterProductTypes] = React.useState(productTypes);

  const [formStateValue, setFormStateValue] = React.useState({
    id: '',
    productId: product.id,
    typeId: productTypes[0].id,
    cost: 0,
    price: 0,
    hot: false,
    available: false,
  } as IAdminVariant);

  const [showForm, setShowForm] = React.useState(false);
  const disableAction = showForm;

  const [formMode, setFormMode] = React.useState<'insert' | 'edit'>('insert');
  const formRef = React.useRef<FormRefObject>(null);

  // variants thay doi => reset formMode

  React.useEffect(() => {
    let trigger = false;
    if (status === 'failed') {
      enqueueSnackbar(translate(errorMessage), { variant: 'error' });
      trigger = true;
    } else if (status === 'insertSucceed') {
      enqueueSnackbar('Thêm loại sản phẩm thành công', { variant: 'success' });
      trigger = true;
    } else if (status === 'updateSucceed') {
      enqueueSnackbar('Cập nhật loại sản phẩm thành công', { variant: 'success' });
      trigger = true;
    } else if (status === 'deleteSucceed') {
      enqueueSnackbar(translate('variant.message.deleteSucceed'));
      trigger = true;
    }
    if (trigger) {
      dispatch(setStatusVariants('loaded'));
    }
  }, [dispatch, status, errorMessage, enqueueSnackbar]);

  React.useEffect(() => {
    if (formMode === 'edit') {
      setFormStateValue(variants.find(v => v.id === formStateValue.id));
    }
  }, [variants, formMode, formStateValue.id]);

  React.useEffect(() => {
    if (product && status === 'idle') {
      dispatch(getVariantsOfProduct(product.id));
    }
  }, [dispatch, status, product]);

  React.useEffect(() => {
    if (formRef.current) {
      formRef.current.reset(formStateValue);
    }
  }, [formStateValue]);

  // if (variants.length === 0) return null;

  const handleShowInsertForm = () => {
    setShowForm(true);
    setFormMode('insert');
    setFormStateValue({
      ...formStateValue,
      id: '',
      productId: product.id,
      typeId: productTypes.filter(pt => !variants.map(v => v.typeId).includes(pt.id))[0].id,
    });
  };

  const handleShowEditForm = (variantId: IAdminVariant['id']) => {
    setShowForm(true);
    setFormMode('edit');
    setFormStateValue({ ...formStateValue, id: variantId });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formRef.current.reset();
  };

  const handleSubmit = data => {
    console.log('submit: ' + JSON.stringify(data)); // eslint-disable-line no-console
    if (formMode === 'insert') {
      dispatch(insertVariant(data));
    } else {
      dispatch(updateVariant(data));
    }
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Tất cả {variants.length} loại sản phẩm</Typography>
        <Button type="button" variant="outlined" color="primary" size="small" disabled={disableAction} onClick={handleShowInsertForm}>
          Thêm
        </Button>
      </Stack>
      <VariantTable disableAction={disableAction} handleShowEditForm={handleShowEditForm} variants={variants} />
      <Stack direction="column" spacing={2} sx={{ mt: 3, display: showForm ? 'block' : 'none' }}>
        <Typography variant="subtitle1">{formMode === 'insert' ? 'Thêm loại mới' : 'Cập nhật thông tin loại sản phẩm'}</Typography>
        <ValidatedForm ref={formRef} onSubmit={handleSubmit} defaultValues={formStateValue}>
          <Grid container spacing={2}>
            <Grid container item spacing={2} alignItems="center">
              <Grid item xs={2}>
                <ValidatedInput type="text" name="id" label="Mã loại" disabled />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelect
                  label="Loại sản phẩm"
                  name="typeId"
                  fullWidth
                  options={(formMode === 'insert'
                    ? productTypes.filter(pt => !variants.map(v => v.typeId).includes(pt.id))
                    : productTypes.filter(pt => pt.id === formStateValue.typeId || !variants.map(v => v.typeId).includes(pt.id))
                  ).map(pt => ({ key: pt.id, value: pt.name }))}
                />
              </Grid>
              <Grid item xs alignItems="center">
                <ValidatedCheck type="switch" label="Tình trạng hàng" name="available" />
              </Grid>
            </Grid>
            <Grid container item spacing={2} alignItems="center">
              <Grid item xs={3}>
                <ValidatedInput type="text" name="cost" label="Giá gốc" rules={{ required: 'Giá gốc không thể trống' }} />
              </Grid>
              <Grid item xs={3}>
                <ValidatedInput type="text" name="price" label="Giá bán" rules={{ required: 'Giá bán không thể trống' }} />
              </Grid>
            </Grid>
            <Grid container item justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button type="submit" color="primary" variant="contained">
                  Lưu loại sản phẩm
                </Button>
              </Grid>
              <Grid item>
                <Button type="button" color="inherit" variant="contained" onClick={handleCloseForm}>
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </ValidatedForm>
      </Stack>
    </Stack>
  );
};

export default ProductVariantEditForm;
