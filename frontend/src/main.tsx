import './global.scss'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'

ReactDOM
  .createRoot(document.getElementById('root') as HTMLDivElement)
  .render(<StrictMode><App /></StrictMode>)
