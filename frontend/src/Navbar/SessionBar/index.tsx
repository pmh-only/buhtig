import { motion } from 'framer-motion'
import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { useCookie } from 'react-use'
import useSWR from 'swr'
import style from './style.module.scss'

const fetcher = async (path: string): Promise<{ success: boolean, body: { userId: number } }> =>
  await fetch(path).then(async (res) => await res.json())

const SessionBar: FC = () => {
  const { data, mutate } = useSWR('/api/auth/status', fetcher)
  const [, , deleteSessionToken] = useCookie('SESSION_TOKEN')

  if (data === undefined) {
    return <div className={style.link}></div>
  }

  const onLogout = (): void => {
    deleteSessionToken()
    void mutate()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={style.link}>
      {data.success && (
        <>
          <Link to={`/users/${data.body.userId}`}>profile.</Link>
          <button onClick={onLogout}>logout.</button>
        </>
      )}

      {!data.success && (
        <>
          <Link to="/regist">regist.</Link>
          <Link to="/login">login.</Link>
        </>
      )}
    </motion.div>
  )
}

export default SessionBar
