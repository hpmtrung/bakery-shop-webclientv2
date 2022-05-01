import { useContext } from 'react';
import NotificationContext from './NotificationContext';

const useSnackbar = () => {
  const { snackbar } = useContext(NotificationContext);
  return snackbar;
};

export default useSnackbar;
