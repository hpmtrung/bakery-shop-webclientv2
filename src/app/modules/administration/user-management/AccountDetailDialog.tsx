import { Avatar, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { BootstrapDialog } from 'src/app/components/BootstrapDialog';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import React from 'react';
import { setShowAccountDetailDialog } from './account.reducer';

const AccountDetailDialog = () => {
  const dispatch = useAppDispatch();

  const accounts = useAppSelector(state => state.accountManagement.accounts);
  const { accountId, showDialog } = useAppSelector(state => state.accountManagement.selectedAccount);

  if (accounts.length === 0 || !accountId) return null;

  const handleClose = () => {
    dispatch(setShowAccountDetailDialog(false));
  };

  const account = accounts.find(a => a.id === accountId);

  return (
    <BootstrapDialog open={showDialog} titleContent={'Thông tin tài khoản #' + accountId} onClose={handleClose} maxWidth="sm" fullWidth>
      <Grid container direction="column" gap={2}>
        <Grid container item xs={12} alignItems="center" justifyContent="center">
          <Grid item>
            <Avatar src={account.imageUrl} sx={{ width: 150, height: 150 }} />
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs={2}>
            <TextField label="Mã TK" value={account.id} size="small" variant="filled" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs>
            <TextField
              label="Họ tên"
              value={account.firstName + ' ' + account.lastName}
              size="small"
              InputProps={{ readOnly: true }}
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <TextField label="Email" value={account.email} size="small" variant="filled" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          <Grid item xs>
            <TextField label="Phone" value={account.phone} size="small" variant="filled" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={3}>
            <TextField label="Ngôn ngữ" value={account.langKey} size="small" variant="filled" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel control={<Checkbox readOnly checked={account.activated} />} label="Tài khoản đã kích hoạt" />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Địa chỉ"
            value={account.address || ''}
            size="small"
            variant="filled"
            multiline
            InputProps={{ readOnly: true }}
            maxRows={3}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Các quyền"
            value={account.authorities.length > 0 ? account.authorities.join(', ') : ''}
            size="small"
            variant="filled"
            multiline
            InputProps={{ readOnly: true }}
            maxRows={2}
            fullWidth
          />
        </Grid>
      </Grid>
    </BootstrapDialog>
  );
};

export default AccountDetailDialog;
