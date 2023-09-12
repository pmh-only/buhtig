import { type FC, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import style from './style.module.scss'

interface Props {
  navbar: ReactNode
  children: ReactNode
}

const SiteContainer: FC<Props> = ({ navbar, children }) =>
  <div className={style.outerContainer}>
    <motion.div className={style.innerContainer}>
      {navbar}
      {children}
    </motion.div>
  </div>

export default SiteContainer
