import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Stack } from '@mui/material';
import CustomPaginationTable from 'src/app/components/CustomPaginationTable';
import { useConfirm } from 'src/app/components/notification';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { translate } from 'src/app/shared/language/Translate';
import { IPaginationBaseState } from 'src/app/shared/util/pagination-utils';
import { useSnackbar } from 'notistack';
import React from 'react';
import { IProductImage } from './model';
import { addProductImages, deleteProductImages, getProductImages } from './product.reducer';

const ProductImageEditForm = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const { images, status, errorMessage } = useAppSelector(state => state.productManagement.selectedProduct.images);
  const product = useAppSelector(state => state.productManagement.selectedProduct.product);

  const [pagination, setPagination] = React.useState<IPaginationBaseState>({ activePage: 0, itemsPerPage: 2, order: 'id', sort: 'DESC' });
  const { activePage, itemsPerPage } = pagination;

  React.useEffect(() => {
    if (product && status === 'idle') {
      dispatch(getProductImages(product.id));
    }
  }, [dispatch, product, status]);

  React.useEffect(() => {
    if (status === 'updateSucceed') {
      enqueueSnackbar('Cập nhật ảnh sản phẩm thành công', { variant: 'success' });
    } else if (status === 'failed') {
      enqueueSnackbar(translate(errorMessage), { variant: 'error' });
    }
  }, [status, enqueueSnackbar, errorMessage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({ ...pagination, activePage: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPagination({ ...pagination, itemsPerPage: parseInt(event.target.value, 10) });
  };

  const handleDeleteImage = async (imageId: IProductImage['id']) => {
    try {
      await confirm({ title: 'Xác nhận', content: 'Bạn có muốn xóa ảnh vừa chọn?' });
      dispatch(deleteProductImages([imageId]));
    } catch (e) {
      return;
    }
  };

  const handleInsertImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length > 10) {
      enqueueSnackbar('Giới hạn số ảnh mỗi lượt tải lên tối đa 10 ảnh', { variant: 'error' });
      return;
    }
    const formData = new FormData();
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      formData.append('images', files[fileIndex]);
    }
    dispatch(addProductImages(formData));
  };

  const slicedImages = images.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage);

  return (
    <Stack direction="column" spacing={1}>
      <Box sx={{ alignSelf: 'flex-end' }}>
        <label htmlFor="contained-button-file">
          <input
            accept="image/*"
            multiple
            id="contained-button-file"
            type="file"
            onChange={handleInsertImages}
            style={{ display: 'none' }}
          />
          <LoadingButton variant="outlined" size="small" loading={status === 'updating'} component="span">
            Thêm ảnh
          </LoadingButton>
        </label>
      </Box>
      <CustomPaginationTable
        rowsPerPageOptions={[1, 2]}
        head={{
          row: {
            cells: [
              { content: 'Mã ảnh' },
              { content: 'Hình ảnh', cellProps: { align: 'center' } },
              { content: 'Hành động', cellProps: { align: 'center' } },
            ],
          },
        }}
        body={{
          rows: slicedImages.map(image => ({
            rowProps: { hover: true, role: 'checkbox', tabIndex: -1 },
            cells: [
              { content: image.id, cellProps: { component: 'th', scope: 'row' } },
              {
                content: <Box component="img" src={image.imagePath} sx={{ width: 200, heigt: 'auto' }} />,
                cellProps: { align: 'center' },
              },
              {
                content: (
                  <IconButton type="button" color="error" disabled={status === 'updating'} onClick={() => handleDeleteImage(image.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                ),
                cellProps: { align: 'center' },
              },
            ],
          })),
        }}
        pagination={{ page: pagination.activePage, rowsPerPage: pagination.itemsPerPage, totalRows: images.length }}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Stack>
  );
};

export default ProductImageEditForm;
