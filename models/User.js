// Specifying a schema. MongoDB is schemaless, but with mongoose, you can specify a schema to have more safetly when working with server code. A Mongoose ‘schema’ is a document data structure (or shape of the document) that is enforced via the application layer.
//‘Models’ are higher-order constructors that take a schema and create an instance of a document equivalent to records in a relational database.
const { model, Schema } = require('mongoose')

//Can specify that the return values are required by adding '!' to the end, but we are going to handle that in the Graphql layer
const userSchema = new Schema({
	username: String,
	passowrd: String,
	email: String,
	createdAt: String
})

// exporting our model with model(<Model Name>, <Schema>)
module.exports = model('User', userSchema)