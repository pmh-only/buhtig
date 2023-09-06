import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { TokensController } from './tokens.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Token } from './entities/token.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token])
  ],
  controllers: [TokensController],
  providers: [TokensService]
})
export class TokensModule {}
