import { createUser } from './user'

export const signup = (parent, signupData) => {
  const authResult = {
    user: null,
    jwt: null,
    authError: null
  }

  try {
    authResult.user = createUser(signupData)
    authResult.jwt = authResult.user.generateNewJWT()
  } catch (authError) {
    authResult.authError = authError
  }

  return authResult
}
