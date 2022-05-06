import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import {TOKEN_STAND_ETH, TOKEN_STAND_BSC, TOKEN_STAND_API} from '../constants';

export const client = (chainId?): ApolloClient<any> => {
  const URI = TOKEN_STAND_API[chainId];
  
  return new ApolloClient({
    link: new HttpLink({
        uri: `${URI}`,
    }),
    cache: new InMemoryCache(),
  })
}

// export const client = new ApolloClient({
//   link: new HttpLink({
//       uri: `${TOKEN_STAND_ETH}/subgraphs/name/subgraph2`,
//   }),
//   cache: new InMemoryCache(),
// })

export const clientBSC = new ApolloClient({
  link: new HttpLink({
      uri: `${TOKEN_STAND_BSC}`,
  }),
  cache: new InMemoryCache(),
});

export const clientBlockBSC = new ApolloClient({
  link: new HttpLink({
      uri: `http://tokenstand.bsc-subgraph.sotatek.works/subgraphs/name/bsc-blocks`,
  }),
  cache: new InMemoryCache(),
});