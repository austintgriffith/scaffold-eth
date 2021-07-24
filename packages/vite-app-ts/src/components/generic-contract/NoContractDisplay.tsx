import React from 'react';

export const NoContractDisplay = (
  <div>
    Loading...{' '}
    <div style={{ padding: 32 }}>
      You need to run{' '}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run chain
      </span>{' '}
      and{' '}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run deploy
      </span>{' '}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: 'bolder' }}>
        yarn run deploy
      </span>{' '}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);
