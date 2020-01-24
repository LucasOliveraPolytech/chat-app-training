import cryptoJS from 'crypto-js'
import crypto from 'crypto'

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

  User.prototype.passwordMatches = function (value) {
    return User.encryptPassword(value) === this.password
  }

  User.hashPasswordHook = async function (user) {
    if (!user.password || !user.changed('password')) return user

    user.salt = this.getRandomSalt()
    const hashedPassword = await User.encryptPassword(user.password, user.salt)
    user.password = hashedPassword
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
