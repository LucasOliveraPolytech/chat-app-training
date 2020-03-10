import * as userController from '../../controllers/user.js'

export default {
  Query: {
    users: userController.getUsers,
    user: userController.getUserById,
    currentUser: userController.getCurrentUser
  },

  Mutation: {
    createUser: userController.createUser
  }
}
