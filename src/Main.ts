
import { config } from 'dotenv'
import Logger from '@utils/Logger'
import App from './App'

async function bootstrap () {
  try {
    process.env.NODE_ENV = String(process.env.NODE_ENV).trim()
    config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })
    Logger.info('Starting API server...')
    const app = new App()
    await app.initialize()
    await app.listen()
    Logger.info('Application started!')
  } catch (error) {
    Logger.error(`Starting application. Erro: ${error.message}`, error)
  }
}

// initialize app
bootstrap()
