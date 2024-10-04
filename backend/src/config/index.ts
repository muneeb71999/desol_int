import dotenv from 'dotenv'

dotenv.config()

export const config = {
  db: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crawler'
    }
  },
  app: {
    name: process.env.APP_NAME || 'Crawler',
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:5000'
  },
  jwt: {
    secret: '2AD5B33C114B93C62D6D921E91C98',
    expiresIn: '1d'
  },
}
