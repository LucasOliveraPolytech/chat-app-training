import * as models from '../models'

const login = async ({ username, password }) => {
  const user = await models.user.findOne({ where: { username } })
  if (!user || !user.passwordMatches(password)) throw new Error('Invalid username or password')

  return user
}

export const signin = async (parent, { userData }) => {
  const user = await login(userData)
  const jwt = await user.generateNewJWT()

  return { user, jwt }
}
