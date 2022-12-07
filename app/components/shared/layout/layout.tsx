import React, { useState } from 'react'
import Footer from './footer'
import LinkMaker from './link-maker'
import NavBar, { siteLinks } from './nav-bar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen flex-col bg-blue-400'>
      <NavBar>
        <NavLinks />
      </NavBar>

      <main className='flex h-full flex-row bg-red-300'>{children}</main>
      <Footer />
    </div>
  )
}

function NavLinks() {
  const [isActive, setIsActive] = useState(false)
  const toggle = () => setIsActive(!isActive)

  return (
    <ul className='flex'>
      {siteLinks.map((link, index) => (
        <LinkMaker key={index} link={link} toggle={toggle} />
      ))}
    </ul>
  )
}
