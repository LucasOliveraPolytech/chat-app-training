import { createUser } from './user'

export const signup = async (parent, signupData) => {
  const user = await createUser(parent, signupData)
  const jwt = await user.generateNewJWT()

  return { user, jwt }
}
