import { type FC } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import style from './style.module.scss'

const fetcher = async (path: string): Promise<{ success: boolean, body: { userId: number } }> =>
  await fetch(path).then(async (res) => await res.json())

const SessionBar: FC = () => {
  const { data } = useSWR('/api/auth/status', fetcher)

  return (
    <div className={style.link}>
      {data !== undefined && data.success && (
        <>
          <Link to={`/users/${data.body.userId}`}>profile.</Link>
          <Link to="/logout">logout.</Link>
        </>
      )}

      {data !== undefined && !data.success && (
        <Link to="/login">login.</Link>
      )}
    </div>
  )
}

export default SessionBar
