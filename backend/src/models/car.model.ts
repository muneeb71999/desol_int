import { ICarDocument } from "@/types";
import { Schema, model } from "mongoose";

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carModel: {
    type: String,
    required: true,
    minlength: 3
  },
  price: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11
  },
  maxPictures: {
    type: Number,
    required: true,
    min: 1,
    max: 10
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

export const Car = model<ICarDocument>('Car', schema)