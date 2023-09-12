import { type FC } from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import SiteContainer from '../SiteContainer'
import Navbar from '../Navbar'

const App: FC = () =>
  <BrowserRouter>
    <SiteContainer navbar={<Navbar />}>
      <Routes>

      </Routes>
    </SiteContainer>
  </BrowserRouter>

export default App
