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
    confirm({ title: 'X??c nh???n', content: 'B???n c?? mu???n x??a bi???n th??? c???a s???n ph???m' }).then(() => dispatch(deleteVariant(variantId)));
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
            { content: 'M?? s???n ph???m' },
            { content: 'Lo???i', cellProps: { align: 'center' } },
            { content: 'Gi?? g???c', cellProps: { align: 'center' } },
            { content: 'Gi?? b??n', cellProps: { align: 'center' } },
            { content: 'T??nh tr???ng', cellProps: { align: 'center' } },
            { content: 'H??nh ?????ng', cellProps: { align: 'center' } },
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
            { content: variant.available ? 'C??n h??ng' : 'H???t h??ng', cellProps: { align: 'center' } },
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
      enqueueSnackbar('Th??m lo???i s???n ph???m th??nh c??ng', { variant: 'success' });
      trigger = true;
    } else if (status === 'updateSucceed') {
      enqueueSnackbar('C???p nh???t lo???i s???n ph???m th??nh c??ng', { variant: 'success' });
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
        <Typography variant="subtitle1">T???t c??? {variants.length} lo???i s???n ph???m</Typography>
        <Button type="button" variant="outlined" color="primary" size="small" disabled={disableAction} onClick={handleShowInsertForm}>
          Th??m
        </Button>
      </Stack>
      <VariantTable disableAction={disableAction} handleShowEditForm={handleShowEditForm} variants={variants} />
      <Stack direction="column" spacing={2} sx={{ mt: 3, display: showForm ? 'block' : 'none' }}>
        <Typography variant="subtitle1">{formMode === 'insert' ? 'Th??m lo???i m???i' : 'C???p nh???t th??ng tin lo???i s???n ph???m'}</Typography>
        <ValidatedForm ref={formRef} onSubmit={handleSubmit} defaultValues={formStateValue}>
          <Grid container spacing={2}>
            <Grid container item spacing={2} alignItems="center">
              <Grid item xs={2}>
                <ValidatedInput type="text" name="id" label="M?? lo???i" disabled />
              </Grid>
              <Grid item xs={4}>
                <ValidatedSelect
                  label="Lo???i s???n ph???m"
                  name="typeId"
                  fullWidth
                  options={(formMode === 'insert'
                    ? productTypes.filter(pt => !variants.map(v => v.typeId).includes(pt.id))
                    : productTypes.filter(pt => pt.id === formStateValue.typeId || !variants.map(v => v.typeId).includes(pt.id))
                  ).map(pt => ({ key: pt.id, value: pt.name }))}
                />
              </Grid>
              <Grid item xs alignItems="center">
                <ValidatedCheck type="switch" label="T??nh tr???ng h??ng" name="available" />
              </Grid>
            </Grid>
            <Grid container item spacing={2} alignItems="center">
              <Grid item xs={3}>
                <ValidatedInput type="text" name="cost" label="Gi?? g???c" rules={{ required: 'Gi?? g???c kh??ng th??? tr???ng' }} />
              </Grid>
              <Grid item xs={3}>
                <ValidatedInput type="text" name="price" label="Gi?? b??n" rules={{ required: 'Gi?? b??n kh??ng th??? tr???ng' }} />
              </Grid>
            </Grid>
            <Grid container item justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button type="submit" color="primary" variant="contained">
                  L??u lo???i s???n ph???m
                </Button>
              </Grid>
              <Grid item>
                <Button type="button" color="inherit" variant="contained" onClick={handleCloseForm}>
                  H???y
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
