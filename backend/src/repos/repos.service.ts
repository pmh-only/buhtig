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

  public async createRepo (userId: number, createRepoDto: CreateRepoDto): Promise<void> {
    await this.repos.insert({
      userId,
      name: createRepoDto.name,
      description: createRepoDto.description
    })
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
      .select('*')
      .leftJoin('files.commit', 'commit')
      .where('files.repoId = :repoId', { repoId })
      .andWhere('files.commitId <= :commitIdRange', { commitIdRange })
      .groupBy('files.logical')
      .orderBy('files.logical', 'ASC')
      .addOrderBy('files.commitId', 'DESC')
      .getMany()

    return files.filter((file) => !file.isDeleted)
  }

  public async getRepoCommit (repoId: number): Promise<Commit[]> {
    return await this.commits.findBy({ repoId })
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
      logical: file.originalname
    }))

    await this.files.insert(filesEntities)
  }
}
