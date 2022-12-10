import { Outlet } from '@remix-run/react'
import { Layout } from '~/components/shared/layout/layout'

export default function Index() {
  return (
    <>
      <Outlet />
    </>
  )
}
