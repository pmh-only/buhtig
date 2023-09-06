import { IsDate, IsHexadecimal, IsInt, IsOptional, IsPositive, IsString, Length, Matches, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Token } from '../../tokens/entities/token.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Repo } from '../../repos/entities/repo.entity'

@Entity({
  name: 'users'
})
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'users_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column({
    name: 'users_login',
    unique: true,
    type: 'varchar',
    length: 20,
    nullable: false
  })
  @Length(3, 20)
  @IsString()
  @Matches(/^\w+$/)
  @ApiProperty()
  public readonly login: string

  @Column({
    name: 'users_password',
    type: 'char',
    length: 128,
    nullable: false,
    select: false
  })
  @IsString()
  @IsHexadecimal()
  @Length(128, 128)
  @ApiProperty()
  public readonly password: string

  @Column({
    name: 'users_salt',
    type: 'char',
    length: 8,
    nullable: false,
    select: false
  })
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  public readonly salt: string

  @Column({
    name: 'users_bio',
    type: 'text',
    nullable: true
  })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @CreateDateColumn({
    name: 'users_createdat',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @OneToMany(() => Token, (t) => t.user)
  @ApiProperty()
  public readonly tokens: Token[]

  @OneToMany(() => Repo, (r) => r.user)
  @ApiProperty()
  public readonly repos: Repo[]
}
