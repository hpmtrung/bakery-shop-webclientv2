export interface IAccountLogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const defaultAccountLogin: Readonly<IAccountLogin> = {
  email: '',
  password: '',
  rememberMe: false,
};
