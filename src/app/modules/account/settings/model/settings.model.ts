export interface IAccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  langKey?: string;
}

export const defaultAccountSettings: Readonly<IAccountSettings> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  langKey: 'vi',
};

export interface IImageUpload {
  file: Blob | null;
  previewURL: string | null;
}
