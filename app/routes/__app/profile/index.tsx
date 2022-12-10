import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getUserProfile } from '~/utils/profile.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthenticated(request)
  if (!user) throw redirect('/login')
  const userId = user.id
  const profile = await getUserProfile(user.id)
  return json({ profile, userId })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  console.log('data', data)

  return (
    <article className='mx-auto flex flex-col'>
      <h1 className='self-center font-bold uppercase underline'>Profile</h1>
      <div className='flex flex-row gap-3'>
        <p className='font-bold uppercase'>name:</p>{' '}
        <p className='italic'>
          {data.profile.firstName}, {data.profile.lastName}
        </p>
      </div>
      <div className='flex flex-row gap-5'>
        {' '}
        <p className='font-bold uppercase'>Bio:</p>
        {data.profile.bio}
      </div>
      <div className='h-40 md:h-60'>
        <img
          src={data.profile.avatarImage}
          alt='avatar'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='mt-2 flex justify-center'>
        {data.userId === data.profile.userId ? (
          <Link to={`/profile/${data.profile.id}`} className='btn-solid'>
            Edit
          </Link>
        ) : null}
      </div>
    </article>
  )
}
