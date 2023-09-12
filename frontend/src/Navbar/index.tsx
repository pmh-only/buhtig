import { useState, type FC, type ChangeEvent } from 'react'
import style from './style.module.scss'
import { useNavigate, Link } from 'react-router-dom'
import SessionBar from './SessionBar'

const Navbar: FC = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value)

    if (e.target.value === '') {
      navigate('/')
      return
    }

    navigate('/search?q=' + e.target.value)
  }

  return (
    <nav className={style.navbar}>
      <div className={style.title}>
        <img src="/wave.svg" alt="" />
        <Link to="/">
        <h1>Buhtig</h1>
        <p>the codestore.</p>
        </Link>
      </div>

      <input
        value={search}
        onChange={onSearchChange}
        onBlur={() => { setSearch('') }}
        className={style.search}
        type="text" placeholder="search." />

      <SessionBar />
    </nav>
  )
}

export default Navbar
