export interface ICategory {
  id?: number;
  name?: string;
  imageUrl?: string | null;
  icon?: string | null;
  banner?: string | null;
}

export const defaultValue: Readonly<ICategory> = {};
