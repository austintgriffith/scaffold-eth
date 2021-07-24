import { gql, useQuery } from '@apollo/client';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Button, Input, Table, Typography } from 'antd';
import 'antd/dist/antd.css';
import { Contract } from 'ethers';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import fetch from 'isomorphic-fetch';
import React, { FC, ReactElement, useState } from 'react';

import { Address } from '~~/components/common';

const highlight: React.CSSProperties = {
  marginLeft: 4,
  marginRight: 8,
  /* backgroundColor: "#f9f9f9", */ padding: 4,
  borderRadius: 4,
  fontWeight: 'bolder',
};

interface ISubgraphProps {
  subgraphUri: string;
  tx: any;
  writeContracts: Record<string, Contract>;
  mainnetProvider: JsonRpcProvider | Web3Provider;
}

export const Subgraph: FC<ISubgraphProps> = (props) => {
  const graphQLFetcher = async (graphQLParams: any): Promise<Record<string, any>> => {
    const response = await fetch(props.subgraphUri, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    });
    return response.json() as Record<string, any>;
  };

  const EXAMPLE_GRAPHQL = `
    {
      purposes(first: 25, orderBy: createdAt, orderDirection: desc) {
        id
        purpose
        createdAt
        sender {
          id
        }
      }
      senders {
        id
        address
        purposeCount
      }
    }
    `;
  const EXAMPLE_GQL = gql(EXAMPLE_GRAPHQL);
  const { loading, data } = useQuery(EXAMPLE_GQL, { pollInterval: 2500 });

  const purposeColumns = [
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Sender',
      key: 'id',
      render: (record: any): ReactElement => (
        <Address address={record.sender.id} ensProvider={props.mainnetProvider} fontSize={16} />
      ),
    },
    {
      title: 'createdAt',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (d: number): string => new Date(d * 1000).toISOString(),
    },
  ];

  const [newPurpose, setNewPurpose] = useState('loading...');

  const deployWarning = (
    <div style={{ marginTop: 8, padding: 8 }}>Warning: 🤔 Have you deployed your subgraph yet?</div>
  );

  return (
    <>
      <div style={{ margin: 'auto', marginTop: 32 }}>
        You will find that parsing/tracking events with the{' '}
        <span className="highlight" style={highlight}>
          useEventListener
        </span>{' '}
        hook becomes a chore for every new project.
      </div>
      <div style={{ margin: 'auto', marginTop: 32 }}>
        Instead, you can use{' '}
        <a href="https://thegraph.com/docs/introduction" target="_blank" rel="noopener noreferrer">
          The Graph
        </a>{' '}
        with 🏗 scaffold-eth (
        <a href="https://youtu.be/T5ylzOTkn-Q" target="_blank" rel="noopener noreferrer">
          learn more
        </a>
        ):
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚮</span>
        Clean up previous data:
        <span className="highlight" style={highlight}>
          rm -rf docker/graph-node/data/
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        Spin up a local graph node by running
        <span className="highlight" style={highlight}>
          yarn graph-run-node
        </span>
        <span style={{ marginLeft: 4 }}>
          {' '}
          (requires{' '}
          <a href="https://www.docker.com/products/docker-desktop" target="_blank" rel="noopener noreferrer">
            {' '}
            Docker
          </a>
          ){' '}
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        Create your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-create-local
        </span>
        (only required once!)
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        Deploy your <b>local subgraph</b> by running
        <span className="highlight" style={highlight}>
          yarn graph-ship-local
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🖍️</span>
        Edit your <b>local subgraph</b> in
        <span className="highlight" style={highlight}>
          packages/subgraph/src
        </span>
        (learn more about subgraph definition{' '}
        <a href="https://thegraph.com/docs/define-a-subgraph" target="_blank" rel="noopener noreferrer">
          here
        </a>
        )
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤩</span>
        Deploy your <b>contracts and your subgraph</b> in one go by running
        <span className="highlight" style={highlight}>
          yarn deploy-and-graph
        </span>
      </div>

      <div style={{ width: 780, margin: 'auto', paddingBottom: 64 }}>
        <div style={{ margin: 32, textAlign: 'right' }}>
          <Input
            onChange={(e): void => {
              setNewPurpose(e.target.value);
            }}
          />
          <Button
            onClick={(): void => {
              console.log('newPurpose', newPurpose);
              /* look how you call setPurpose on your contract: */
              props.tx(props.writeContracts.YourContract.setPurpose(newPurpose));
            }}>
            Set Purpose
          </Button>
        </div>

        {data?.purposes ? (
          <Table dataSource={data.purposes} columns={purposeColumns} rowKey="id" />
        ) : (
          <Typography>{loading ? 'Loading...' : deployWarning}</Typography>
        )}

        <div style={{ margin: 32, height: 400, border: '1px solid #888888', textAlign: 'left' }}>
          <GraphiQL fetcher={graphQLFetcher} docExplorerOpen query={EXAMPLE_GRAPHQL} />
        </div>
      </div>

      <div style={{ padding: 64 }}>...</div>
    </>
  );
};

export default Subgraph;
