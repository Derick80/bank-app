import { Fragment } from 'react'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'

type Props = {
  className?: string
  isOpen: boolean
  handleClose: () => void
  children?: React.ReactNode
}

export const Dialog = ({
  isOpen,
  handleClose,
  className = '',
  children
}: Props) => (
  <Transition
    appear
    show={isOpen}
    as={Fragment}
    enter='ease-out duration-300'
    enterFrom='opacity-0'
    enterTo='opacity-100'
    leave='ease-in duration-200'
    leaveFrom='opacity-100'
    leaveTo='opacity-0'
  >
    <HeadlessDialog as='div' className='relative z-50' onClose={handleClose}>
      <div className='fixed inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center text-center'>
          <div className='min-h-screen px-4 text-center'>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </HeadlessDialog>
  </Transition>
)

//   < button
// aria - label='close dialog'
// className = 'aspect-squre absolute top-6 right-9 flex flex-col justify-center items-center space-y-2'
// onClick = { handleClose }
//   >
//   Close</ >
