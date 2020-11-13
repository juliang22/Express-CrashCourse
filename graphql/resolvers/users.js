const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const { SECRET_KEY } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')

// Need to return data in form of a token to the user, jwt.sign() takes data to put inside token, SECRET_KEY encodes our token so that only our server will be able to decode it 
//Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.
function generateToken(user) {
	return jwt.sign({
		id: user.id,
		email: user.email,
		username: user.username
	}, SECRET_KEY, { expiresIn: '2h' })
}

module.exports = {
	Mutation: {
		//dont need the parent arg so we can just put _ by convention to not take up space, info is 4th arg—just metadata
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password) //passes username, pass to validation
			if (!valid) throw new UserInputError('Errors', { errors }) //username of password is empty

			const user = await User.findOne({ username })
			if (!user) {
				errors.general = "User not found"
				throw new UserInputError('User not found', { errors })
			}

			const match = await bcrypt.compare(password, user.password) //comparing passwords
			if (!match) {
				errors.general = "Wrong Credentials"
				throw new UserInputError('User not found', { errors })
			}

			//Passed all checks
			const token = generateToken(user)
			return {
				...user._doc, //mongoose returns everything in the _doc property it seems, add _ to access returned mongoose data, {...user} has wayyyy more info than we need, _doc jsut retuns the properties we set
				id: user._id, //user.id is just a string, this returns the id as an object
				token
			}
		},
		//destructuring args which is RegisterInput from the typeDefs file
		async register(_, { registerInput: { username, email, password, confirmPassword } }) {
			//! Validate user data
			const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
			if (!valid) throw new UserInputError('Errors', { errors })

			//! Make sure user doesnt already exist
			const user = await User.findOne({ username })
			if (user) throw new UserInputError('Username is taken', {
				errors: { username: `The username ${username} is taken` }
			})

			//! Hash password and create an auth token
			password = await bcrypt.hash(password, 12) //hashing password with bcrypt module, asynchronous, so we have to wait for newUser to come back
			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString()
			})
			const res = await newUser.save()
			const token = generateToken(res);
			return {
				...res._doc, //mongoose returns everything in the _doc property it seems, add _ to access returned mongoose data
				id: res._id,
				token
			}
		}
	}
}

/* Mutation for register looks like:
mutation {
  register(registerInput: {username: "julian", password: "123", confirmPassword: "123", email: "user@email.com"}) {
	id
	email
	token
	username
	createdAt
  }
}

Mutation for login:

mutation {
  login(username: "j", password: "g") {
	id
	username
	token
  }
}
*/