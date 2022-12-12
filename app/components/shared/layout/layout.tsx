import { Form, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import { Theme, useTheme } from '~/lib/theme-provider'
import { LoaderData } from '~/routes/__app/profile/$id'
import { useOptionalUser, useUser } from '~/utils/utils'
import ColorMode from '../color-mode'
import Footer from './footer'
import LinkMaker from './link-maker'
import { UserLog } from './logInOut'
import NavBar from './nav-bar'
import SiteLogo from './site-logo'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar>
        <SiteLogo />
        <NavLinks />
        <SiteActions />
      </NavBar>

      <main className='overflow flex h-full w-full flex-col place-items-center text-black dark:text-white'>
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
    <nav className='flex basis-1/2 items-center justify-center '>
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
      {user ? (
        <>
          <ul>
            <li></li>
          </ul>
        </>
      ) : (
        <></>
      )}
    </nav>
  )
}

function SiteActions() {
  const user = useOptionalUser()
  const [theme, setTheme] = useTheme()

  function toggleTheme() {
    setTheme((prevTheme: any) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )

    console.log('theme', theme)
  }
  return (
    <ul className='flex basis-1/4 items-center justify-end space-x-5'>
      {user ? (
        <>
          <ColorMode
            onThemedChange={toggleTheme}
            currentTheme={theme}
            className=''
          />
          <LinkMaker
            link={{ name: 'Account', href: '/account', icon_name: 'person' }}
          />
          <li className='flex items-center'>
            <Form method='post' action='actions/logout'>
              <button className='btn btn-primary flex flex-col' type='submit'>
                <span className='material-symbols-outlined'>logout</span>
                Logout
              </button>
            </Form>
          </li>
        </>
      ) : (
        <>
          <ColorMode
            onThemedChange={toggleTheme}
            currentTheme={theme}
            className=''
          />
          {siteActions.map((link, index) => (
            <LinkMaker key={index} link={link} />
          ))}
        </>
      )}
    </ul>
  )
}
export const siteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'About', href: '/about', icon_name: 'info' }
]

export const siteActions = [
  { name: 'Account', href: '/account', icon_name: 'person' },
  { name: 'Login', href: '/auth/login', icon_name: 'login' },
  { name: 'Register', href: '/auth/register', icon_name: 'person_add' }
]
export const userSiteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'Income', href: '/incomes', icon_name: 'attach_money' },
  { name: 'Bills', href: '/expenses', icon_name: 'money_off' },
  { name: 'profile', href: '/profile', icon_name: 'info' }
]
