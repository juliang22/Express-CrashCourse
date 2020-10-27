const { ApolloServer } = require('apollo-server') //Apollo is a GraphQL client (others include Relay which apparently is has more of a learning curve)
const gql = require('graphql-tag') // GQL is a query language, doesnt care what database youre using, shapes the data according to type definitions (defined by you) and sends/receives data to web clients. 3 actions: queries for reading data, mutations for writing data, and subscriptions for listening to data changes in real time with websockets

// ORM (Object Relational Mapper) - lets us interface with the mongodb database
const mongoose = require('mongoose');
const Post = require('./models/Post')
//const User = require('models/User')

// connecting with a connection string (MONGODB) which is copied from the mongodb website (change the string to include password/database name)
const { MONGODB } = require('./config.js')

//Schema - model of the data that can be fetched through the GraphQL server. It defines what queries clients are allowed to make, what types of data can be fetched from the server, and what the relationships between these types are. 
const typeDefs = gql`
	type Post {
		id: ID! 
		body: String!
		createdAt: String!
		username: String!
	}
	type Query{
		getPosts: [Post]
	}
`
// Resolve functions are like little routers. They specify how the types and fields in the schema are connected to various backends, answering the questions “How do I get the data for Authors?” and “Which backend do I need to call with what arguments to get the data for Posts?”.
//use async await in case the query fails, dont want it to stop ther server
const resolvers = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find(); //Post is our model, find() fetches all of them 
				return posts
			} catch (err) {
				throw new Error(err)
			}
		}
	}
}

const server = new ApolloServer({
	typeDefs,
	resolvers
})

// COnnecting to our mongodb database
mongoose
	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('mongodb connected')
		return server.listen({ port: 5000 })
	})
	.then(res => console.log(`Server running at ${res.url}`))
	.catch(error => console.error(`Trouble connecting to MongoDB: ${error}`))