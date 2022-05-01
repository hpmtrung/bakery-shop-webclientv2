import { ArrowDropDownOutlined } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuProps, Tooltip } from '@mui/material';
import { alpha, styled } from '@mui/system';
import { useAppSelector } from 'src/app/config/store';
import React from 'react';

const StyledNavMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export type NavIconButtonMenuProps = {
  children?: JSX.Element | JSX.Element[];
  icon?: JSX.Element | undefined;
  tooltipText: string;
  [key: string]: any;
};

export type NavTextButtonMenuProps = {
  children?: JSX.Element | JSX.Element[];
  name: string;
  [key: string]: any;
};

export const NavMenuContext = React.createContext<{ handleClose: () => void }>({ handleClose: null });

const NavMenu = ({ children, icon, tooltipText, name, ...rest }: NavIconButtonMenuProps | NavTextButtonMenuProps) => {
  const navMenuIconBtnColor = useAppSelector(state => state.header.btnIconColor);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {icon ? (
        <Tooltip title={tooltipText}>
          <IconButton size="large" onClick={handleClick} sx={{ color: navMenuIconBtnColor }} {...rest}>
            {icon}
          </IconButton>
        </Tooltip>
      ) : (
        <Button size="large" onClick={handleClick} endIcon={<ArrowDropDownOutlined />} disableElevation {...rest}>
          {name}
        </Button>
      )}
      {children && (
        <StyledNavMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <NavMenuContext.Provider value={{ handleClose }}>{children}</NavMenuContext.Provider>
        </StyledNavMenu>
      )}
    </div>
  );
};

export default NavMenu;
