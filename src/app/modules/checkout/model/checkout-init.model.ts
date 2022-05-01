import { ICartItem } from './cart.model';

export interface ICheckoutInit {
  address: string;
  phone: string;
  paidByCash: boolean;
  note?: string;
}

export const defaultCheckoutInit: Readonly<ICheckoutInit> = {
  address: '',
  phone: '',
  paidByCash: true,
  note: '',
};

export interface IUnAuthCheckoutInit extends ICheckoutInit {
  cartDetails: {
    variantId: ICartItem['variantId'];
    quantity: number;
  }[];
}
