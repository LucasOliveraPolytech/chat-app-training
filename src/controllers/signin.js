import * as models from '../models'

export const signin = async (parent, { userData }) => {
  const user = await models.user.login(userData)
  const jwt = await user.generateNewJWT()

  return { user, jwt }
}
