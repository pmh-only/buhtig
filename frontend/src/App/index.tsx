import { type FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexPage from '../IndexPage'
import Navbar from '../Navbar'
import SiteContainer from '../SiteContainer'

const App: FC = () =>
  <BrowserRouter>
    <SiteContainer navbar={<Navbar />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
      </Routes>
    </SiteContainer>
  </BrowserRouter>

export default App
