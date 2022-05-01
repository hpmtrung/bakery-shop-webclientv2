export interface IUserAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  address?: string | null;
  langKey?: string;
  activated?: boolean;
  authorities: string[];
}