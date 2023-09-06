import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateCommitDto {
  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  public readonly message: string

  @ApiProperty()
  public readonly files: Express.Multer.File[]
}
