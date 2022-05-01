export interface IAdminOverviewProduct {
  id: number;
  name: string;
  categoryName: string;
  ingredients: string;
}

export interface IAdminProduct {
  id: number | null;
  name: string;
  categoryId: number | string;
  ingredients: string;
  allergens: string | null;
  available: boolean;
}

// Variant
export interface IAdminVariant {
  id: number | string;
  productId: number;
  typeId: number;
  cost: number;
  price: number;
  hot: boolean;
  available: boolean;
}

export interface IProductType {
  id: number;
  name: string;
}

export interface IProductImage {
  id: number;
  imagePath: string;
}
