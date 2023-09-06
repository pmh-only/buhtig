import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @Length(3, 20)
  @IsString()
  @Matches(/^\w+$/)
  @ApiProperty()
  public readonly login: string

  @MinLength(8)
  @IsString()
  @ApiProperty()
  public readonly plainPassword: string

  @IsString()
  @MaxLength(5000)
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string
}
