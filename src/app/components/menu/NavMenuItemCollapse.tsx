import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, List, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import Translate from 'src/app/shared/language/Translate';
import React, { ReactElement } from 'react';
import { NavMenuItemProps } from './NavMenuItem';

// export type NavMenuItemCollapseProps = NavMenuItemProps & {
//   children: React.ReactNode | React.ReactNode[];
// };

// const NavMenuItemCollapse = ({ href, icon, contentKey, content, children, ...other }: NavMenuItemProps) => {
const NavMenuItemCollapse = ({ icon, contentKey, content, children, ...other }: NavMenuItemProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* <MenuItem href={href} onClick={handleClick} {...other}> */}
      <MenuItem onClick={handleClick} {...other}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{contentKey ? <Translate contentKey={contentKey}>{content}</Translate> : content}</ListItemText>
        {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
      </MenuItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {React.Children.map(children, (child: ReactElement) => React.createElement(child.type, { ...child.props, sx: { pl: 4 } }))}
        </List>
      </Collapse>
    </>
  );
};

export default NavMenuItemCollapse;
