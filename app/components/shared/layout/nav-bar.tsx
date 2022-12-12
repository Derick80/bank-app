export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className='flex w-full flex-col items-center md:flex-row p-2 md:p-4'>
      {children}
    </header>
  )
}
