import React from 'react'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { closeicon } from '@/assets';

export function Delete({ open, handleOpen }) {
    return (

        <Dialog className='text-center md:py-5 rounded-[4px]' open={open} handler={handleOpen}>
            <Button
                className='flex justify-end items-end w-full p-0 hover:bg-white bg-white pr-6'
                onClick={handleOpen}
            >
                <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
            </Button>
            <DialogHeader className='flex justify-center items-center font-bold text-[#43425D] md:text-[32px]'>Are you sure?</DialogHeader>
            <DialogBody className='p-0 mx-auto md:text-[20px] text-[#4D4F5C] font-normal md:w-2/3 text-balance'>
                Are you sure you want to delete this record? This process cannot be undone.
            </DialogBody>
            <DialogFooter className='space-x-2 md:space-x-4 flex justify-center mt-5'>
                <Button
                    size='lg'
                    variant='outlined'
                    onClick={handleOpen}
                    className="md:px-16 rounded-[4px] border py-2.5 border-[#C01824] text-[#C01824] capitalize text-[20px]"
                >
                    <span>Cancel</span>
                </Button>
                <Button className='md:px-16 rounded-[4px] bg-[#C01824] py-2.5 capitalize text-[20px]' onClick={handleOpen} variant='filled' size='lg'>
                    <span>Delete</span>
                </Button>
            </DialogFooter>
        </Dialog>
    )
}
