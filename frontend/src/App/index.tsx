import { type FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import SiteContainer from '../SiteContainer'
import RouterBuiler from './RouterBuilder'

const App: FC = () =>
  <BrowserRouter>
    <SiteContainer navbar={<Navbar />}>
      <RouterBuiler />
    </SiteContainer>
  </BrowserRouter>

export default App
