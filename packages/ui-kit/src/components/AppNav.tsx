import { useState, type ReactNode } from 'react'
import { useUi } from '../useUi'
import { Sheet } from './Sheet'

export interface NavItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: number | boolean
}

export interface MenuItem {
  id: string
  label: string
  onSelect: () => void
  badge?: boolean
}

/** Bottom tab bar plus a menu button that opens a menu sheet. */
export function AppNav({ items, active, onChange, menu, menuIcon }: { items: NavItem[]; active: string; onChange: (id: string) => void; menu: MenuItem[]; menuIcon?: ReactNode }) {
  const { t } = useUi()
  const [open, setOpen] = useState(false)
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
        <button type="button" className="ek-tab" data-testid="menu" aria-haspopup="dialog" onClick={() => setOpen(true)}>
          <span className="ek-tab__icon" aria-hidden="true">{menuIcon ?? '☰'}</span>
          <span className="ek-tab__label">{t.nav.menu}</span>
          {menu.some((m) => m.badge) ? <span className="ek-badge" aria-label={t.common.new} /> : null}
        </button>
      </nav>
      <Sheet open={open} title={t.nav.menuTitle} onClose={() => setOpen(false)} testId="menu-sheet">
        <ul className="ek-menu" role="menu">
          {menu.map((m) => (
            <li key={m.id} role="none">
              <button
                type="button"
                role="menuitem"
                className="ek-menu__item"
                data-testid={`menu-${m.id}`}
                onClick={() => {
                  setOpen(false)
                  // let the menu sheet close (history entry) before the next overlay opens
                  setTimeout(m.onSelect, 0)
                }}
              >
                {m.label}
                {m.badge ? <span className="ek-badge ek-badge--inline">{t.common.new}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  )
}
