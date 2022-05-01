/* eslint-disable no-console */
import { toast } from 'react-toastify';
import { isAnyFulfilledAction, isAnyRejectedAction } from 'src/app/shared/reducers/reducer.utils';
import { translate } from 'src/app/shared/language/Translate';

// const addErrorAlert = (message, key?, data?) => {
//   key = key ? key : message;
//   toast.error(translate(key, data));
// };

export default () => next => action => {
  const { error, payload } = action;

  if (isAnyRejectedAction(action) && error && error.isAxiosError) {
    if (error.response) {
      const response = error.response;
      const data = response.data;
      if (
        response.status !== 401 ||
        (error.message !== '' && !(data && data.path && (data.path.includes('/api/account') || data.path.includes('/api/authenticate'))))
      ) {
        switch (response.status) {
          // connection refused, server not reachable
          case 0:
            error.message = 'Server not reachable';
            break;

          case 400: {
            let errorHeader: string | null = null;
            let entityKey: string | null = null;
            response?.headers &&
              Object.entries<string>(response.headers).forEach(([k, v]) => {
                if (k.toLowerCase().endsWith('app-error')) {
                  errorHeader = v;
                } else if (k.toLowerCase().endsWith('app-params')) {
                  entityKey = v;
                }
              });
            if (errorHeader) {
              // const entityName = translate('global.menu.entities.' + entityKey);
              // addErrorAlert(errorHeader, errorHeader, { entityName });
              error.message = `${entityKey}.${errorHeader}`;
            } else if (data?.fieldErrors) {
              const fieldErrors = data.fieldErrors;
              for (const fieldError of fieldErrors) {
                if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                  fieldError.message = 'Size';
                }
                // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                // const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                // const fieldName = translate(`backeryshopwebclientApp.${fieldError.objectName}.${convertedField}`);
                // addErrorAlert(`Error on field "${fieldName}"`, `error.${fieldError.message}`, { fieldName });
                error.message = `error.${fieldError.message}`;
              }
            } else if (typeof data === 'string' && data !== '') {
              // addErrorAlert(data);
              error.message = data;
            } else {
              // toast.error(data?.message || data?.error || data?.title || 'Unknown error!');
              console.log(data?.message || data?.error || data?.title || 'Unknown error!'); // eslint-disable-line no-console
            }
            break;
          }
          case 404:
            // addErrorAlert('Not found', 'error.url.not.found');
            error.message = 'error.url.not.found';
            break;

          default:
            if (typeof data === 'string' && data !== '') {
              // addErrorAlert(data);
              error.message = data;
            } else {
              // toast.error(data?.message || data?.error || data?.title || 'Unknown error!');
              console.log(data?.message || data?.error || data?.title || 'Unknown error!'); // eslint-disable-line no-console
            }
        }
      }
    } else if (error.config && error.config.url === 'api/account' && error.config.method === 'get') {
      console.log('Authentication Error: Trying to access url api/account with GET.');
    } else {
      // toast.error(error.message || 'Unknown error!');
      console.log(error.message || 'Unknown error!');
    }
  } else if (error) {
    // toast.error(error.message || 'Unknown error!');
    console.log(error.message || 'Unknown error!');
  }

  return next(action);
};
