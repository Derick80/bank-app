export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className='flex w-full flex-col items-center p-2 md:flex-row md:p-4'>
      {children}
    </header>
  )
}
