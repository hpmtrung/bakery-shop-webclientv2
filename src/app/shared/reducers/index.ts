import userOrders from 'src/app/modules/account/orders/order.reducer';
import password from 'src/app/modules/account/password-change/password.reducer';
import settings from 'src/app/modules/account/settings/account-settings.reducer';
import dashboard from 'src/app/modules/administration/dashboard/dashboard.reducer';
import productManagement from 'src/app/modules/administration/product-management/product.reducer';
import orderManagement from 'src/app/modules/administration/order-management/admin-order.reducer';
import accountManagement from 'src/app/modules/administration/user-management/account.reducer';
import productType from 'src/app/modules/administration/product-management/product-type.reducer';
import applicationProfile from 'src/app/modules/app-profile/application-profile';
import activate from 'src/app/modules/auth/activate/activate.reducer';
import authentication from 'src/app/modules/auth/authentication.reducer';
import passwordReset from 'src/app/modules/auth/password-reset.reducer';
import signUp from 'src/app/modules/auth/sign-up.reducer';
import cart from 'src/app/modules/checkout/checkout.reducer';
import category from 'src/app/modules/home/category.reducer';
import product from 'src/app/modules/home/product.reducer';
import header from './header';
import locale from './locale';

const rootReducer = {
  authentication,
  locale,
  applicationProfile,
  header,
  signUp,
  activate,
  passwordReset,
  password,
  category,
  product,
  cart,
  // Account
  settings,
  userOrders,
  // Administrators
  dashboard,
  productManagement,
  productType,
  orderManagement,
  accountManagement,
};

export default rootReducer;
