import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@engine/ui/styles/tokens.css'
import '@engine/ui/styles/ui.css'
import './theme/tokens.css'
import './theme/game.css'
import { i18n } from './runtime'

const params = new URLSearchParams(location.search)
const root = createRoot(document.getElementById('root')!)

if (params.has('artsheet')) {
  void import('./dev/ArtSheetPage').then(({ ArtSheetPage }) => root.render(<ArtSheetPage only={params.get('artsheet') || null} />))
} else {
  void i18n.initLocale().then(async () => {
    const { App } = await import('./App')
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
