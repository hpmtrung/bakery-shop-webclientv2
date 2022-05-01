/* eslint no-console: off */
export default () => (next) => (action) => {

  console.log("At logger-middle:" + process.env.NODE_ENV); // eslint-disable-line no-console

	if (process.env.NODE_ENV === "production") {
		const { type, payload, meta, error } = action;

		console.groupCollapsed(type);
		console.log("Payload:", payload);
		if (error) {
			console.log("Error:", error);
		}
		console.log("Meta:", meta);
		console.groupEnd();
	}

	return next(action);
};;
