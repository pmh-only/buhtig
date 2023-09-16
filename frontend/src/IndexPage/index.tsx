import { type MouseEvent, type FC } from 'react'
import useSWR from 'swr'

import style from './style.module.scss'
import { TypeAnimation } from 'react-type-animation'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

const fetcher = async (path: string): Promise<{ success: boolean, body: Repo[] }> =>
  await fetch(path).then(async (res) => await res.json())

const IndexPage: FC = () => {
  const navigate = useNavigate()
  const { data } = useSWR('/api/repos', fetcher)

  const onClick = (repoId: number) => (e: MouseEvent<HTMLLIElement>) => {
    if ((e.target as HTMLElement).tagName === 'A') {
      return
    }

    navigate(`/repos/${repoId}`)
  }

  return (
    <div className={style.repo}>
      <h1>
        <TypeAnimation
          sequence={[
            'Buhtig is opensource platform for code sharing 🙌',
            1000,
            'Buhtig is opensource platform for code archiving 💕',
            1000,
            'Buhtig is opensource platform for code versioning 🎉',
            1000,
            'Buhtig is opensource platform for code contributing 😉',
            3000,
            'Buhtig is opensource! 😎',
            1000
          ]}
          repeat={Infinity}
          cursor />
      </h1>

      <ul>
        {data?.body?.map((v, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i / 10 }}
            onClick={onClick(v.id)}>
              <img src="/bucket.svg"/>
              <div>
                <h2><b>{v.name}</b>#{v.id} by <Link to={`/users/${v.user.id}`}>{v.user.login}</Link></h2>
                <p>{v.description}</p>
                <p>Created at {new Date(v.createdAt).toLocaleString()}</p>
              </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export default IndexPage
