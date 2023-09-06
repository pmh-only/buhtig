import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginByPasswordDto {
  @IsString()
  @ApiProperty({
    description: 'User login id'
  })
  public readonly login: string

  @IsString()
  @ApiProperty({
    description: 'User password'
  })
  public readonly password: string
}
