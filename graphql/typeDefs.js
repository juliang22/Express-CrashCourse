const gql = require('graphql-tag')  // GQL is a query language, doesnt care what database youre using, shapes the data according to type definitions (defined by you) and sends/receives data to web clients. 3 actions: queries for reading data, mutations for writing data, and subscriptions for listening to data changes in real time with websockets

//Schema - model of the data that can be fetched through the GraphQL server. It defines what queries clients are allowed to make, what types of data can be fetched from the server, and what the relationships between these types are. 
// the ! means that the graphql has to return those values, not necessarily that the user has to provide them
module.exports = gql`
	type Post {
		id: ID! 
		body: String!
		createdAt: String!
		username: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}
	type Comment {
		body: String!
		id: ID!
		createdAt: String!
		username: String!
	}
	type Like {
		id: ID!	
		createdAt: String!
		username: String!
	}
	type Query {
		getPosts: [Post]
		getPost(postId: ID!): Post
	}
	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}
	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: ID!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
	}
	type Subscription {
		newPost: Post!
	}
`