import mongoose from 'mongoose'

export interface IKeywords {
  word: string
  weight: number
}

export interface IUser {
  _id: string
  toJSON(): object
  name: string
  email: string
  password: string
  resetToken: string | null
  role: string
  provider: string
  providerId: string
  country?: string
  phoneNumber: string
  designation: string
  picture: string
  createdAt?: Date
  updatedAt?: Date
}

// @ts-ignore
export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(password: string): Promise<boolean>
  toJSON(): object
  hasRole(role: string): boolean
}

export interface IAPIKey {
  _id: string
  key: string
  permissions: string[]
  label: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IAPIKeyDocument extends mongoose.Document {}

export interface IGetDocumentsResponse<T> {
  docs: T[]
  total: number
  page: number
  limit: number
  currentCount: number
  currentPage: number
  nextPage: number | null
  prevPage: number | null
  totalPages: number
}

export interface IErrorResponse {
  message: string
  error: {
    messsages: string[]
  }
  orignal_error?: any
}

// ====================================================
// Models
// ====================================================
export interface ICar {
  _id: string;
  userId: string;
  carModel: string;
  price: number;
  phoneNumber: string;
  maxPictures: number;
  createdAt?: Date;
  updatedAt?: Date;
} 

export interface ICarDocument extends mongoose.Document {
  userId: string;
  carModel: string; // Renamed to avoid conflict
  price: number;
  phoneNumber: string;
  maxPictures: number;
  createdAt?: Date;
  updatedAt?: Date;
}