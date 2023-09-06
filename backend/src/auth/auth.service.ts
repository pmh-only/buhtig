import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { type LoginByPasswordDto } from './dto/LoginByPassword.dto'
import { type LoginByTokenDto } from './dto/LoginByToken.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly usersSerivce: UsersService
  ) {}

  public generateToken (userId: number): string {
    return this.jwtService.sign({ userId })
  }

  public verifyToken (token: string): string {
    try {
      return this.jwtService.verify(token).userId
    } catch (e) {
      if (e instanceof JsonWebTokenError)
        throw new NotAcceptableException('TOKEN_MALFORMED')

      if (e instanceof TokenExpiredError)
        throw new UnauthorizedException('TOKEN_EXPIRED')

      throw new InternalServerErrorException('JWT_SERVICE_ERROR')
    }
  }

  public async loginByPassword (dto: LoginByPasswordDto): Promise<string> {
    const user = await this.usersSerivce.findUserByLogin(dto.login, true)
    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User or Password invalid.'
      })
    }

    const password = await this.usersSerivce.hashUserPassword(dto.password, user.salt)
    if (password !== user.password) {
      throw new NotFoundException({
        success: false,
        message: 'User or Password invalid.'
      })
    }

    return this.generateToken(user.id)
  }

  public async loginByToken (dto: LoginByTokenDto): Promise<string> {
    const user = await this.usersSerivce.findUserByLogin(dto.login, true)
    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User or Token invalid.'
      })
    }

    const token = user.tokens.find((token) =>
      token.userId === user.id &&
      token.secret === dto.secret)

    if (token === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User or Token invalid.'
      })
    }

    return this.generateToken(user.id)
  }
}
