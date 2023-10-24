import { type MouseEvent, type FC } from 'react'
import useSWR from 'swr'

import style from './style.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageContainer from '../PageContainer'

interface Repo {
  id: number
  name: string
  description: string
  createdAt: string
  userId: number
}

interface User {
  id: number
  login: string
  bio: string
  createdAt: string
  repos: Repo[]
}

const fetcher = async (path: string): Promise<{ success: boolean, body: User }> =>
  await fetch(path).then(async (res) => await res.json())

const UserPage: FC = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { data: userCall } = useSWR<{ body?: User }>(`/api/users/${userId}`, fetcher)

  const onClick = (repoId: number) => (e: MouseEvent<HTMLLIElement>) => {
    if ((e.target as HTMLElement).tagName === 'A') {
      return
    }

    navigate(`/repos/${repoId}`)
  }

  return (
    <PageContainer className={style.repo}>
      {userCall?.body !== undefined && (
        <div className={style.user}>
          <img src="/dev.svg"/>
          <div>
            <h2><b>{userCall.body.login}</b>#{userCall.body.id}</h2>
            <p>{userCall.body.bio}</p>
            <p>Registed at {new Date(userCall.body.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      <ul>
        {userCall?.body?.repos?.map((v, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i / 10 }}
            onClick={onClick(v.id)}>
              <img src="/bucket.svg"/>
              <div>
                <h2><b>{v.name}</b>#{v.id}</h2>
                <p>{v.description}</p>
                <p>Created at {new Date(v.createdAt).toLocaleString()}</p>
              </div>
          </motion.li>
        ))}
      </ul>
    </PageContainer>
  )
}

export default UserPage
