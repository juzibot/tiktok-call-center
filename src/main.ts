import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { AppModule } from './app.module'
import { AppConfig } from './config/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(json({ limit: '5mb' }))
  const configService = app.get(ConfigService<AppConfig>)
  const port = configService.get('port', { infer: true })
  await app.listen(port)
  const logger = new Logger('Bootstrap')
  logger.log(`server started listening on port ${port}`)
}
bootstrap()
