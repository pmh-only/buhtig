import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsPositive, IsString, Length, Matches, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Commit } from './commit.entity'
import { File } from './file.entity'

@Entity({
  name: 'repositories'
})
export class Repo {
  @PrimaryGeneratedColumn('increment', {
    name: 'repositories_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column({
    name: 'repositories_name',
    type: 'varchar',
    length: 20,
    nullable: false
  })
  @Length(1, 20)
  @IsString()
  @Matches(/^\w+$/)
  @ApiProperty()
  public readonly name: string

  @Column({
    name: 'repositories_description',
    type: 'text',
    nullable: true
  })
  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  public readonly description: string

  @CreateDateColumn({
    name: 'repositories_createdat',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @Column({
    name: 'users_id',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly userId: number

  @ManyToOne(() => User, (u) => u.repos, {
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

  @OneToMany(() => Commit, (c) => c.repo)
  @ApiProperty()
  public readonly commits: Commit[]

  @OneToMany(() => File, (f) => f.repo)
  @ApiProperty()
  public readonly files: File[]
}
