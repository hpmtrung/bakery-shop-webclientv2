import { useContext } from 'react';
import NotificationContext from './NotificationContext';

const useConfirm = () => {
  const { confirm } = useContext(NotificationContext);
  return confirm;
};

export default useConfirm;
