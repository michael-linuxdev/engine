import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'normal' | 'small'
}

/** Touch target ≥ 44 px (tokens.css), focus ring from the token contract. */
export function Button({ variant = 'primary', size = 'normal', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={['ek-btn', `ek-btn--${variant}`, size === 'small' ? 'ek-btn--small' : '', className ?? ''].join(' ').trim()} {...rest} />
}
