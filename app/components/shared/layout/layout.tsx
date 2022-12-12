import { Form, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import { Theme, Themed, useTheme } from '~/lib/theme-provider'
import { LoaderData } from '~/routes/__app/profile/$id'
import { useOptionalUser, useUser } from '~/utils/utils'
import ColorMode from '../color-mode'
import Footer from './footer'
import LinkMaker from './link-maker'
import NavBar from './nav-bar'
import SiteLogo from './site-logo'
import clsx from 'clsx'
import { MoonIcon, SunIcon } from '../icons'
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

  }
  return (
    <ul className='flex basis-1/4 items-center justify-end space-x-5'>
      {user ? (
        <>

                 <div
          className='noscript-hidden lg:block'>
            <DarkModeToggle

            />
          </div>
          <LinkMaker
            link={{ name: 'Preferences', href: '/preferences', icon_name: 'account_circle' }}
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
         <DarkModeToggle
          />
          {siteActions.map((link, index) => (
            <LinkMaker key={index} link={link} />
          ))}
        </>
      )}
    </ul>
  )
}

const iconTransformOrigin = {transformOrigin:'50% 100px'}

function DarkModeToggle ({ variant = 'icon' }: { variant?: 'icon' | 'labelled' }){
  const [, setTheme] = useTheme()
  return(
            <>
      <button
        onClick={ () =>setTheme((prevTheme => prevTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK))}

        className={ clsx(
          'border-black dark:border-white hover:border-primary focus:border-primary inline-flex h-14 items-center justify-center overflow-hidden rounded-full border-2 p-1 transition focus:outline-none',
          {
            'w-14': variant === 'icon',
            'px-8': variant === 'labelled',
          },
        ) }

    >
        {/* note that the duration is longer then the one on body, controlling the bg-color */ }
        <div className="relative h-8 w-8">
          <span
            className="absolute inset-0 rotate-90 transform text-black transition duration-1000 motion-reduce:duration-[0s] dark:rotate-0 dark:text-sky-400"
            style={ iconTransformOrigin }
          >
            <MoonIcon />
          </span>
          <span
            className="absolute inset-0 rotate-0 transform text-yellow-400 transition duration-1000 motion-reduce:duration-[0s] dark:-rotate-90 dark:text-white"
            style={ iconTransformOrigin }
          >
            <SunIcon />
          </span>
        </div>
        <span
          className={ clsx('ml-4 text-black dark:text-white', {
            'sr-only': variant === 'icon',
          }) }
        > <Themed dark="switch to light mode" light="switch to dark mode" />
        </span>


    </button>
    </>
  )
}

export const siteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
]

export const siteActions = [
  { name: 'Login', href: '/auth/login', icon_name: 'login' },
  { name: 'Register', href: '/auth/register', icon_name: 'person_add' }
]
export const userSiteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'Income', href: '/incomes', icon_name: 'attach_money' },
  { name: 'Bills', href: '/expenses', icon_name: 'money_off' },
  { name: 'profile', href: '/profile', icon_name: 'person' }
]
