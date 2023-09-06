import { Controller, Get, Post, Body, Param, Delete, UseGuards, Res, NotFoundException, Query, UseInterceptors, UploadedFiles } from '@nestjs/common'
import { ReposService } from './repos.service'
import { CreateRepoDto } from './dto/CreateRepoDto'
import { PResBody } from '../types'
import { AuthGuard } from '../auth/auth.guard'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { type Repo } from './entities/repo.entity'
import { type File } from './entities/file.entity'
import { type Commit } from './entities/commit.entity'
import { FilesInterceptor } from '@nestjs/platform-express'
import * as multer from 'multer'
import { randomBytes } from 'crypto'
import { CreateCommitDto } from './dto/CreateCommitDto'

@Controller('repos')
@ApiTags('repos')
export class ReposController {
  constructor (
    private readonly reposService: ReposService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('SESSION_TOKEN')
  public async createRepo (@Res({ passthrough: true }) res: Response, @Body() createRepoDto: CreateRepoDto): PResBody {
    const userId = res.locals.userId
    await this.reposService.createRepo(userId, createRepoDto)

    return {
      success: true
    }
  }

  @Get()
  public async findAllRepo (): PResBody<Repo[]> {
    const repos = await this.reposService.findAllRepo()

    return {
      success: true,
      body: repos
    }
  }

  @Get(':repoId')
  public async findRepo (@Param('repoId') repoId: number): PResBody<Repo> {
    const repo = await this.reposService.findRepo(repoId)
    if (repo === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'Repository not found'
      })
    }

    return {
      success: true,
      body: repo
    }
  }

  @Delete(':repoId')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('SESSION_TOKEN')
  public async removeRepo (@Res({ passthrough: true }) res: Response, @Param('repoId') repoId: number): PResBody {
    const userId = res.locals.userId
    await this.reposService.removeRepo(userId, repoId)

    return {
      success: true
    }
  }

  @Get(':repoId/files')
  public async getRepoFiles (@Param('repoId') repoId: number, @Query('commit_id') commitIdRange = Number.MAX_SAFE_INTEGER): PResBody<File[]> {
    const files = await this.reposService.getRepoFiles(repoId, commitIdRange)

    return {
      success: true,
      body: files
    }
  }

  @Get(':repoId/commits')
  public async getRepoCommits (@Param('repoId') repoId: number): PResBody<Commit[]> {
    const commits = await this.reposService.getRepoCommit(repoId)

    return {
      success: true,
      body: commits
    }
  }

  @Post(':repoId/commits')
  @UseInterceptors(FilesInterceptor('files', undefined, {
    storage: multer.diskStorage({
      destination: 'files/',
      filename: (req, file, cb) => {
        cb(null, randomBytes(15).toString('hex'))
      }
    })
  }))
  public async createCommit (@Res({ passthrough: true }) res: Response, @Param('repoId') repoId: number, @UploadedFiles() files: Express.Multer.File[], @Body() body: CreateCommitDto): PResBody {
    const userId = res.locals.userId
    await this.reposService.createCommit(userId, repoId, files, body)

    return {
      success: true
    }
  }
}
