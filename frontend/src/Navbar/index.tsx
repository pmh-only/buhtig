import { type FC } from 'react'
import { Link } from 'react-router-dom'
import SessionBar from './SessionBar'
import style from './style.module.scss'

const Navbar: FC = () =>
  <nav className={style.navbar}>
    <div className={style.title}>
      <img src="/wave.svg" alt="" />
      <Link to="/">
      <h1>Buhtig</h1>
      <p>the codestore.</p>
      </Link>
    </div>

    <SessionBar />
  </nav>

export default Navbar
