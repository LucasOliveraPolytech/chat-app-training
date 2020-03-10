import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import * as models from './models'
import passport from 'passport'
import { getUserById } from './controllers/user'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import schema from './schema'

require('dotenv').config()

const port = process.env.PORT || 3001

const app = express()

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET
}, async (jwtPayload, req) => {
  const user = await getUserById(jwtPayload.sub)

  req.user = user
}))

app.use(passport.initialize())

const server = new ApolloServer({
  ...schema,
  instrospection: true,
  playground: true,
  tracing: true,
  context: ({ req }) => {
    return {
      user: req.user,
      models
    }
  }
})

server.applyMiddleware({ app })

const httpServer = createServer(app)

server.installSubscriptionHandlers(httpServer)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  console.log(
    `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  )
})
