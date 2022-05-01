import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const root = document.getElementById("root")!;

const render = (Component) =>
	// eslint-disable-next-line react/no-render-return-value
	ReactDOM.render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
			</Provider>
		</React.StrictMode>,
		root
	);

render(App);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
