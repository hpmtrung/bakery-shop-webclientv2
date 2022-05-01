export interface IAccountSignUp {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export const defaultAccountSignUp: Readonly<IAccountSignUp> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
};
