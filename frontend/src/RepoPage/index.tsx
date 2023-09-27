import { type MouseEvent, type FC, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../PageContainer'
import useSWR from 'swr'
import { motion } from 'framer-motion'

import style from './style.module.scss'
import ReadmeBuilder from './ReadmeBuilder'
import { useSearchParam } from 'react-use'

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

interface Commit {
  id: number
  message: string
  createdAt: string
  userId: number
  repoId: number
  user: {
    id: number
    login: string
    bio: string
    createdAt: string
  }
}

const fetcher = async (path: string): Promise<any> =>
  await fetch(path).then(async (res) => await res.json())

const RepoPage: FC = () => {
  const { repoId } = useParams()
  const navigate = useNavigate()
  const commitId = useSearchParam('commitId')
  const [showFiles, setShowFiles] = useState(false)
  const [showCommits, setShowCommits] = useState(false)

  const { data: repoCall } = useSWR<{ body?: Repo }>(`/api/repos/${repoId}`, fetcher)
  const { data: filesCall } = useSWR<{ body?: File[] }>(`/api/repos/${repoId}/files${commitId !== null ? `?commitId=${commitId}` : ''}`, fetcher)
  const { data: commitsCall } = useSWR<{ body?: Commit[] }>(`/api/repos/${repoId}/commits`, fetcher)

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

      {commitId !== null && commitsCall?.body?.filter((v) => v.id.toString() === commitId)?.map((commit) => (
        <div className={style.repo} key="">
          <img src="/flag.svg"/>
          <div>
            <h2><b>{commit.message}</b>#{commit.id} by <Link to={`/users/${commit.user.id}`}>{commit.user.login}</Link></h2>
            <p>Commited at {new Date(commit.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}

      <ul className={style.files}>

        <li className={style.clickable} onClick={() => { setShowCommits(!showCommits) }}>
          <img src={showCommits ? '/mailbox_open.svg' : '/mailbox_close.svg'} />{showCommits ? 'Hide' : 'Show'} Commits
        </li>
        {showCommits && commitsCall?.body?.map((v, i) => (
          <motion.li
            key={i}
            className={style.item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i / 20 }}>
            <img src="/flag.svg"/>
            <p><Link to={`/repos/${repoId}?commitId=${v.id}`}>{v.message}</Link></p>
            <p className={style.commit}><img src="/dev.svg" /><Link to={`/users/${v.user.id}`}>#{v.user.id} {v.user.login}</Link></p>
          </motion.li>
        ))}
        {showCommits && commitsCall?.body?.length === 0 && (
          <li className={style.item}>Commit list empty.</li>
        )}

        <li className={style.clickable} onClick={() => { setShowFiles(!showFiles) }}>
          <img src={showFiles ? '/folder_open.svg' : '/folder_close.svg'} />{showFiles ? 'Hide' : 'Show'} Files
        </li>
        {showFiles && filesCall?.body?.map((v, i) => (
          <motion.li
            key={i}
            className={style.item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i / 20 }}>
            <img src="/file.svg"/>
            <p><Link to={`/api/viewer/${v.physical}`}>{v.logical}</Link></p>
            <p className={style.commit}>
              <Link to={`/repos/${repoId}?commitId=${v.commit.id}`}>
                <img src="/flag.svg" />#{v.commit.id} {v.commit.message}
              </Link>
            </p>
          </motion.li>
        ))}

        {showFiles && filesCall?.body?.length === 0 && (
          <li className={style.item}>Repository empty. (try choose another commit)</li>
        )}

        {filesCall?.body !== undefined && (
          <ReadmeBuilder physical={filesCall?.body?.find((v) => v.logical === '/README.md')?.physical} />
        )}

      </ul>

    </PageContainer>
  )
}

export default RepoPage
