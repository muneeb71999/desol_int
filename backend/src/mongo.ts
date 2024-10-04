import mongoose from 'mongoose'
import { idPlugin } from './utils/id-plugin'
import { config } from './config'

const MONGO_URI = config.db.mongo.uri

mongoose.plugin(idPlugin)

export const connect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Successfully connected to database')
    })
    .catch((error) => {
      console.log('database connection failed. exiting now...')
      console.error(error)
      process.exit(1)
    })
}

export const disconnect = () => {
  mongoose.disconnect()
}
