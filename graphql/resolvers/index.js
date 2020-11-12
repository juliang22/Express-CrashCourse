const postsResolvers = require('./posts')
const usersResolvers = require('./users')
const commentsResolvers = require('./comments')

// Resolve functions are like little routers. They specify how the types and fields in the schema are connected to various backends, answering the questions “How do I get the data for Authors?” and “Which backend do I need to call with what arguments to get the data for Posts?”.
module.exports = {
	Post: { //If we name the type, each time any mutation/query/subscription returns a post it will go through this post modifier and apply modifications
		//this gives post the properties of likeCount/commentCount (prev they were null) by just counting the length of their respective likes and comments
		likeCount: (parent) => parent.likes.length,
		commentCount: (parent) => parent.comments.length
	},
	Query: {
		...postsResolvers.Query
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation
	},
	Subscription: {
		...postsResolvers.Subscription
	}
}