import { Injectable } from '@nestjs/common'
import { type CreateRepoDto } from './dto/CreateRepoDto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repo } from './entities/repo.entity'
import { Repository } from 'typeorm'
import { File } from './entities/file.entity'
import { Commit } from './entities/commit.entity'
import { type CreateCommitDto } from './dto/CreateCommitDto'

@Injectable()
export class ReposService {
  constructor (
    @InjectRepository(Repo)
    private readonly repos: Repository<Repo>,

    @InjectRepository(File)
    private readonly files: Repository<File>,

    @InjectRepository(Commit)
    private readonly commits: Repository<Commit>
  ) {}

  public async createRepo (userId: number, createRepoDto: CreateRepoDto): Promise<number> {
    const creationResult = await this.repos.insert({
      userId,
      name: createRepoDto.name,
      description: createRepoDto.description
    })

    return creationResult.generatedMaps[0].id
  }

  public async findAllRepo (): Promise<Repo[]> {
    return await this.repos.find({
      relations: {
        user: true
      }
    })
  }

  public async findRepo (repoId: number): Promise<Repo | undefined> {
    return await this.repos.findOne({
      where: { id: repoId },
      relations: {
        user: true
      }
    }) ?? undefined
  }

  public async removeRepo (userId: number, repoId: number): Promise<void> {
    await this.repos.delete({ id: repoId, userId })
  }

  public async getRepoFiles (repoId: number, commitIdRange: number): Promise<File[]> {
    const files = await this.files.createQueryBuilder('files')
      .select('sq.*')
      .from((subQuery) => subQuery
        .select(['files.*', 'commits.commits_message', 'commits.commits_createdat'])
        .from(File, 'files')
        .leftJoin('files.commit', 'commits')
        .where('files.repoId = :repoId', { repoId })
        .andWhere('files.commitId <= :commitIdRange', { commitIdRange })
        .orderBy('files.logical', 'ASC')
        .addOrderBy('files.commitId', 'DESC')
        .limit(9999999), 'sq')
      .groupBy('sq.files_logical')
      .getRawMany()

    const parsedFiles = files.map((raw: any) => ({
      id: raw.files_id,
      physical: raw.files_physical,
      logical: raw.files_logical,
      isDeleted: raw.files_deleted === 1,
      createdAt: new Date(raw.files_createdat),
      userId: raw.users_id,
      repoId: raw.repos_id,
      commitId: raw.commits_id,
      commit: {
        id: raw.commits_id,
        message: raw.commits_message,
        createdAt: new Date(raw.commits_createdat)
      }
    }))

    return parsedFiles.filter((file) => !file.isDeleted) as any
  }

  public async getRepoCommit (repoId: number): Promise<Commit[]> {
    return await this.commits.find({
      where: { repoId },
      relations: {
        user: true
      }
    })
  }

  public async createCommit (userId: number, repoId: number, files: Express.Multer.File[], createCommitDto: CreateCommitDto): Promise<void> {
    const { generatedMaps } = await this.commits.insert({
      message: createCommitDto.message,
      userId,
      repoId
    })

    const commitId = generatedMaps[0].id as number
    const filesEntities = files.map((file) => ({
      commitId,
      repoId,
      physical: file.filename,
      logical: atob(file.originalname.replaceAll('.', '/'))
    }))

    filesEntities.push(
      ...JSON.parse(createCommitDto.deletedFiles).map((logical) => ({
        commitId,
        repoId,
        logical,
        isDeleted: true
      })))

    await this.files.insert(filesEntities)
  }
}
