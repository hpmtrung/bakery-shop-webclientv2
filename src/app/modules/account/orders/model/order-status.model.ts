import { IOrderDetail } from './order.model';

export interface IOrderStatus {
  id: number;
  name: string;
}

type StatusName = 'all' | 'processing' | 'dispatch' | 'shipped' | 'cancel';

export const ORDER_STATUSES: Record<StatusName, IOrderStatus> = {
  all: { id: 0, name: 'Tất cả' },
  processing: { id: 1, name: 'Chờ duyệt' },
  dispatch: { id: 2, name: 'Đang giao' },
  shipped: { id: 3, name: 'Đã giao' },
  cancel: { id: 4, name: 'Đã hủy' },
};

export const getStatusOfOrder = (statusId: number) => {
  return Object.values(ORDER_STATUSES).find(s => s.id === statusId).name;
};
