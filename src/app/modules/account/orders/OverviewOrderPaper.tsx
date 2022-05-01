import { DoneAllOutlined, DoNotDisturbAltOutlined, LocalShippingOutlined, LoopOutlined } from '@mui/icons-material';
import { Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import NumberFormat from 'react-number-format';
import { ORDER_STATUSES } from './model/order-status.model';
import { IUserOverviewOrder } from './model/order.model';

const STATUS_ICONS = [LoopOutlined, LocalShippingOutlined, DoneAllOutlined, DoNotDisturbAltOutlined];

const OrderStatusIcon = ({ Icon }) => <Icon color="action" fontSize="small" />;

export interface OverviewOrderPaperProps {
  order: IUserOverviewOrder;
  handleShowDetails: (orderId: number) => any;
}

const OverviewOrderPaper = ({ order, handleShowDetails }: OverviewOrderPaperProps) => {
  return (
    <Paper elevation={0} sx={{ px: 2, py: 3 }}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <OrderStatusIcon Icon={STATUS_ICONS[order.statusId - 1]} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            {Object.values(ORDER_STATUSES).find(s => s.id === order.statusId).name}
          </Typography>
        </Stack>
        <Divider flexItem />
        <Grid container direction="row">
          <Grid container item xs="auto" justifyContent="center" alignItems="center">
            <Box
              component="img"
              src={order.firstDetail.imageUrl}
              sx={{ border: '3px solid #d1d0d0', borderRadius: 1.5, width: 120, height: 'auto' }}
            />
          </Grid>
          <Grid item xs ml={1}>
            <Stack direction="column" spacing={0.5}>
              <Typography variant="subtitle2">{order.firstDetail.productName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.firstDetail.typeName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Số lượng: {order.firstDetail.quantity}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2" color="text.secondary">
              <NumberFormat
                value={order.firstDetail.unitPrice * order.firstDetail.quantity}
                thousandSeparator={true}
                prefix="$"
                inputMode="numeric"
                displayType={'text'}
              />
            </Typography>
          </Grid>
        </Grid>
        <Divider flexItem />
        <Typography variant="body2" fontSize={11} color="text.secondary">
          Thêm {order.numRemainingDetails} sản phẩm
        </Typography>
        <Stack direction="row" spacing={1} alignSelf="flex-end">
          <Typography variant="h6" color={grey[500]} fontWeight={300}>
            Tổng tiền:{' '}
          </Typography>
          <Typography variant="h6" color={grey[600]}>
            <NumberFormat value={order.total} thousandSeparator={true} prefix="$" inputMode="numeric" displayType={'text'} />
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none', alignSelf: 'flex-end', mt: 1 }}
          onClick={() => handleShowDetails(order.id)}
        >
          Xem chi tiết
        </Button>
      </Stack>
    </Paper>
  );
};

export default OverviewOrderPaper;
