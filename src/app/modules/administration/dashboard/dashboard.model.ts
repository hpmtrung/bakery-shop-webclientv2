export interface IAdminOrderStat {
  orderId?: string | number;
  userImageUrl?: string;
  userFullName?: string;
  createdDate?: Date;
  orderTotal?: number;
  paidByCash?: boolean;
  note?: string | undefined;
  statusId?: number;
  statusName?: string;
}

export interface IAdminDashboard {
  totalOrdersNum?: number;
  todayOrdersNum?: number;
  todayProcessingOrdersNum?: number;
  todayCancelOrdersNum?: number;
  todayDispatchOrdersNum?: number;
  todayShippedOrdersNum?: number;
  totalAvailableProductVariantsNum?: number;
  totalSoldProductVariantsNum?: number;
  todaySoldProductVariantsNum?: number;
  topRecentOrders?: IAdminOrderStat[];
}
