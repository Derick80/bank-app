export const siteLinks = [
  { name: 'Home', href: '/', icon_name: 'home' },
  { name: 'Income', href: '/incomes', icon_name: 'attach_money' },
  { name: 'Bills', href: '/expenses', icon_name: 'money_off' },
  { name: 'profile', href: '/profile', icon_name: 'info' },
  { name: 'Account', href: '/account', icon_name: 'person' }
]

export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <nav className='flex flex-col items-center justify-center md:flex-row md:justify-between'>
      {children}
    </nav>
  )
}
