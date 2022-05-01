export interface IManagedAccount {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  address?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: any[];
}
