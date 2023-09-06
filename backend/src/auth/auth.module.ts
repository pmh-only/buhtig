import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('SESSION_SECRET', 'youshallnotpass'),
        signOptions: {
          expiresIn: '30 days',
          algorithm: 'HS512',
          issuer: 'buhtig'
        },
        verifyOptions: {
          algorithms: ['HS512'],
          issuer: 'buhtig'
        }
      })
    }),
    ConfigModule,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
