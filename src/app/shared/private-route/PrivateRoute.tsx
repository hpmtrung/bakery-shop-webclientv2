import React from "react";
// import { Route, Redirect, RouteProps } from 'react-router-dom';
import {
	Navigate,
	Outlet, RouteProps,
	useLocation
} from "react-router-dom";
import CircularLoadingIndicator from "src/app/components/CircularLoadingIndicator";
import ErrorBoundary from "src/app/components/error-boundary/ErrorBoundary";
import { useAppSelector } from "src/app/config/store";
import Translate from "../language/Translate";

interface IPrivateRouteProps extends RouteProps {
	hasAnyAuthorities?: string[];
}

export const PrivateRoute = ({
	hasAnyAuthorities = [],
}: IPrivateRouteProps) => {
	const location = useLocation();
	const isAuthenticated = useAppSelector(
		(state) => state.authentication.isAuthenticated
	);
	const sessionHasBeenFetched = useAppSelector(
		(state) => state.authentication.sessionHasBeenFetched
	);
	const account = useAppSelector((state) => state.authentication.account);
	const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities);

	const checkAuthorities = () =>
		isAuthorized ? (
			<ErrorBoundary>
				<Outlet />
			</ErrorBoundary>
		) : (
			<div>
				<Translate contentKey='error.http.403'>
					You are not authorized to access this page.
				</Translate>
			</div>
		);

	if (!sessionHasBeenFetched) {
		return <CircularLoadingIndicator />;
	} else {
		return isAuthenticated ? (
			checkAuthorities()
		) : (
			<Navigate
				to={{
					pathname: "/",
					search: location.search,
				}}
				replace
				state={{ from: location }}
			/>
		);
	}
};

export const hasAnyAuthority = (
	authorities: string[],
	hasAnyAuthorities: string[]
) => {
	if (authorities && authorities.length !== 0) {
		if (hasAnyAuthorities.length === 0) {
			return true;
		}
		return hasAnyAuthorities.some((auth) => authorities.includes(auth));
	}
	return false;
};

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export default PrivateRoute;
