import { AnimatePresence } from 'framer-motion'
import { type FC } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import IndexPage from '../../IndexPage'
import RepoPage from '../../RepoPage'
import ViewerPage from '../../ViewerPage'
import UserPage from '../../UserPage'
import LoginPage from '../../LoginPage'
import RegistPage from '../../RegistPage'

const RouterBuiler: FC = () => {
  const location = useLocation()

  return (
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/regist" element={<RegistPage />} />
          <Route path="/repos/:repoId" element={<RepoPage />} />
          <Route path="/viewer/:fileId" element={<ViewerPage />} />
          <Route path="/users/:userId" element={<UserPage />} />
        </Routes>
      </AnimatePresence>
  )
}

export default RouterBuiler
