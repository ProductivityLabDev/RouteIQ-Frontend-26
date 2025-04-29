import { closeicon, pinicon } from '@/assets'
import { Button, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react'
import React from 'react'

export function Note({ open, handleOpen }) {

  return (
    <div>
      <Dialog className='rounded-[4px]' open={open} handler={handleOpen}>
        <div className='flex justify-between items-center border-b-2 border-gray-300 px-5'>
          <div className='flex items-center'>
            <img src={pinicon} className='w-[19px] h-[19px]' alt="not found" />
            <DialogHeader className='text-[21px] font-bold'>Note</DialogHeader>
          </div>
          <Button
            className='p-1'
            variant="text"
            onClick={handleOpen}
          >
            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
          </Button>
        </div>
        <DialogBody className='font-normal text-[#2C2F32] text-[16px] px-5'>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
        </DialogBody>
      </Dialog>
    </div>
  )
}
