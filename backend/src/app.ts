import express from 'express'

// Don't change it to alias path
import './libs/asyncErrorHandler.js'
import { config } from '@/config'
import { connect } from '@/mongo'
import cors from 'cors'

// initialize express
const app = express()

// import routes
import { authRouter } from '@/routes/auth.routes'
import { carRouter } from './routes/car.routes'

// import middlewares
import { requestValidationMiddleware } from '@/middlewares/request-validation.middleware'
import { globalErrorHandlerMiddleware } from '@/middlewares/global-error-handler.middleware'
import { isAuthenticatedMiddleware } from '@/middlewares/authentication.middleware'

// middlewares
app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(cors())

// custom middlewares
app.use(requestValidationMiddleware)

// public routes
app.get('/health-check', (req, res) => {
  res.status(200);
  res.send('API is working fine.')
  res.end()
})

app.use('/api/auth', authRouter)

// protected routes
app.use(isAuthenticatedMiddleware)

app.use('/api/cars', carRouter)

// global error handler
app.use(globalErrorHandlerMiddleware)

// start the server
app.listen(config.app.port, () => {
  connect()
  console.log('Server started on port ' + config.app.port)
})
