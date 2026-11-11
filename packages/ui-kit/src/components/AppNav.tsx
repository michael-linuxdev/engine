import { useState, type ReactNode } from 'react'
import { useUi } from '../useUi'
import { Sheet } from './Sheet'

export interface NavItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | boolean
  /** Something waits there (a dot), as opposed to `badge` = new. Used for views that live in the menu. */
  dot?: boolean
}

export interface MenuItem {
  id: string
  label: string
  onSelect: () => void
  badge?: boolean
  /** Something waits there: a dot at the entry and at the menu button. */
  dot?: boolean
  icon?: ReactNode
  /** The entry opens a view in the main area (not an overlay). */
  view?: boolean
  /** Quiet row below the tiles (save, legal, settings) instead of a tile. */
  quiet?: boolean
}

/** Bottom tab bar plus a menu button that opens a menu sheet. */
export function AppNav({ items, active, onChange, menu, menuIcon, menuActive, menuTop }: { items: NavItem[]; active: string; onChange: (id: string) => void; menu: MenuItem[]; menuIcon?: ReactNode; /** The open view lives in the menu: the menu button shows as the active tab. */ menuActive?: boolean; /** Shown above the tiles (e.g. what is ready soon). */ menuTop?: ReactNode }) {
  const { t } = useUi()
  const [open, setOpen] = useState(false)
  // Systems of the game are tiles (with icon); save, settings and legal are quiet rows below
  const tiles = menu.filter((m) => m.icon && !m.quiet)
  const rows = menu.filter((m) => !m.icon || m.quiet)
  const entry = (m: MenuItem) => (
    <li key={m.id} role="none">
      <button
        type="button"
        role="menuitem"
        className="ek-menu__item"
        data-testid={`menu-${m.id}`}
        data-view={m.view ? 'true' : undefined}
        onClick={() => {
          setOpen(false)
          // let the menu sheet close (history entry) before the next overlay opens
          setTimeout(m.onSelect, 0)
        }}
      >
        {m.icon ? <span className="ek-menu__icon" aria-hidden="true">{m.icon}</span> : null}
        <span className="ek-menu__label">{m.label}</span>
        {m.badge ? <span className="ek-badge ek-badge--inline">{t.common.new}</span> : m.dot ? <span className="ek-badge" aria-label={t.common.ready} /> : null}
      </button>
    </li>
  )
  return (
    <>
      <nav className="ek-tabbar" aria-label={t.nav.menuTitle}>
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className={`ek-tab${active === it.id ? ' is-active' : ''}`}
            aria-current={active === it.id ? 'page' : undefined}
            data-testid={`tab-${it.id}`}
            onClick={() => onChange(it.id)}
          >
            {it.icon ? <span className="ek-tab__icon" aria-hidden="true">{it.icon}</span> : null}
            <span className="ek-tab__label">{it.label}</span>
            {it.badge ? <span className="ek-badge" aria-label={t.common.new}>{typeof it.badge === 'number' ? it.badge : ''}</span> : null}
          </button>
        ))}
        <button type="button" className={`ek-tab${menuActive ? ' is-active' : ''}`} data-testid="menu" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          <span className="ek-tab__icon" aria-hidden="true">{menuIcon ?? '☰'}</span>
          <span className="ek-tab__label">{t.nav.menu}</span>
          {menu.some((m) => m.badge || m.dot) ? <span className="ek-badge" aria-label={t.common.new} /> : null}
        </button>
      </nav>
      <Sheet open={open} title={t.nav.menuTitle} onClose={() => setOpen(false)} testId="menu-sheet">
        {menuTop}
        {tiles.length ? (
          <ul className="ek-menu ek-menu--tiles" role="menu">
            {tiles.map(entry)}
          </ul>
        ) : null}
        {rows.length ? (
          <ul className="ek-menu ek-menu--rows" role="menu">
            {rows.map(entry)}
          </ul>
        ) : null}
      </Sheet>
    </>
  )
}
