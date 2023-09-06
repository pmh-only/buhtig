import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string
}
