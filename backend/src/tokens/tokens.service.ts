import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Token } from './entities/token.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { randomBytes } from 'crypto'

@Injectable()
export class TokensService {
  constructor (
    @InjectRepository(Token)
    private readonly tokens: Repository<Token>
  ) {}

  public async createToken (userId: number): Promise<string> {
    const secret = this.createTokenSecret()

    await this.tokens.insert({
      userId,
      secret
    })

    return secret
  }

  public async findMyToken (userId: number): Promise<Token[]> {
    const tokens = await this.tokens.findBy({
      userId
    })

    return tokens.map((v) => ({ ...v, secret: 'RESTRICTED' }))
  }

  public async removeToken (userId: number, tokenId: number): Promise<void> {
    await this.tokens.delete({
      id: tokenId,
      userId
    })
  }

  private createTokenSecret (): string {
    return randomBytes(15).toString('hex')
  }
}
