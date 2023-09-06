import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsPositive, IsString, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Repo } from './repo.entity'
import { File } from './file.entity'

@Entity({
  name: 'commits'
})
export class Commit {
  @PrimaryGeneratedColumn('increment', {
    name: 'commits_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column({
    name: 'commits_message',
    type: 'text',
    nullable: true
  })
  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  public readonly message: string

  @CreateDateColumn({
    name: 'commits_createdat',
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

  @Column({
    name: 'repos_id',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly repoId: number

  @ManyToOne(() => Repo, (u) => u.commits, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'repos_id',
    referencedColumnName: 'id'
  })
  @ApiProperty()
  public readonly repo: Repo

  @OneToMany(() => File, (f) => f.commit)
  @ApiProperty()
  public readonly files: File[]
}
