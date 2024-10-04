import { IUserDocument } from '@/types'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: false,
    default: null,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
})

schema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

// hash password before saving
schema.pre('save', async function (next) {
  // @ts-ignore
  const user = this as IUserDocument

  if (!this.isModified('password')) {
    console.log('password not modified')
    return next()
  }

  console.log('password modified')  

  const salt = await bcrypt.genSalt(10)

  const hash = await bcrypt.hash(user.password, salt)

  user.password = hash

  next()
})

schema.methods.comparePassword = async function (password: string) {
  const user = this as IUserDocument
  return bcrypt.compare(password, user.password).catch((e) => false)
}

schema.methods.hasRole = function (role: string) {
  const user = this as IUserDocument
  return user.role === role
}

export const User = mongoose.model<IUserDocument>('User', schema)
