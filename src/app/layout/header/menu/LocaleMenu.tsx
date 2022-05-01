import { Divider, MenuItem } from '@mui/material';
import { useAppSelector } from 'src/app/config/store';
import { languages, locales } from 'src/app/config/translation';
import React from 'react';
import NavMenu from '../../../components/menu/NavMenu';
import NavMenuItem from '../../../components/menu/NavMenuItem';

export type LocaleMenuProps = {
  currentLocale: string;
  onClick: (event: any) => void;
  [key: string]: any;
};

export const LocaleMenu = ({ currentLocale, onClick, ...rest }: LocaleMenuProps) => {
  const dividerColor = useAppSelector(state => state.header.btnIconColor);

  return Object.keys(languages).length > 1 ? (
    <>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, backgroundColor: dividerColor }} />

      <NavMenu name={currentLocale ? languages[currentLocale].name : undefined} {...rest}>
        {locales.map(locale => (
          <NavMenuItem key={locale} value={locale} onClick={onClick} disableRipple content={languages[locale].name} />
        ))}
      </NavMenu>
    </>
  ) : null;
};
