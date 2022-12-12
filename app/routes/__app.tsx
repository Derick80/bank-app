import { Outlet } from '@remix-run/react'

export default function indexRoute() {
  return (
    <>
      <Outlet />
    </>
  )
}
