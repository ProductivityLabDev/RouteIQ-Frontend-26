import React from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'

export function EditDriver({ open, handleOpen }) {
    return (
        <div>
            <Dialog className='px-7 py-6 rounded-[4px]' open={open} handler={handleOpen}>
                <Card color="transparent" shadow={false}>
                    <div className='flex justify-between items-center'>
                        <Typography className='text-[24px] md:text-[32px] text-[#202224] font-bold'>
                            Edit Driver
                        </Typography>
                        <Button
                            className='p-1'
                            variant="text"
                            onClick={handleOpen}
                        >
                            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                        </Button>
                    </div>
                    <form className="md:mt-5 mb-2 md:max-w-screen-lg">
                        <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    First Name
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Name"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Phone Number
                                </Typography>
                                <input
                                    type='number'
                                    placeholder="Your Phone Number"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Emergency Contact 1
                                </Typography>
                                <input
                                    type="tel"
                                    placeholder="Emergency Contact 1"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Last Name
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Last Name"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Email
                                </Typography>
                                <input
                                    type="email"
                                    placeholder="Address here"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Emergency Contact 2
                                </Typography>
                                <input
                                    type='tel'
                                    placeholder="Emergency Contact 2"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />

                            </div>
                        </div>
                        <div className='space-x-4 flex justify-end'>
                            <Button onClick={handleOpen} className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]" size='lg' variant='outlined'>
                                Cancel
                            </Button>
                            <Button onClick={handleOpen} className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </div>
    )
}

