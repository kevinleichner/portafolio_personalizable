import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import {PortfolioApp} from './PortfolioApp.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <PortfolioApp />
  //</StrictMode>,
)
