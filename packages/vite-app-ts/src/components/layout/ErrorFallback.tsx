import React, { FC } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const componentMessages = (error: Error): { msg: string; showDetails: boolean; msgDetails: string } => {
  const msg = 'Uhoh! There was an error!';
  const showDetails = true; // dev flag needed //todo

  let msgDetails = error?.stack?.slice(0, 400) ?? '';
  msgDetails += '\n\r...\n\r';
  if ((error?.stack?.length ?? 0) > 600) {
    msgDetails += error?.stack?.slice(error?.stack?.length - 600, error?.stack?.length);
  }

  return { msg, showDetails, msgDetails };
};

const consoleLog = (error: any, componentStack: string | undefined): void => {
  console.log('--------------------');
  console.log('ErrorBoundary');
  console.log(error.stack);
  console.log(componentStack);
  console.log('--------------------');
};

export const ErrorFallback: FC<FallbackProps> = ({ error }) => {
  // TODO in future, change this so that it takes dev or production into account when rendering
  // https://github.com/bvaughn/react-error-boundary

  const { msg, showDetails, msgDetails } = componentMessages(error);
  consoleLog(error, error?.stack);

  return (
    <>
      {!showDetails && <div>{msg}</div>}
      {showDetails && (
        <>
          <div>{msg} </div>
          <div>
            <pre css={{ fontFamily: 'inherit' }}>{msgDetails}</pre>
          </div>
        </>
      )}
    </>
  );
};
export { ErrorBoundary };
