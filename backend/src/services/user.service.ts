import {
  ProjectionType,
} from 'mongoose'
import { User } from '@/models/user.model'
import { IUser, IUserDocument } from '@/types'

export async function createUser(data: IUser): Promise<IUserDocument> {
  const user = new User(data)
  return await user.save()
}

export async function getUserById(
  userId: string
): Promise<IUserDocument | null> {
  return await User.findById(userId)
}

export async function updateUser(
  userId: string,
  data: any
): Promise<IUserDocument | null> {
  return await User.findByIdAndUpdate(userId, data, { new: true })
}

export async function deleteUser(
  userId: string
): Promise<IUserDocument | null> {
  await User.findByIdAndDelete(userId)
  return null
}

export async function getAllUsers(): Promise<IUserDocument[]> {
  return await User.find()
}

export async function getUserByEmail(
  email: string,
  projection?: ProjectionType<IUserDocument> | null
): Promise<IUserDocument | null> {
  return await User.findOne({ email }, projection)
}

export async function updateAndSaveNewPassword(user: any, newPassword: string) {
  user.password = newPassword
  await user.save()
}
