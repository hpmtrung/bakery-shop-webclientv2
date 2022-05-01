import { ListItemIcon, ListItemText, MenuItem, MenuItemProps, Typography } from '@mui/material';
import Translate from 'src/app/shared/language/Translate';
import React from 'react';
import { NavMenuContext } from './NavMenu';

export interface NavMenuItemProps extends MenuItemProps {
  icon?: JSX.Element;
  contentKey?: string | undefined;
  content: string;
}

export const NavMenuItem = ({ icon, contentKey, content, onClick, ...other }: NavMenuItemProps) => {
  const { handleClose } = React.useContext(NavMenuContext);

  return (
    <MenuItem
      onClick={e => {
        handleClose && handleClose();
        onClick && onClick(e);
      }}
      {...other}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>
        <Typography variant="body2">{contentKey ? <Translate contentKey={contentKey}>{content}</Translate> : content}</Typography>
      </ListItemText>
    </MenuItem>
  );
};

export default NavMenuItem;
