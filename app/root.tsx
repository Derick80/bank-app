import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'
import { Layout } from './components/shared/layout/layout'
import {
  NonFlashOfWrongThemeEls,
  Theme,
  ThemeProvider,
  useTheme
} from './lib/theme-provider'
import styles from './styles/app.css'
import { isAuthenticated } from './utils/auth/authenticator.server'
import { getThemeSession } from './utils/theme.server'
import { getUser } from './utils/users.server'
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: '私の銀行',
  viewport: 'width=device-width,initial-scale=1'
})
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export type LoaderData = {
  user: {
    id: string
    userName: string
    email: string
  } | null
  theme: Theme | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request)
  const user = await isAuthenticated(request)

  const data: LoaderData = {
    user,
    theme: themeSession.getTheme()
  }

  return data
}
function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </Layout>
  )
}
function App() {
  const data = useLoaderData<LoaderData>()
  const [theme] = useTheme()

  return (
    <html lang='en' className={`${theme}`}>
      <head>
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>

      <body className='h-screen bg-stone-100 text-black dark:bg-zinc-700 dark:text-white'>
        <LayoutWrapper />
      </body>
    </html>
  )
}
export default function AppWithThemeProvider() {
  const data = useLoaderData<LoaderData>()
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  )
}
