import { updateCart } from 'src/app/modules/checkout/checkout.reducer';
import { IUserCart } from 'src/app/modules/checkout/model/cart.model';
import { Storage } from 'src/app/shared/util/storage-utils';

export const registerCart = store => {
  store.dispatch(updateCart(Storage.local.get('cart')));
};
