import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { EthersContextProvider } from "./components";
import "./index.css";
import App from "./App";

let subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <EthersContextProvider>
    <ApolloProvider client={client}>
      <App subgraphUri={subgraphUri} />
    </ApolloProvider>
  </EthersContextProvider>,
  document.getElementById("root"),
);
