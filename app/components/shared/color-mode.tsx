import { Theme } from '~/lib/theme-provider'

export type ColorModeProps = {
  currentTheme: Theme | null
  onThemedChange?: () => void
  className?: string
}

export default function ColorMode({
  currentTheme,
  onThemedChange,
  className
}: ColorModeProps) {
  return (
    <div className={className}>
      {currentTheme === Theme.DARK ? (
        <>
          <button onClick={onThemedChange}>
            <span className='material-symbols-outlined underline'>
              dark_mode
            </span>{' '}
          </button>
        </>
      ) : (
        <>
          <button onClick={onThemedChange}>
            <span className='material-symbols-outlined underline'>
              light_mode
            </span>
          </button>
        </>
      )}
    </div>
  )
}
