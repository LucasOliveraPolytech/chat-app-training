import { createUser } from './user'

export const signup = async (parent, signupData) => {
  const authResult = {
    user: null,
    jwt: null,
    authError: null
  }

  try {
    authResult.user = await createUser(parent, signupData)
    authResult.jwt = await authResult.user.generateNewJWT()
  } catch (authError) {
    authResult.authError = authError
  }

  return authResult
}
