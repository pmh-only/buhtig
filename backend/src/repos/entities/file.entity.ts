import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsHexadecimal, IsInt, IsPositive, IsString, Length, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Repo } from './repo.entity'
import { Commit } from './commit.entity'

@Entity({
  name: 'files'
})
export class File {
  @PrimaryGeneratedColumn('increment', {
    name: 'files_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column({
    name: 'files_physical',
    type: 'char',
    length: 30,
    nullable: false
  })
  @IsString()
  @Length(30)
  @ApiProperty()
  @IsHexadecimal()
  public readonly physical: string

  @Column({
    name: 'files_logical',
    type: 'text',
    nullable: false
  })
  @IsString()
  @MaxLength(5000)
  @ApiProperty()
  public readonly logical: string

  @Column({
    name: 'files_deleted',
    type: 'boolean',
    default: false,
    nullable: false
  })
  @IsBoolean()
  @ApiProperty()
  public readonly isDeleted: boolean

  @CreateDateColumn({
    name: 'files_createdat',
    type: 'timestamp',
    nullable: false
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @Column({
    name: 'commits_id',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly commitId: number

  @ManyToOne(() => Commit, (c) => c.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'commits_id',
    referencedColumnName: 'id'
  })
  @ApiProperty()
  public readonly commit: Commit

  @Column({
    name: 'repos_id',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly repoId: number

  @ManyToOne(() => Repo, (u) => u.files, {
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
}
