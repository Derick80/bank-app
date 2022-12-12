import React, { ChangeEvent, ReactNode } from 'react'
import styles from './toggle.module.css'
interface IToggleProps {
  name?: string
  value?: string
  checked?: boolean
  indeterminate?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  htmlFor?: string
  children?: ReactNode
  props?: unknown
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}
export default function ToggleButton({
  name,
  value,
  checked,
  indeterminate,
  onChange,
  htmlFor,
  children,
  ...props
}: IToggleProps) {
  return (
    <div>
      <input type='radio' className='toggle-switch' />
      <label>
        <span>sdfd</span>
        <span></span>
      </label>
    </div>
  )
}
