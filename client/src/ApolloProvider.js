// Set Apollo Client Provider - provides apolla client to application so we can connect to grpahql server
import React from 'react'
import App from './App'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
import { createHttpLink } from "apollo-link-http";

const httplink = createHttpLink({ uri: "http://localhost:5000" });

const client = new ApolloClient({
	link: httplink,
	cache: new InMemoryCache()
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
)