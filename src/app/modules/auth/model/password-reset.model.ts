export interface IAccountPasswordReset {
  email: string;
}

export const defaultAccountPasswordReset: Readonly<IAccountPasswordReset> = {
  email: '',
};
