import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './main.css'   // Ity no CSS principale (Tailwind)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
