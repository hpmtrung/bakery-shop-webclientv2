// prettier-ignore-start
import { createTheme, CssBaseline, Fade, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { bindActionCreators } from "redux";
import AppComponent from "./App";
import setupAxiosInterceptors from "src/app/config/axios-interceptor";
import getStore from "src/app/config/store";
import { registerLocale } from "src/app/config/translation";
import ErrorBoundary from "src/app/components/error-boundary/ErrorBoundary";
import { clearAuthentication } from "src/app/modules/auth/authentication.reducer";
import { NotificationProvider } from "src/app/components/notification";
import { SnackbarProvider } from "notistack";

// Font
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// Carousel theme
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { registerCart } from "src/app/config/cart";
import reportWebVitals from "./reportWebVitals";
// prettier-ignore-end

const store = getStore();
// Register default locale
registerLocale(store);
// Register cart data
registerCart(store);

// Set axios interceptor for clearing expired authentication when fetching session is false
const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() =>
	actions.clearAuthentication("login.error.unauthorized")
);

const rootEl = document.getElementById("root");

// MUI theme
const theme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "#F5F5FA",
			paper: "#fff",
		},
		primary: {
			main: "#ca6702",
		},
		secondary: {
			main: "#FDF0E6",
		},
		warning: {
			main: "#e9c46a",
		},
		info: {
			main: "#3a86ff",
		},
		error: {
			main: "#e63946",
		},
		success: {
			main: "#00b4d8",
		},
	},
});

const render = (Component) =>
	// eslint-disable-next-line react/no-render-return-value
	ReactDOM.render(
		<ErrorBoundary>
			<ThemeProvider theme={theme}>
				<Provider store={store}>
					<NotificationProvider>
						<SnackbarProvider
							maxSnack={1}
							anchorOrigin={{
								vertical: "top",
								horizontal: "center",
							}}
							preventDuplicate
							autoHideDuration={6000}>
							<CssBaseline />
							<Component />
						</SnackbarProvider>
					</NotificationProvider>
				</Provider>
			</ThemeProvider>
		</ErrorBoundary>,
		rootEl
	);

render(AppComponent);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
