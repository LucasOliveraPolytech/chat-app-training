import path from 'path'
import fs from 'fs'
import { merge } from 'lodash'

let resolvers = {}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    resolvers = merge(resolvers, require(path.join(__dirname, file)).default)
  })
console.log(resolvers)
module.exports = resolvers
