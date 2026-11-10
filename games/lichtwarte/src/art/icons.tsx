/** Kleine Zeichen für Navigation und Kopfzeile (24 × 24, Strich in der Textfarbe — keine eigenen Farben). */
import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg className="lw-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

/** Warte mit Lichtstrahlen. */
export const IconTower = () => (
  <Icon>
    <path d="M9 21 L10 10 h4 l1 11 z M8 10 h8 M10 10 V7 h4 v3 M9.5 7 L12 4 l2.5 3" />
    <path d="M5 6.5 l2 1 M19 6.5 l-2 1 M4.5 10 h1.8 M19.5 10 h-1.8" />
  </Icon>
)
/** Mondsichel mit Stern. */
export const IconMoon = () => (
  <Icon>
    <path d="M15.5 3.5 a8.5 8.5 0 1 0 5 13 a7 7 0 0 1 -5 -13 z" />
    <path d="M18.5 6 v3 M17 7.5 h3" />
  </Icon>
)
/** Lade des Archivs. */
export const IconArchive = () => (
  <Icon>
    <path d="M4 11 a8 6 0 0 1 16 0 v8 h-16 z M4 11 h16 M12 11 v3" />
    <circle cx="12" cy="15" r="1.2" />
  </Icon>
)
/** Laterne der Wachrunde. */
export const IconLantern = () => (
  <Icon>
    <path d="M8 9 h8 l-1 10 h-6 z M9 9 l1 -3 h4 l1 3 M12 6 V3.5 M10.5 3.5 h3" />
    <path d="M12 12 q2 2 0 4.5 q-2 -2.5 0 -4.5 z" />
  </Icon>
)
/** Blatt und Blüte: das Tal. */
export const IconLeaf = () => (
  <Icon>
    <path d="M5 19 C5 9 11 5 19 5 c0 9 -4 14 -14 14 z M5 19 L14 10" />
  </Icon>
)
/** Karte der Lande. */
export const IconMap = () => (
  <Icon>
    <path d="M3.5 6.5 l5.5 -2 l6 2 l5.5 -2 v13 l-5.5 2 l-6 -2 l-5.5 2 z M9 4.5 v13 M15 6.5 v13" />
  </Icon>
)
/** Marktbeutel. */
export const IconPouch = () => (
  <Icon>
    <path d="M9 8 q-5 5 -4 9 q1 3 7 3 q6 0 7 -3 q1 -4 -4 -9 z M9 8 l-1 -3.5 h8 l-1 3.5 M9 8 h6" />
    <path d="M12 11.5 v5 M10.2 13 h3.6" />
  </Icon>
)
/** Menü: drei Sprossen. */
export const IconMenu = () => (
  <Icon>
    <path d="M5 7 h14 M5 12 h14 M5 17 h14" />
  </Icon>
)
/** Aufgeschlagenes Buch: die Chronik. */
export const IconBook = () => (
  <Icon>
    <path d="M12 6.5 C10 5 6.5 4.5 3.5 5.5 v12.5 c3 -1 6.5 -0.5 8.5 1 c2 -1.5 5.5 -2 8.5 -1 V5.5 c-3 -1 -6.5 -0.5 -8.5 1 z M12 6.5 V19" />
  </Icon>
)
/** Funke (Funkenruf). */
export const IconSpark = () => (
  <Icon>
    <path d="M12 3 l1.8 6.2 L20 11 l-6.2 1.8 L12 19 l-1.8 -6.2 L4 11 l6.2 -1.8 z" />
  </Icon>
)
