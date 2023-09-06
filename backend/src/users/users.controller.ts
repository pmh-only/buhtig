import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res, ConflictException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/CreateUserDto'
import { UpdateUserDto } from './dto/UpdateUserDto'
import { PResBody } from '../types'
import { type User } from './entities/user.entity'
import { AuthGuard } from '../auth/auth.guard'
import { Response } from 'express'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor (
    private readonly usersService: UsersService

  ) {}

  @Post()
  public async createUser (@Body() createUserDto: CreateUserDto): PResBody {
    const isLoginClamed = await this.usersService.checkLoginClaim(createUserDto.login)
    if (isLoginClamed) {
      throw new ConflictException({
        success: false,
        message: `User login id "${createUserDto.login}" is already claimed`
      })
    }

    await this.usersService.createUser(createUserDto)

    return {
      success: true
    }
  }

  @Get()
  public async findAllUser (): PResBody<User[]> {
    const users = await this.usersService.findAllUser()

    return {
      success: true,
      body: users
    }
  }

  @Get('@me')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  public async findMyUser (@Res({ passthrough: true }) res: Response): PResBody<User | undefined> {
    const userId = res.locals.userId
    return await this.findUser(userId)
  }

  @Get(':userId')
  public async findUser (@Param('userId') userId: number): PResBody<User | undefined> {
    const user = await this.usersService.findUser(userId)
    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User not found.'
      })
    }

    return {
      success: true,
      body: user
    }
  }

  @Patch('@me')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  public async update (@Res({ passthrough: true }) res: Response, @Body() updateUserDto: UpdateUserDto): PResBody {
    const userId = res.locals.userId
    await this.usersService.updateUser(userId, updateUserDto)

    return {
      success: true
    }
  }
}
