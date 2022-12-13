import type { Profile } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData
} from '@remix-run/react'
import { useState } from 'react'
import invariant from 'tiny-invariant'
import FormField from '~/components/shared/form-field'
import { UploadMe } from '~/components/upload'
import { isAuthenticated } from '~/utils/auth/authenticator.server'
import { getUserProfile, updateUserProfile } from '~/utils/profile.server'

export type LoaderData = {
  profile: Partial<Profile>
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const profileId = params.id
  const user = await isAuthenticated(request)
  invariant(user, 'user is required')
  invariant(profileId, 'profileId is required')
  const profile = await getUserProfile(user.id)
  if (!profile) throw redirect('/profile/new')

  const data: LoaderData = {
    profile: profile
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const profileId = params.id
  invariant(profileId, 'profileId is required')
  const user = await isAuthenticated(request)
  invariant(user, 'user is required')
  const userId = user.id

  const formData = await request.formData()
  const firstName = formData.get('firstName')
  const lastName = formData.get('lastName')
  const bio = formData.get('bio')
  const avatarImage = formData.get('avatarImage')

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof bio !== 'string' ||
    typeof avatarImage !== 'string'
  ) {
    throw new Error('Invalid form data')
  }

  const fields = {
    firstName,
    lastName,
    bio,
    avatarImage,
    userId,
    id: profileId
  }

  await updateUserProfile(fields)
  return redirect(`/profile`)
  // todo: add error handling
}
export default function EditProfile() {
  const data = useLoaderData<LoaderData>()
  const fetcher = useFetcher()
  const actionData = useActionData()
  const [formData, setFormData] = useState({
    firstName: data.profile?.firstName,
    lastName: data.profile?.lastName,
    bio: data.profile?.bio,
    avatarImage: data.profile?.avatarImage
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    })
  }

  async function handleSubmit(event: {
    currentTarget:
      | FormData
      | HTMLFormElement
      | HTMLInputElement
      | HTMLButtonElement
      | URLSearchParams
      | { [name: string]: string }
      | null
  }) {
    function getUrl() {
      const imageUrl = fetcher.submit(event.currentTarget, { replace: true })
      if (typeof imageUrl !== 'string') throw new Error('Invalid image url')
      return imageUrl
    }
    const imageUrl = await getUrl()
    // const imageUrl = fetcher.submit(event.currentTarget, { replace: true }, )
    // when I just had const imageUrl = fetcher.submit(event.currentTarget, { replace: true }) I was getting a ide error that indicated that avatarImage in the setFormData setter was void and not going to work.  Using the below commented code did not work.
    // if (typeof imageUrl !== 'string') throw new Error('Invalid image url')

    // I solved this by creating the getUrl function above and returning the imageUrl
    setFormData({
      ...formData,
      avatarImage: imageUrl
    })
  }

  return (
    <article className='mx-auto h-full'>
      <Form method='post' className='my-5 flex flex-col gap-5'>
        <h1 className='self-center text-2xl font-semibold'>Edit Profile</h1>
        <div className='flex flex-row gap-5'>
          <div className='flex flex-col gap-2'>
            <input type='hidden' name='id' value={data.profile.id} />

            <FormField
              htmlFor='firstName'
              label='First Name'
              name='firstName'
              value={formData.firstName}
              onChange={(event) => handleInputChange(event, 'firstName')}
              error={actionData?.fieldErrors?.firstName}
            />

            <FormField
              htmlFor='lastName'
              label='Last Name'
              name='lastName'
              value={formData.lastName}
              onChange={(event) => handleInputChange(event, 'lastName')}
            />

            <FormField
              htmlFor='bio'
              type='textarea'
              label='Biography'
              name='bio'
              value={formData.bio}
              onChange={(event) => handleInputChange(event, 'bio')}
            />
            {actionData?.fieldErrors?.firstName && (
              <p>{actionData?.fieldErrors?.firstName}</p>
            )}

            {actionData?.fieldErrors?.lastName && (
              <p>{actionData?.fieldErrors?.lastName}</p>
            )}

            {actionData?.fieldErrors?.bio && (
              <p>{actionData?.fieldErrors?.bio}</p>
            )}
          </div>
          <>
            {fetcher.type === 'done' ? (
              <>
                <div className='h-40 md:h-60'>
                  <img
                    src={fetcher.data.imageUrl}
                    alt='avatar'
                    className='h-full w-full object-cover'
                  />
                </div>

                <input
                  type='hidden'
                  name='avatarImage'
                  value={fetcher.data.imageUrl}
                  onChange={handleSubmit}
                />
              </>
            ) : (
              <>
                <div className='h-40 md:h-60'>
                  <img
                    src={formData.avatarImage}
                    alt='avatar'
                    className='h-full w-full object-cover'
                  />
                </div>
              </>
            )}
          </>
        </div>

        <div className='flex flex-row items-center justify-center'>
          <button
            className='btn-base'
            type='submit'
            disabled={fetcher.state === 'submitting' ? true : false}
          >
            Submit
          </button>
        </div>
      </Form>
      <UploadMe onChange={handleSubmit} />
      <div className='flex flex-row-reverse items-center'></div>
    </article>
  )
}
