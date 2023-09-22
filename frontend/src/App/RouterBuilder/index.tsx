import { AnimatePresence } from 'framer-motion'
import { type FC } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import IndexPage from '../../IndexPage'
import RepoPage from '../../RepoPage'

const RouterBuiler: FC = () => {
  const location = useLocation()

  return (

      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/repos/:repoId" element={<RepoPage />} />
        </Routes>
      </AnimatePresence>
  )
}

export default RouterBuiler
