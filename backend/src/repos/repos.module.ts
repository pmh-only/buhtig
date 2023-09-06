import { Module } from '@nestjs/common'
import { ReposService } from './repos.service'
import { ReposController } from './repos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Repo } from './entities/repo.entity'
import { User } from '../users/entities/user.entity'
import { Commit } from './entities/commit.entity'
import { File } from './entities/file.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Repo, Commit, File, User])
  ],
  controllers: [ReposController],
  providers: [ReposService]
})
export class ReposModule {}
