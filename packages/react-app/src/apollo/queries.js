import { gql } from 'apollo-boost';

export const ARTISTS_QUERY = gql`
  query artists($address: Bytes!) {
    artists(where: { address: $address }) {
      id
      inkCount
      address
      earnings
      inks(first: 999, orderBy: createdAt, orderDirection: desc, where: { burned: false }) {
        id
        jsonUrl
        limit
        count
        bestPrice
        createdAt
        sales {
          id
          price
        }
      }
    }
  }
`;

export const TOP_ARTISTS_QUERY = gql`
  query artists($first: Int, $skip: Int, $orderBy: String, $orderDirection: String, $createdAt: Int, $filters: Artist_filter) {
    artists(first: $first, skip: $skip where: $filters, orderBy: $orderBy, orderDirection: $orderDirection, createdAt: $createdAt) {
      inkCount
      earnings
      address
      likeCount
      likes (where: {createdAt_gt: $createdAt}){
        createdAt
      }
      inks (where: {createdAt_gt: $createdAt}){
        createdAt
      }
      sales (where: {createdAt_gt: $createdAt}){
        createdAt
        price
      }
    }
  }
`;

export const TOP_COLLECTORS_QUERY = gql`
  query users($first: Int, $orderBy: String, $orderDirection: String, $createdAt: Int, $filters: User_filter) {
    users(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, createdAt: $createdAt) {
    	tokenCount
      saleCount
      purchaseCount
      address
      tokens (where : {lastTransferAt_gt: $createdAt}){
        lastTransferAt
      }
      sales (where : {createdAt_gt: $createdAt}) {
        createdAt
      }
      purchases (where : {createdAt_gt: $createdAt}) {
        createdAt
      }
    }
  }
`;

export const INKS_QUERY = gql`
  query inks($first: Int, $skip: Int) {
    inks(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc, where: { burned: false }) {
      id
      inkNumber
      createdAt
      jsonUrl
      artist {
        id
        address
      }
    }
  }
`;

export const EXPLORE_QUERY = gql`
  query inks($first: Int, $skip: Int, $orderBy: String, $orderDirection: String, $filters: Ink_filter, $liker: String) {
    inks(first: $first, skip: $skip where: $filters, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      inkNumber
      createdAt
      jsonUrl
      bestPrice
      bestPriceSource
      bestPriceSetAt
      count
      limit
      likeCount
      likes(where: {liker: $liker}) {
        id
      }
      artist {
        id
        address
      }
    }
  }
`;

export const INK_LIKES_QUERY = gql`
query likes($inks: [BigInt], $liker: String) {
  inks(first: 1000, where: {inkNumber_in: $inks}) {
    id
    inkNumber
    likeCount
    likes(where: {liker: $liker}) {
      id
    }
  }
}`

export const HOLDINGS_QUERY = gql`
  query tokens($owner: Bytes!) {
    metaData(id: "blockNumber") {
      id
      value
    }
    tokens(first: 999, where: { owner: $owner }, orderBy: createdAt, orderDirection: desc) {
      owner { id }
      id
      price
      ink {
        id
        jsonUrl
        limit
        count
        artist {
          id
          address
        }
      }
    }
  }
`;

export const INK_QUERY = gql`
query ink($inkUrl: String!, $liker: String) {
  metaData(id: "blockNumber") {
    id
    value
  }
  ink(id: $inkUrl) {
    id
    burned
    inkNumber
    jsonUrl
    artist {
      id
    }
    limit
    count
    createdAt
    mintPrice
    mintPriceNonce
    likeCount
    likes(where: {liker: $liker}) {
      id
    }
    tokens(first: 999, orderBy: createdAt, orderDirection: asc) {
      id
      owner { id }
      network
      price
    }
    tokenTransfers(orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
      token { id edition }
      from { id }
      to { id }
      sale { id price }
      transactionHash
    }
  }
}
`;

export const INK_MAIN_QUERY = gql`
query token($inkUrl: String!) {
  tokens(first: 999, where: {ink: $inkUrl}) {
    id
    owner
    ink
  }
}`

export const HOLDINGS_MAIN_QUERY = gql`
  query tokens($owner: Bytes!) {
    tokens(first: 999, where: { owner: $owner }, orderBy: createdAt, orderDirection: desc) {
      id
    	owner
     	network
      createdAt
      ink
      jsonUrl
    }
  }
`;

export const HOLDINGS_MAIN_INKS_QUERY = gql`
  query inks($inkList: [String!]) {
    inks(first: 999, where: {id_in: $inkList}) {
      id
      jsonUrl
      limit
      count
      artist {
        id
        address
      }
    }
  }
`;
