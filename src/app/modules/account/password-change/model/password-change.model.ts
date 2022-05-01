export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
}

export const defaultPasswordChange: Readonly<IPasswordChange> = {
  currentPassword: '',
  newPassword: '',
};
