import { IVariant } from './variant.model';

export interface IProduct {
  id?: number | string;
  name?: string;
  ingredients?: string;
  allergens?: string | null;
  imageUrls?: string[] | null;
  variants?: IVariant[];
}

export const defaultValue: Readonly<IProduct> = {};
