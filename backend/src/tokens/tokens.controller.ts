import { Controller, Post, Param, Delete, UseGuards, Res, Get } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { Response } from 'express'
import { PResBody } from '../types'
import { type Token } from './entities/token.entity'

@ApiTags('auth')
@Controller('tokens')
export class TokensController {
  constructor (private readonly tokensService: TokensService) {}

  @Get()
  @ApiCookieAuth('SESSION_TOKEN')
  @UseGuards(AuthGuard)
  public async findMyToken (@Res({ passthrough: true }) res: Response): PResBody<Token[]> {
    const userId = res.locals.userId
    const tokens = await this.tokensService.findMyToken(userId)

    return {
      success: true,
      body: tokens
    }
  }

  @Post()
  @ApiCookieAuth('SESSION_TOKEN')
  @UseGuards(AuthGuard)
  public async createToken (@Res({ passthrough: true }) res: Response): PResBody<{ secret: string }> {
    const userId = res.locals.userId
    const secret = await this.tokensService.createToken(userId)

    return {
      success: true,
      body: {
        secret
      }
    }
  }

  @Delete(':tokenId')
  @ApiCookieAuth('SESSION_TOKEN')
  @UseGuards(AuthGuard)
  public async remove (@Res({ passthrough: true }) res: Response, @Param('tokenId') tokenId: number): PResBody {
    const userId = res.locals.userId
    await this.tokensService.removeToken(userId, tokenId)

    return {
      success: true
    }
  }
}
