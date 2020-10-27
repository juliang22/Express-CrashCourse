const { model, Schema } = require('mongoose')

// The 'user' bit at the end - type referes to another schema object, ref is passed the table/collections of useres => this allows us to later use mongoose to automatically populate the user field using some mongoose methods
const postSchema = new Schema({
	body: String,
	username: String,
	createdAt: String,
	comments: [{
		body: String,
		username: String,
		createdAt: String
	}],
	likes: [{
		username: String,
		createdAt: String,
	}],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
})

module.exports = model('Post', postSchema)