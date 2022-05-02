import { Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React from "react";
import NumberFormat from "react-number-format";
import { useParams } from "react-router-dom";
import CircularLoadingIndicator from "src/app/components/CircularLoadingIndicator";
import { useAppDispatch, useAppSelector } from "src/app/config/store";
import { getStatusOfOrder } from "./model/order-status.model";
import { getAccountOrderDetails, reset } from "./order.reducer";

const AccountOrderDetailPage = () => {
	const dispatch = useAppDispatch();
	const params = useParams();
	const {
		loading,
		errorMessage,
		selectedOrder: order,
	} = useAppSelector((state) => state.userOrders);

	const orderId = parseInt(params.orderId, 10);

	React.useEffect(() => {
		dispatch(getAccountOrderDetails(orderId));
		return () => {
			dispatch(reset());
		};
	}, [dispatch, orderId]);

	return loading ? (
		<Paper elevation={0} sx={{ p: 1 }}>
			<CircularLoadingIndicator />
		</Paper>
	) : errorMessage ? (
		<Paper elevation={0} sx={{ p: 1 }}>
			<Typography variant='subtitle2' color='text.secondary'>
				Không tìm thấy đơn hàng
			</Typography>
		</Paper>
	) : (
		order && (
			<Grid container spacing={3}>
				<Grid
					container
					item
					justifyContent='space-between'
					alignItems='flex-start'>
					<Grid item xs={12} md>
						<Typography variant='h6' color={grey[700]} fontWeight={300}>
							Chi tiết đơn hàng #{order.id} -{" "}
							<strong>{getStatusOfOrder(order.statusId)}</strong>
						</Typography>
					</Grid>
					<Grid item xs={12} md='auto'>
						<Typography variant='body2'>
							Ngày giờ đặt hàng:{" "}
							{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
						</Typography>
					</Grid>
				</Grid>
				<Grid container item spacing={2}>
					<Grid container item direction='column' xs={6} spacing={1}>
						<Grid item>Địa chỉ người nhận</Grid>
						<Grid item>
							<Paper elevation={0} sx={{ p: 1.5 }}>
								<Stack direction='column' spacing={1}>
									<Typography variant='body2' color='text.secondary'>
										Địa chỉ: {order.receiverInfo.address}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										Điện thoại: {order.receiverInfo.phone}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										Thanh toán: {order.paidByCash ? "Tiền mặt" : "Thẻ"}
									</Typography>
								</Stack>
							</Paper>
						</Grid>
					</Grid>
					<Grid container item direction='column' xs={6} spacing={1}>
						<Grid item>Ghi chú</Grid>
						<Grid item>
							<Paper elevation={0} sx={{ p: 1.5, height: 100 }}>
								<Typography variant='body2' color='text.secondary'>
									{order.receiverInfo.note || "Không"}
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Paper elevation={0} sx={{ p: 1.5 }}>
						<Grid container item spacing={1}>
							<Grid
								container
								item
								alignItems='center'
								sx={{ py: 2, fontSize: 15, color: grey[500], fontWeight: 500 }}>
								<Grid item xs>
									Sản phẩm
								</Grid>
								<Grid container item xs={3} textAlign='center'>
									<Grid item xs>
										Giá
									</Grid>
									<Grid item xs>
										Số lượng
									</Grid>
								</Grid>
								<Grid item xs={2} textAlign='right'>
									Tạm tính
								</Grid>
							</Grid>
							<Grid item xs={12}>
								<Divider flexItem />
							</Grid>
							{/* Product list */}
							{order.details.map((detail, index) => (
								<>
									<Grid key={index} container item alignItems='center'>
										<Grid item xs>
											<Stack direction='row' spacing={1.5}>
												<Box
													component='img'
													src={detail.imageUrl}
													alt='Product image'
													sx={{ height: 70, width: "auto" }}
												/>
												<Stack direction='column' spacing={1}>
													<Typography variant='body2' fontWeight={500}>
														{detail.productName}
													</Typography>
													<Typography variant='caption' color='text.secondary'>
														{detail.typeName}
													</Typography>
												</Stack>
											</Stack>
										</Grid>
										<Grid
											container
											item
											xs={3}
											alignItems='center'
											textAlign='center'>
											<Grid item xs>
												<Typography
													variant='body2'
													color='text.primary'
													sx={{ fontWeight: "400" }}>
													<NumberFormat
														value={detail.unitPrice}
														thousandSeparator={true}
														prefix='$'
														inputMode='numeric'
														displayType={"text"}
													/>
												</Typography>
											</Grid>
											<Grid item xs>
												<Typography
													variant='body2'
													color='text.primary'
													sx={{ fontWeight: "400" }}>
													{detail.quantity}
												</Typography>
											</Grid>
										</Grid>
										<Grid item xs={2} textAlign='right'>
											<Typography variant='body2' color='text.primary'>
												<strong>
													<NumberFormat
														value={detail.unitPrice * detail.quantity}
														thousandSeparator={true}
														prefix='$'
														inputMode='numeric'
														displayType={"text"}
													/>
												</strong>
											</Typography>
										</Grid>
									</Grid>
									{index !== order.details.length - 1 && (
										<Grid item xs={12}>
											<Divider flexItem />
										</Grid>
									)}
								</>
							))}
							<Grid item xs={12}>
								<Divider flexItem />
							</Grid>
							<Grid container item textAlign='right' alignItems='center'>
								<Grid
									item
									xs
									sx={{ fontSize: 15, color: grey[500], fontWeight: 400 }}>
									Tạm tính:
								</Grid>
								<Grid item xs={3}>
									<Typography variant='body2' color='text.primary'>
										<NumberFormat
											value={order.total}
											thousandSeparator={true}
											prefix='$'
											inputMode='numeric'
											displayType={"text"}
										/>
									</Typography>
								</Grid>
							</Grid>
							<Grid container item textAlign='right' alignItems='center'>
								<Grid
									item
									xs
									sx={{ fontSize: 15, color: grey[500], fontWeight: 400 }}>
									Phí vận chuyển:
								</Grid>
								<Grid item xs={3}>
									<Typography variant='body2' color='text.primary'>
										<NumberFormat
											value={0}
											thousandSeparator={true}
											prefix='$'
											inputMode='numeric'
											displayType={"text"}
										/>
									</Typography>
								</Grid>
							</Grid>
							<Grid container item textAlign='right' alignItems='center'>
								<Grid
									item
									xs
									sx={{ fontSize: 15, color: grey[500], fontWeight: 400 }}>
									Tổng cộng:
								</Grid>
								<Grid item xs={3}>
									<Typography variant='h6' color='primary'>
										<NumberFormat
											value={order.total}
											thousandSeparator={true}
											prefix='$'
											inputMode='numeric'
											displayType={"text"}
										/>
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		)
	);
};

export default AccountOrderDetailPage;
