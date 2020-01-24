import * as userController from '../../controllers/user.js'

export default {
  Query: {
    users: userController.getUsers,
    user: userController.getUserById
  },

  Mutation: {
    createUser: userController.createUser
  },
}
