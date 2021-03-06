import mongoose, { Schema } from 'mongoose'
import validator from 'validator'
import { hashSync, compareSync } from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'

import { passwordReg } from './user.validations'
import constants from '../../config/constants'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      trim: true,
      validate: {
        validator(email) {
          return validator.isEmail(email)
        },
        message: '{VALUE} is not a valid email!',
      },
    },
    firstName: {
      type: String,
      required: [true, 'FirstName is required!'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'LastName is required!'],
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'UserName is required!'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
      minlength: [6, 'Password need to be longer!'],
      validate: {
        validator(password) {
          return passwordReg.test(password)
        },
        message: '{VALUE} is not a valid password!',
      },
    },
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password)
  }

  return next()
})

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password)
  },
  authenticateUser(password) {
    return compareSync(password, this.password)
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      constants.JWT_SECRET,
      {
        // DAYS * 24hrs * 60 Min * 60 Sec
        expiresIn: constants.TOKEN_VALIDITY * 24 * 60 * 60,
      }
    )
  },
  toAuthJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `${this.createToken()}`,
    }
  },
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
    }
  },
}

export default mongoose.model('User', UserSchema)
