import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { Logger } from './logger/logger.service'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
import { type Response } from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  })

  const config = app.get(ConfigService)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe({
    always: true,
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    exceptionFactory: (errors) =>
      new BadRequestException(
        'VALIDATION_FAILED: ' +
        errors
          .map((v) => Object.values(v.constraints ?? {}))
          .flat().join('\n'))
  }))

  app.use(cookieParser())
  app.use(morgan((tokens, req, res) =>
    JSON.stringify({
      type: 'ACCESS_LOG',
      method: tokens.method(req, res),
      path: tokens.url(req, res),
      return: tokens.status(req, res),
      userAgent: tokens['user-agent'](req, res),
      time: tokens['response-time'](req, res),
      date: tokens.date(req, res, 'iso'),
      locals: (res as Response).locals
    })))

  const docs = new DocumentBuilder()
    .setTitle('buhtig')
    .setDescription('BUHTIG: ultra-simple github clone')
    .setVersion('0.0')
    .addTag('auth', 'Authorization & Authentication')
    .addTag('users', 'User profile & management')
    .addTag('repos', 'Code management')
    .addCookieAuth('SESSION_TOKEN')
    .build()

  const document = SwaggerModule.createDocument(app, docs)
  SwaggerModule.setup('/api', app, document)

  const port =
    config.get<number>('SERVER_PORT') ??
    process.env.SERVER_PORT ?? 3000

  await app.listen(port)
}

void bootstrap()
