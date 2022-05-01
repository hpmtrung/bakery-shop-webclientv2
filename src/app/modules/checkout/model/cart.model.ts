import { IProduct } from 'src/app/modules/home/model/product.model';
import { IVariant } from 'src/app/modules/home/model/variant.model';

export interface ICartItem {
  variantId: IVariant['id'];
  typeName: IVariant['typeName'];
  unitPrice: IVariant['unitPrice'];
  productName: IProduct['name'];
  imageUrl: string;
  quantity: number;
}

export interface IUserCart {
  items: ICartItem[];
}
