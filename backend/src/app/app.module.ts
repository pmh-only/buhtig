import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from '../logger/logger.module'
import { AuthMiddleware } from '../auth/auth.middleware'
import { AuthModule } from '../auth/auth.module'
import { TokensModule } from '../tokens/tokens.module'
import { UsersModule } from '../users/users.module'
import { ReposModule } from '../repos/repos.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USERNAME', 'buhtig'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_SCHEMA', 'buhtig'),
        synchronize: configService.get('DATABASE_SYNC', false),
        autoLoadEntities: true
      })
    }),
    AuthModule,
    TokensModule,
    UsersModule,
    ReposModule,
    ServeStaticModule.forRoot({
      serveRoot: '/api/objects',
      rootPath: './files'
    })
  ],
  controllers: [HealthController]
})
export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
  }
}
