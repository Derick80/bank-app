export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className='flex w-full flex-col items-center md:flex-row'>
      {children}
    </header>
  )
}
