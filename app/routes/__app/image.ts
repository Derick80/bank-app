import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { cloudUpload } from '~/utils/cloudinary.server'

export const action: ActionFunction = async ({ request }) => {
  const imageUrl = await cloudUpload(request)
  console.log('imageUrl', imageUrl)

  return json({ imageUrl })
}
