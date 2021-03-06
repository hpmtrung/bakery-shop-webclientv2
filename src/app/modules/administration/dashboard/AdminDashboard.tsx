import {
  CakeOutlined,
  CategoryOutlined,
  DoneAllOutlined,
  DoNotDisturbAltOutlined,
  LocalShippingOutlined,
  LoopOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import InvoiceSvgIcon from 'src/app/components/svg/InvoiceSvgIcon';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/config/store';
import { getDashboardData, reset } from './dashboard.reducer';
import CircularLoadingIndicator from 'src/app/components/CircularLoadingIndicator';

const DashboardRegion = ({ children }) => (
  <Paper elevation={0} sx={{ p: 1 }}>
    {children}
  </Paper>
);

const TopStatRegion = ({ Icon, title, statContent }) => (
  <DashboardRegion>
    <Stack direction="row" spacing={1} alignItems="center">
      <Icon color="primary" fontSize="medium" sx={{ mx: 2 }} />
      <Stack direction="column" spacing={1} alignItems="flex-start" justifyContent="center" sx={{ width: '100%' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {statContent}
        </Typography>
      </Stack>
    </Stack>
  </DashboardRegion>
);

const statusIcons = {
  process: LoopOutlined,
  dispatch: LocalShippingOutlined,
  shipped: DoneAllOutlined,
  cancel: DoNotDisturbAltOutlined,
};

const OrderStatWithStatus = ({ Icon, statusName, value, total }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Icon fontSize="small" color="primary" />
      <Stack direction="column" spacing={1} justifyContent="center" alignItems="flex-start" flexGrow={1}>
        <Typography variant="body2">{statusName}</Typography>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={(value / total) * 100} />
        </Box>
      </Stack>
    </Stack>
  );
};

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { loading, data, errorMessage } = useAppSelector(state => state.dashboard);

  React.useEffect(() => {
    dispatch(getDashboardData());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return loading ? (
    <CircularLoadingIndicator />
  ) : !data ? (
    <div>{errorMessage}</div>
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TopStatRegion Icon={InvoiceSvgIcon} title="T???ng s??? ????n h??ng" statContent={data.totalOrdersNum} />
      </Grid>
      <Grid item xs={4}>
        <TopStatRegion Icon={CategoryOutlined} title="T???ng s??? s???n ph???m b??y b??n" statContent={data.totalAvailableProductVariantsNum} />
      </Grid>
      <Grid item xs={4}>
        <TopStatRegion Icon={CakeOutlined} title="T???ng s??? s???n ph???m ???? b??n" statContent={data.totalSoldProductVariantsNum} />
      </Grid>
      <Grid item xs={4}>
        <DashboardRegion>
          <Stack direction="column" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              S??? ????n h??ng h??m nay
            </Typography>
            <OrderStatWithStatus
              Icon={statusIcons.process}
              statusName="Ch??? duy???t"
              value={data.todayProcessingOrdersNum}
              total={data.todayOrdersNum}
            />
            <OrderStatWithStatus
              Icon={statusIcons.dispatch}
              statusName="??ang giao"
              value={data.todayDispatchOrdersNum}
              total={data.todayOrdersNum}
            />
            <OrderStatWithStatus
              Icon={statusIcons.shipped}
              statusName="???? giao"
              value={data.todayShippedOrdersNum}
              total={data.todayOrdersNum}
            />
            <OrderStatWithStatus
              Icon={statusIcons.cancel}
              statusName="???? h???y"
              value={data.todayCancelOrdersNum}
              total={data.todayOrdersNum}
            />
            <Divider flexItem />
            <Grid container direction="row" rowGap={1} textAlign="center">
              <Grid item xs>
                <Stack direction="column" spacing={1} justifyContent="center">
                  <Typography variant="caption">Ch??? duy???t</Typography>
                  <Typography variant="caption">{data.todayProcessingOrdersNum}</Typography>
                </Stack>
              </Grid>
              <Grid item xs>
                <Stack direction="column" spacing={1} justifyContent="center">
                  <Typography variant="caption">??ang giao</Typography>
                  <Typography variant="caption">{data.todayDispatchOrdersNum}</Typography>
                </Stack>
              </Grid>
              <Grid item xs>
                <Stack direction="column" spacing={1} justifyContent="center">
                  <Typography variant="caption">???? giao</Typography>
                  <Typography variant="caption">{data.todayShippedOrdersNum}</Typography>
                </Stack>
              </Grid>
              <Grid item xs>
                <Stack direction="column" spacing={1} justifyContent="center">
                  <Typography variant="caption">???? H???y</Typography>
                  <Typography variant="caption">{data.todayCancelOrdersNum}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </DashboardRegion>
      </Grid>
      <Grid item xs={8}>
        <DashboardRegion>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              C??c ????n h??ng g???n nh???t
            </Typography>
            <TableContainer component="div">
              <Table sx={{ minWidth: 100 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>M?? h??a ????n</TableCell>
                    <TableCell align="right">H??? t??n KH</TableCell>
                    <TableCell align="right">T???ng ti???n</TableCell>
                    <TableCell align="right">Tr???ng th??i</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topRecentOrders.map(order => (
                    <TableRow key={order.orderId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {order.orderId}
                      </TableCell>
                      <TableCell align="right">{order.userFullName}</TableCell>
                      <TableCell align="right">{order.orderTotal}</TableCell>
                      <TableCell align="right">{order.statusName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </DashboardRegion>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
