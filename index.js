const { ApolloServer, PubSub } = require('apollo-server') //Apollo is a GraphQL client - binds front-end to graphql queries
// ORM (Object Relational Mapper) - lets us interface with the mongodb database, PubSub is a subscription
const mongoose = require('mongoose');
const resolvers = require('./graphql/resolvers') //automatically goes to index

// connecting with a connection string (MONGODB) which is copied from the mongodb website (change the string to include psswrd/database name)
const { MONGODB } = require('./config.js')
const typeDefs = require('./graphql/typeDefs')
const cors = require('cors');

const pubsub = new PubSub() //Pattern for subscriptions

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: corsOptions,
	context: ({ req }) => ({ req, pubsub }) // get anything thats passed to context, get req/res from express, we just forward the request which takes the req.body and forwards it to the context so we can access it in context, allows us to authenticate users
})

// Connecting to our mongodb database
mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('mongodb connected')
		return server.listen({ port: 5000 })
	})
	.then(res => console.log(`Server running at ${res.url}`))
	.catch(error => console.error(`Trouble connecting to MongoDB: ${error}`))