import { type MouseEvent, type FC } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../PageContainer'
import useSWR from 'swr'
import { motion } from 'framer-motion'

import style from './style.module.scss'
import ReadmeBuilder from './ReadmeBuilder'

interface Repo {
  id: number
  name: string
  description: string
  createdAt: string
  user: {
    id: number
    login: string
  }
}

interface File {
  id: number
  physical: string
  logical: string
  isDeleted: boolean
  createdAt: string
  repoId: number
  commitId: number
  commit: {
    id: number
    message: string
    createdAt: string
  }
}

const fetcher = async (path: string): Promise<any> =>
  await fetch(path).then(async (res) => await res.json())

const RepoPage: FC = () => {
  const { repoId } = useParams()
  const navigate = useNavigate()

  const { data: repoCall } = useSWR<{ body?: Repo }>(`/api/repos/${repoId}`, fetcher)
  const { data: filesCall } = useSWR<{ body?: File[] }>(`/api/repos/${repoId}/files`, fetcher)

  const onClick = (repoId: number) => (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName === 'A') {
      return
    }

    navigate(`/repos/${repoId}`)
  }

  return (
    <PageContainer>
      {repoCall?.body !== undefined && (
        <div className={style.repo} onClick={onClick(repoCall.body.id)}>
          <img src="/bucket.svg"/>
          <div>
            <h2><b>{repoCall.body.name}</b>#{repoCall.body.id} by <Link to={`/users/${repoCall.body.user.id}`}>{repoCall.body.user.login}</Link></h2>
            <p>{repoCall.body.description}</p>
            <p>Created at {new Date(repoCall.body.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      <ul className={style.files}>
        {filesCall?.body?.map((v, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i / 20 }}>
            <img src="/file.svg"/>
            <p><Link to={`/api/viewer/${v.physical}`}>{v.logical}</Link></p>
            <p className={style.commit}><img src="/flag.svg" />#{v.commit.id} {v.commit.message}</p>
          </motion.li>
        ))}

        {filesCall?.body?.length === 0 && (
          <li>저장소가 비어있습니다</li>
        )}

        {filesCall?.body !== undefined && (
          <ReadmeBuilder physical={filesCall?.body?.find((v) => v.logical === '/README.md')?.physical} />
        )}
      </ul>

    </PageContainer>
  )
}

export default RepoPage
