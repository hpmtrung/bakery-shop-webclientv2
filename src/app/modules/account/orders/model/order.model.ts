import { IVariant } from '../../../home/model/variant.model';
import { IOrderStatus } from './order-status.model';

export interface IOrderDetail {
  variantId: IVariant['id'];
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface IOrderDetail {
  productName: string;
  typeName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface IUserOverviewOrder {
  id: number;
  createdAt: Date;
  statusId: IOrderStatus['id'];
  total: number;
  firstDetail: IOrderDetail;
  numRemainingDetails: number;
}

export interface IUserOrderWithDetail extends Omit<IUserOverviewOrder, 'firstDetail' | 'numRemainingDetails'> {
  canCancel: boolean;
  paidByCash: boolean;
  receiverInfo: {
    address: string;
    phone: string;
    note: string;
  };
  details: IOrderDetail[];
}
