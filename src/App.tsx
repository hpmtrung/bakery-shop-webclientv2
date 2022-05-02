import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "src/routes";
import ErrorBoundary from "./app/components/error-boundary/ErrorBoundary";
import { AUTHORITIES } from "./app/config/constants";
import "./app/config/dayjs.ts";
import { useAppDispatch, useAppSelector } from "./app/config/store";
import Footer from "./app/layout/Footer";
import Header from "./app/layout/header/Header";
import { getAppProfile } from "./app/modules/app-profile/application-profile";
import { getSession } from "./app/modules/auth/authentication.reducer";
import { hasAnyAuthority } from "./app/shared/private-route/PrivateRoute";

// const baseHref = document!.querySelector("base")!.getAttribute("href")!.replace(/\/$/, "");

export const App = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getSession());
		dispatch(getAppProfile());
	}, [dispatch]);

	const currentLocale = useAppSelector((state) => state.locale.currentLocale);
	const isAuthenticated = useAppSelector(
		(state) => state.authentication.isAuthenticated
	);
	const isAdmin = useAppSelector((state) =>
		hasAnyAuthority(state.authentication.account.authorities, [
			AUTHORITIES.ADMIN,
		])
	);

	return (
		// <BrowserRouter basename={baseHref}>
		<BrowserRouter>
			<ErrorBoundary>
				<Header
					isAuthenticated={isAuthenticated}
					isAdmin={isAdmin}
					currentLocale={currentLocale}
				/>
			</ErrorBoundary>
			<ErrorBoundary>
				<AppRoutes />
			</ErrorBoundary>
			<Footer />
		</BrowserRouter>
	);
};

export default App;
