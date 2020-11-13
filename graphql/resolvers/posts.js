const { AuthentificationError } = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

//use async await in case the query fails, dont want it to stop ther server
module.exports = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 }); //Post is our model, find() fetches all of them and sorts based on descending order created at
				return posts
			} catch (err) {
				throw new Error(err)
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findById(postId)
				return (post) ? post : (() => { throw new Error('Post not found') })() //IIFE (Immediately invoked function expression so that we can use ternary syntax while throwing error)
				// if (post) return post
				// else throw new Error('Post not found')
			} catch (error) {
				throw new Error(error)
			}
		}
	},
	Mutation: {
		//user logs in and gets an authentification token, need to put this token in a header for the request, we then decode that token and make sure theyre authenticated 
		async createPost(_, { body }, context) {
			const user = checkAuth(context)
			// Server validation to check that the body isn't empty
			if (body.trim() === '') throw new Error('Post body must not be empty')

			const newPost = new Post({
				body,
				username: user.username,
				createdAt: new Date().toISOString(),
				user: user.id
			})
			const post = await newPost.save()
			context.pubsub.publish('NEW_POST', { newPost: post }) // trigger is the same as the subscription, payload is the new post being created, the subscription listens for this and then gets sent the post when its created
			return post
		},
		async deletePost(_, { postId }, context) {
			const user = checkAuth(context) //Checks to see if the user has correct token auth
			try {
				const post = await Post.findById(postId)
				// Need to make sure this user is the creator of the post to be deleted
				if (user.username === post.username) {
					await post.delete(post.username)
					return 'post deleted successfully'
				} else {
					throw new AuthentificationError('Action not allowed: must be owner of post to delete it')
				}
			} catch (error) {
				throw new Error(error)
			}
		}
	},
	Subscription: {
		newPost: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST') //conventionally all caps from received event type, listens on websockets in the background of the client for when this event happens (in createPost())
		}
	}
}

/*
Creating a post (Also have to have "Authorization": "Bearer <token> in HTTP Header"):
mutation {
  createPost(body: "sample post") {
	body
	username
	id
	createdAt
  }
}

getting all posts:
 {
  getPosts {
		body
	id
  }
}

getting a post:
 {
  getPost(postId: "5f9210a54fb26305c049bf3e") {
		body
	id
  }
}
*/