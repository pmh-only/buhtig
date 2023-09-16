import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'
import * as shajs from 'sha.js'
import { Repository } from 'typeorm'
import { type CreateUserDto } from './dto/CreateUserDto'
import { type UpdateUserDto } from './dto/UpdateUserDto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly users: Repository<User>
  ) {}

  public async createUser (createUserDto: CreateUserDto): Promise<void> {
    const salt = this.createUserSalt()
    const password = await this.hashUserPassword(createUserDto.plainPassword, salt)

    await this.users.insert({
      login: createUserDto.login,
      bio: createUserDto.bio,
      password,
      salt
    })
  }

  public async checkLoginClaim (userLogin: string): Promise<boolean> {
    return await this.findUserByLogin(userLogin) !== undefined
  }

  public async findUserByLogin (userLogin: string, revealSecrets = false): Promise<User | undefined> {
    return await this.users.findOne({
      where: { login: userLogin },
      select: {
        id: true,
        login: true,
        bio: true,
        createdAt: true,
        password: revealSecrets,
        salt: revealSecrets,
        tokens: revealSecrets
      },
      relations: {
        tokens: revealSecrets
      }
    }) ?? undefined
  }

  public async findAllUser (): Promise<User[]> {
    return await this.users.find()
  }

  public async findUser (userId: number): Promise<User | undefined> {
    return await this.users.findOne({
      where: { id: userId },
      relations: {
        repos: true
      }
    }) ?? undefined
  }

  public async updateUser (userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    await this.users.update(
      { id: userId },
      { bio: updateUserDto.bio }
    )
  }

  private createUserSalt (): string {
    return randomBytes(4).toString('hex')
  }

  public async hashUserPassword (rawPassword: string, salt: string): Promise<string> {
    return shajs('SHA512').update(salt + rawPassword).digest('hex')
  }
}
