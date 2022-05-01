export interface IOrderStatus {
  id: number;
  name: string;
}

export interface IAdminOverviewOrder {
  id: number;
  createdAt: Date;
  statusId: number;
  total: number;
  customerName: string;
}

export interface IAdminOrderDetail {
  productName: string;
  typeName: string;
  unitPrice: number;
  quantity: number;
}

export interface IAdminOrder extends IAdminOverviewOrder {
  canCancel: boolean;
  paidByCash: boolean;
  receiverInfo: {
    address: string;
    phone: string;
    note: string;
  };
  details: IAdminOrderDetail[];
}

export interface IResponseAfterUpdateStatus {
  orderId: IAdminOrder['id'];
  updatedStatusId: IOrderStatus['id'];
  updatedStatusName: IOrderStatus['name'];
  canCancel: boolean;
}
