import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import * as models from './models'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import schema from './schema'

require('dotenv').config()

const port = process.env.PORT || 3001

const app = express()

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET
}, async (jwtPayload, done) => {
  const user = await models.user.findByPk(jwtPayload.sub)
  done(null, user)
}))

passport.initialize()

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

app.use((req, res, next) => {
  const passportMiddleware = passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      next(err)
    } else {
      req.user = user || null
      next()
    }
  })

  passportMiddleware(req, res, next)
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
