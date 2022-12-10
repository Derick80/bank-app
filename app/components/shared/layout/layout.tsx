import React, { useState } from 'react'
import { Theme, useTheme } from '~/lib/theme-provider'
import ColorMode from '../color-mode'
import Footer from './footer'
import LinkMaker from './link-maker'
import NavBar, { siteLinks } from './nav-bar'
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

      <main className='flex h-full flex-col text-black dark:text-white'>
        {children}
      </main>
      <Footer />
    </>
  )
}

function NavLinks() {
  const [isActive, setIsActive] = useState(false)
  const toggle = () => setIsActive(!isActive)

  return (
    <nav>
      <ul className='flex space-x-5'>
        {siteLinks.map((link, index) => (
          <LinkMaker key={index} link={link} toggle={toggle} />
        ))}
      </ul>
    </nav>
  )
}
