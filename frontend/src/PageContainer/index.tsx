import { type ReactNode, type FC } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import style from './style.module.scss'

interface Props {
  children: ReactNode
  className?: string
}

const PageContainer: FC<Props> = ({ children, className }) =>
  <motion.section
    className={clsx(className, style.container)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}>
    {children}
  </motion.section>

export default PageContainer
