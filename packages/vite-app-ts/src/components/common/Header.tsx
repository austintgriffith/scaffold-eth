import { PageHeader } from 'antd';
import React from 'react';

// displays a page header

export const Header = () => {
  return (
    <div>
      <PageHeader
        title="🏰 BuidlGuidl"
        subTitle={
          <span>
            v2.1 - [
            <a href="https://youtu.be/aYMj00JoIug" target="_blank" rel="noreferrer">
              <span style={{ marginRight: 4 }}>🎥 </span> 8min speed run
            </a>
            ] - [
            <a href="https://trello.com/b/ppbUs796/buidlguidlcom-idea-board" target="_blank" rel="noreferrer">
              <span style={{ marginRight: 4 }}>💡 </span> trello
            </a>
            ]{' '}
          </span>
        }
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};
