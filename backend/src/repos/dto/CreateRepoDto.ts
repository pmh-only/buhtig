import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches, MaxLength } from 'class-validator'

export class CreateRepoDto {
  @Length(1, 20)
  @IsString()
  @Matches(/^\w+$/)
  @ApiProperty()
  public readonly name: string

  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  public readonly description: string
}
