import { useFetcher } from '@remix-run/react'
import { useRef } from 'react'

export type UploadMeProps = {
  onChange: (event: {
    currentTarget:
      | FormData
      | HTMLFormElement
      | HTMLButtonElement
      | HTMLInputElement
      | URLSearchParams
      | { [name: string]: string }
      | null
  }) => any
}
export const UploadMe = ({ onChange }: UploadMeProps) => {
  const fetcher = useFetcher()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      <fetcher.Form
        method='post'
        action='/image'
        encType='multipart/form-data'
        onChange={(event) => {
          onChange(event)
          fetcher.submit(event.currentTarget, { replace: true })
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className='rounded-md bg-blue-400 p-2 font-bold uppercase'>
          Update Photo
          <input
            type='file'
            name='postImg'
            id='postImg'
            accept='image/*'
            ref={fileInputRef}
            className='hidden'
          />
        </div>
      </fetcher.Form>
    </>
  )
}
