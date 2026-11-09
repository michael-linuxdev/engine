import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@engine/ui/styles/tokens.css'
import '@engine/ui/styles/ui.css'
import { App } from './App'
import { i18n } from './runtime'

void i18n.initLocale().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
