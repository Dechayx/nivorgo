import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import * as bootstrap from 'bootstrap'
import App from './App.jsx'

// Make Bootstrap globally available on the client
window.bootstrap = bootstrap;

const container = document.getElementById('root')

if (container && container.hasChildNodes()) {
  hydrateRoot(
    container,
    <StrictMode>
      <App />
    </StrictMode>
  )
} else if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

