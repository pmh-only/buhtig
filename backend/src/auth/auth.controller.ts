import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { PResBody, ResBody } from '../types'
import { AuthService } from './auth.service'
import { LoginByPasswordDto } from './dto/LoginByPassword.dto'
import { Response } from 'express'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { LoginByTokenDto } from './dto/LoginByToken.dto'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService
  ) {}

  @Get('/status')
  @UseGuards(AuthGuard)
  @ApiCookieAuth()
  public getLoginStatus (@Res({ passthrough: true }) res: Response): ResBody<{ userId: number }> {
    const userId = res.locals.userId

    return {
      success: true,
      body: {
        userId
      }
    }
  }

  @Post('/by-pass')
  public async loginByPassword (@Res({ passthrough: true }) res: Response, @Body() body: LoginByPasswordDto): PResBody {
    const token = await this.authService.loginByPassword(body)
    res.cookie('SESSION_TOKEN', token)

    return {
      success: true
    }
  }

  @Post('/by-token')
  public async loginByToken (@Res({ passthrough: true }) res: Response, @Body() body: LoginByTokenDto): PResBody<{ token: string }> {
    const token = await this.authService.loginByToken(body)

    return {
      success: true,
      body: {
        token
      }
    }
  }
}
