import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { getUserById } from './controllers/user'

import schema from './schema'

require('dotenv').config()

const port = process.env.PORT || 3001

const app = express()

const server = new ApolloServer({
  ...schema,
  instrospection: true,
  playground: true,
  tracing: true,
  context: ({ req, res }) => {
    const user = getUserFromPassport()

    return { user }
  }
})

const getUserFromPassport = () => {
  var passportOptions = {}
  passportOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken
  passportOptions.secretOrKey = process.env.TOKEN_SECRET

  passport.use(new JwtStrategy(passportOptions, async (jwtPayload, done) => {
    try {
      const user = await getUserById(jwtPayload.sub)
      if (!user) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      done(error, false)
    }
  }))
}

server.applyMiddleware({ app })

const httpServer = createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  console.log(
    `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  )
})
