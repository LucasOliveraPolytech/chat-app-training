import * as models from '../models'

const login = async ({ username, password }) => {
  const user = await models.user.findOne({ where: { username } })
  if (!user || !user.passwordMatches(password)) throw new Error('Invalid username or password')

  return user
}

export const signin = async (parent, { userData }) => {
  const authResult = {
    user: null,
    jwt: null,
    authError: null
  }

  try {
    authResult.user = await login(userData)
    authResult.jwt = await authResult.user.generateNewJWT()
  } catch (authError) {
    authResult.authError = authError
  }

  return authResult
}
