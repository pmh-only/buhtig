import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginByTokenDto {
  @IsString()
  @ApiProperty({
    description: 'User login id'
  })
  public readonly login: string

  @IsString()
  @ApiProperty({
    description: 'Login token secret'
  })
  public readonly secret: string
}
