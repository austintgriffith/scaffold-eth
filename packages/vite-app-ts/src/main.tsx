/* eslint-disable */

import React from 'react';

const run = async (): Promise<void> => {
  // dynamic imports for code splitting
  const { lazy, Suspense } = await import('react');
  const ReactDOM = await import('react-dom');
  await import('~~/helpers/types/__global');
  const App = lazy(() => import('./components/layout/App'));

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<div />}>
        <App />
      </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

void run();
