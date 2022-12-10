import { useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import { Theme, useTheme } from '~/lib/theme-provider'
import { LoaderData } from '~/routes/__app/profile/$id'
import { useOptionalUser, useUser } from '~/utils/utils'
import ColorMode from '../color-mode'
import Footer from './footer'
import LinkMaker from './link-maker'
import NavBar from './nav-bar'
import SiteLogo from './site-logo'

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useTheme()

  function toggleTheme() {
    setTheme((prevTheme: any) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )

    console.log('theme', theme)
  }
  return (
    <>
      <NavBar>
        <SiteLogo />
        <NavLinks />
        <ColorMode
          onThemedChange={toggleTheme}
          currentTheme={theme}
          className='absolute top-0 right-0 flex basis-1/3 p-2 md:relative md:justify-center'
        />
      </NavBar>

      <main className='flex h-full w-full flex-col place-items-center text-black dark:text-white'>
        {children}
      </main>
      <Footer />
    </>
  )
}

function NavLinks() {
  const [isActive, setIsActive] = useState(false)
  const toggle = () => setIsActive(!isActive)
  const user = useOptionalUser()

  return (
    <nav>
      <ul className='flex space-x-5'>
        {user ? (
          <>
            {userSiteLinks.map((link, index) => (
              <LinkMaker key={index} link={link} toggle={toggle} />
            ))}
          </>
        ) : (
          <>
            {siteLinks.map((link, index) => (
              <LinkMaker key={index} link={link} toggle={toggle} />
            ))}
          </>
        )}
      </ul>
    </nav>
  )
}
export const siteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'About', href: '/about', icon_name: 'attach_money' },
  { name: 'Login', href: '/auth/login', icon_name: 'login' }
]
export const userSiteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'Income', href: '/dashboard/incomes', icon_name: 'attach_money' },
  { name: 'Bills', href: '/dashboard/expenses', icon_name: 'money_off' },
  { name: 'profile', href: '/profile', icon_name: 'info' },
  { name: 'Account', href: '/account', icon_name: 'person' },
  { name: 'Logout', href: '/auth/logout', icon_name: 'logout' }
]
