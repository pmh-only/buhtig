import { motion } from 'framer-motion'
import { type FC, type ReactNode } from 'react'
import style from './style.module.scss'

interface Props {
  navbar: ReactNode
  children: ReactNode
}

const SiteContainer: FC<Props> = ({ navbar, children }) =>
  <div className={style.outerContainer}>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={style.innerContainer}>
      {navbar}
      {children}
    </motion.div>
  </div>

export default SiteContainer
