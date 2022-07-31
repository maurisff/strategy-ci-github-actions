import 'reflect-metadata'
import express, { Application, Request, Response } from 'express'
import http, { Server } from 'http'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import Logger from '@utils/Logger'
import AppError from '@utils/AppError'
import ErrorHandlerMiddleware from '@middlewares/ErrorHandlerMiddleware'

export default class App {
  private port: Number;
  private app: Application;
  private server: Server;

  private middlewares (): void {
    this.app.use(express.json({ limit: '5mb' }))
    this.app.use(express.urlencoded({ limit: '5mb', extended: true, parameterLimit: 5000 }))
    this.app.use(cookieParser())
    this.app.use(compress())
    this.app.use(methodOverride())
    // secure apps by setting various HTTP headers
    this.app.use(helmet())
    // enable CORS - Cross Origin Resource Sharing
    this.app.use(cors({
      origin: '*',
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,content-name',
      exposedHeaders: 'authorization,content-name',
      methods: 'GET, POST, OPTIONS, PUT, DELETE',
      credentials: true
    }))

    // use morgan to log requests to the console
    if (process.env.NODE_ENV !== 'production') {
      this.app.use(morgan('dev'))
    }
  }

  private errorHandlerMiddleware (): void {
    this.app.use(ErrorHandlerMiddleware.error)
  }

  private healthcheck (): void {
    this.app.use('/healthcheck', (request: Request, response: Response) => {
      response.json({ status: 'OK' })
    })
  }

  private routes (): void {
    this.app.route('/api/v1')
      .get((request: Request, response: Response) => {
        response.json({ status: 'OK - V1' })
      })
    this.app.route('/api/v2')
      .get((request: Request, response: Response) => {
        response.json({ status: 'OK - V2' })
      })
  }

  public async initialize (): Promise<void> {
    this.app = express()
    this.middlewares()
    this.healthcheck()
    this.routes()
    this.errorHandlerMiddleware()

    process.on('SIGINT', async () => {
      try {
        this.server.close()
        Logger.info('Server is closed!!')
      } catch (error) {
        Logger.error('Error on close server. Error: ', error)
      }
    })
  }

  public async listen (): Promise<void> {
    this.server = http.createServer(this.getApplication())
    this.server.setTimeout(0)
    this.port = Number((process.env.PORT || process.env.API_PORT || 3000))
    this.server.listen(this.port, () => {
      Logger.info('Server started on port: ', this.port)
    })
  }

  public getApplication (): Application {
    if (!this.app) { throw new AppError('Application not initialized!', 500) }
    return this.app
  }

  public getServer (): Server {
    if (!this.server) { throw new AppError('Server is not listening', 500) }
    return this.server
  }
}
