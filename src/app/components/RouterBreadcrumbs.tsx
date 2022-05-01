import { Breadcrumbs, Link, LinkProps, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => <Link component={RouterLink} {...props} />;

export type BreadcrumbNameMapType = { [key: string]: string };

export interface RouterBreadcrumbsProps {
  breadcrumbNameMap: BreadcrumbNameMapType;
}

const RouterBreadcrumbs = ({ breadcrumbNameMap }: RouterBreadcrumbsProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  return (
    <Breadcrumbs>
      <LinkRouter underline="hover" to="/">
        <Typography variant="body2" color="primary">
          Trang chủ
        </Typography>
      </LinkRouter>
      {pathnames.map((_, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        if (!breadcrumbNameMap[to]) return;
        return last ? (
          <Typography variant="body2" color="text.primary" key={to}>
            {breadcrumbNameMap[to]}
          </Typography>
        ) : (
          <LinkRouter underline="hover" to={to} key={to}>
            <Typography variant="body2" color="text.secondary">
              {breadcrumbNameMap[to]}
            </Typography>
          </LinkRouter>
        );
      })}
    </Breadcrumbs>
  );
};

export default RouterBreadcrumbs;
