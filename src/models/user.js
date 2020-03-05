import cryptoJS from 'crypto-js'
import crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  User.prototype.generateNewJWT = function () {
    const shortenedUser = {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName
    }

    return jwt.sign({ sub: this.id, user: shortenedUser },
      process.env.TOKEN_SECRET, {
        expiresIn: '10d'
      }
    )
  }

  User.prototype.passwordMatches = function (value) {
    return User.encryptPassword(value, this.salt) === this.password
  }

  User.hashPasswordHook = async function (user) {
    if (!user.password || !user.changed('password')) return user

    user.salt = this.getRandomSalt()
    user.password = await User.encryptPassword(user.password, user.salt)
  }

  User.getRandomSalt = function (bytes = 16) {
    return crypto.randomBytes(bytes).toString('hex')
  }

  User.encryptPassword = function (plainPassword, salt) {
    return cryptoJS.MD5(plainPassword + salt).toString()
  }

  User.beforeValidate(User.hashPasswordHook.bind(User))
  User.beforeUpdate(User.hashPasswordHook.bind(User))

  return User
}
