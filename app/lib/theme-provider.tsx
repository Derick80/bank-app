import * as React from 'react'
import { useFetcher } from '@remix-run/react'
enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}
const themes: Array<Theme> = Object.values(Theme)

type ThemeContextType = [
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>
]

const prefersLightMQ = '(prefers-color-scheme: light)'

const getPreferredTheme = () =>
  window.matchMedia(prefersLightMQ).matches ? Theme.LIGHT : Theme.DARK

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
)
ThemeContext.displayName = 'ThemeContext'

function ThemeProvider({
  children,
  specifiedTheme
}: {
  children: React.ReactNode
  specifiedTheme: Theme | null
}) {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) return specifiedTheme
      else return null
    }
    if (typeof window !== 'object') return null
    return getPreferredTheme()
  })

  const persistTheme = useFetcher()
  const persistThemeRef = React.useRef(persistTheme)

  React.useEffect(() => {
    persistThemeRef.current = persistTheme
  }, [persistTheme])

  const mountRun = React.useRef(false)

  React.useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true
      return
    }
    if (!theme) {
      return
    }

    persistThemeRef.current.submit(
      { theme },
      { action: '/actions/set-theme', method: 'post' }
    )
  }, [theme])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(prefersLightMQ)
    const handleChange = () => {
      setTheme(mediaQuery.matches ? Theme.LIGHT : Theme.DARK)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
function Themed({
  dark,
  light,
  initialOnly = false
}: {
  dark: React.ReactNode | string
  light: React.ReactNode | string
  initialOnly?: boolean
}) {
  const [theme] = useTheme()
  const [initialTheme] = React.useState(theme)
  const themeToReference = initialOnly ? initialTheme : theme
  const serverRenderWithUnknownTheme = !theme && typeof window !== 'object'
  if (serverRenderWithUnknownTheme) {
    return (
      <>
        {React.createElement('dark-mode', null, dark)}
        {React.createElement('light-mode', null, light)}
      </>
    )
  } else {
    return <>{themeToReference === 'light' ? light : dark}</>
  }
}

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersLightMQ)}).matches
    ? 'light'
    : 'dark';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    console.warn(
      "Let me know if you see this message! Thankies.",
    );
  } else {
    cl.add(theme);
  }
  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  } else {
    console.warn(
      "Let me know if you see this message! Thankies.",
    );
  }
})();
`

function NonFlashOfWrongThemeEls({ ssrTheme }: { ssrTheme: boolean }) {
  const [theme] = useTheme()
  return (
    <>
      <meta
        name='color-scheme'
        content={theme === 'light' ? 'dark' : 'light'}
      />
      {ssrTheme ? null : (
        <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
      )}
    </>
  )
}

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme)
}

export {
  Theme,
  ThemeProvider,
  useTheme,
  Themed,
  NonFlashOfWrongThemeEls,
  isTheme
}
