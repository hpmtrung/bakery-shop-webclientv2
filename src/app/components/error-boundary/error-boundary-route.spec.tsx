import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

const ErrorComp = () => {
  throw new Error('test');
};

describe('error-boundary-route element', () => {
  beforeEach(() => {
    // ignore console and jsdom errors
    jest.spyOn((window as any)._virtualConsole, 'emit').mockImplementation(() => false);
    jest.spyOn((window as any).console, 'error').mockImplementation(() => false);
  });

  // All tests will go here
  it('Should throw error when no element is provided', () => {
    expect(() => render(<Route element />)).toThrow(Error);
  });

  it('Should render fallback element when an uncaught error is thrown from element', () => {
    const history = createMemoryHistory();
    const { container } = render(
      // <Router history={history}>
      //   <ErrorBoundaryRoute element={ErrorComp} path="/" />
      // </Router>
      <MemoryRouter>
        <Routes>
          <Route element={<ErrorComp />} path="/" />
        </Routes>
      </MemoryRouter>
    );
    expect(container.innerHTML).toEqual('<div><h2 class="error">An unexpected error has occurred.</h2></div>');
  });
});
