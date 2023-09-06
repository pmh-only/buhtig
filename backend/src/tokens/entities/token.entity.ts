import { IsDate, IsHexadecimal, IsInt, IsPositive, IsString, Length } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity({
  name: 'tokens'
})
export class Token {
  @PrimaryGeneratedColumn('increment', {
    name: 'tokens_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column({
    name: 'tokens_secret',
    type: 'char',
    length: 30
  })
  @IsString()
  @IsHexadecimal()
  @Length(30, 30)
  @ApiProperty()
  public readonly secret: string

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly userId: number

  @ManyToOne(() => User, (u) => u.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'users_id',
    referencedColumnName: 'id'
  })
  @ApiProperty()
  public readonly user: User

  @CreateDateColumn({
    name: 'users_createdat',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date
}
