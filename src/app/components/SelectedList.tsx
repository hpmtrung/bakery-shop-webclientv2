import { ListItemButtonProps, listItemClasses, ListProps } from '@mui/material';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface SelectedListItemProps extends ListItemButtonProps {
  selectedIndex: number;
  itemIndex: number;
  icon?: JSX.Element;
  content: string;
  contentKey?: string;
}

export const SelectedListItem = ({ selectedIndex, itemIndex, icon, content, contentKey, onClick, ...other }: SelectedListItemProps) => (
  <ListItemButton dense selected={selectedIndex !== -1 && selectedIndex === itemIndex} onClick={onClick} {...other}>
    {icon && <ListItemIcon>{icon}</ListItemIcon>}
    <ListItemText primary={content} />
  </ListItemButton>
);

export interface SelectedListProps extends ListProps {
  items: { icon?: JSX.Element; content: string; contentKey?: string; to: string }[];
}

const SelectedList = ({ items }: SelectedListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    const idx = items.findIndex(item => item.to === location.pathname);
    setSelectedIndex(idx);
  }, [items, location.pathname]);

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number, to: string) => {
    setSelectedIndex(index);
    navigate(to);
  };

  return (
    <List component="nav" disablePadding>
      {items.map((itemProps, itemIndex) => (
        <SelectedListItem
          key={itemIndex}
          selectedIndex={selectedIndex}
          itemIndex={itemIndex}
          onClick={e => handleListItemClick(e, itemIndex, itemProps.to)}
          {...itemProps}
        />
      ))}
    </List>
  );
};

export default SelectedList;
