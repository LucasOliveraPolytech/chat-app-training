import * as models from '../models'

export const getUsers = (parent) => {
  return models.user.findAll()
}

export const getUserById = (parent,userData) => {
  return models.user.findByPk(userData.id)
}

export const createUser = (parent,userData) => {
  return models.user.create(userData)
}
