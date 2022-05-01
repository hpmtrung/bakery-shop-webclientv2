import ErrorBoundary from 'src/app/components/error-boundary/ErrorBoundary';
import React from 'react';

export const ErrorBoundaryWrapper = ({ ele }) => <ErrorBoundary>{ele}</ErrorBoundary>;

export default ErrorBoundaryWrapper;
