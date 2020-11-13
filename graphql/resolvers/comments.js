const { AuthentificationError, UserInputError } = require('apollo-server')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => { // Can use arrow function syntax if we want to
			const { username } = checkAuth(context) //Only needed to the username so we just destructured that after authenticating
			if (body.trim() === '') {
				throw new UserInputError('Empty Comment', {
					errors: { body: 'Comment body must not be empty' }
				})
			}
			const post = await Post.findById(postId)
			if (post) {
				post.comments.unshift({ //mongoose turns our data model into js objects so we can access it as an array
					body,
					username,
					createdAt: new Date().toISOString()
				})
				await post.save()
				return post
			} else throw new UserInputError('Post not found')
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context)
			const post = await Post.findById(postId)
			if (post) {
				const commentIndex = post.comments.findIndex(comment => comment.id === commentId)
				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1) //start at commentIndex and remove 1
					await post.save();
					return post
				} else {
					throw new AuthentificationError('Action not allowed, must be the user who wrote the comment to delete it')
				}
			} else throw new UserInputError('Post not found')
		},
		async likePost(_, { postId }, context) {
			const { username } = checkAuth(context)

			const post = await Post.findById(postId)
			if (post) {
				// Toggle likes
				if (post.likes.find(like => like.username === username)) {
					// Post already liked, now unlike it
					post.likes = post.likes.filter(like => like.username !== username) //remove likes from our user 
				} else {
					//Post is not liked yet
					post.likes.push({ username, createdAt: new Date().toISOString() })
				}
				await post.save()
				return post
			} else {
				throw new UserInputError('Post not found')
			}
		}
	}
}

/*
For creating a comments:
mutation {
  createComment(postId: "5f9210a54fb26305c049bf3e", body: "New comment on post" ) {
	id
	body
	comments {
	  body
	  id
	  createdAt
	  username
	}
  }
}

Deleting a comment:
mutation {
  deleteComment(postId: "5f9210a54fb26305c049bf3e", commentId: "5fa345fd6d8c893e2541be14") {
	id
	body
	comments {
	  id
	  createdAt
	  body
	  username
	}
  }
}
*/