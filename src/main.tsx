import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TemperatureProvider } from './TemperatureContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TemperatureProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>,
  </TemperatureProvider>
  
)
