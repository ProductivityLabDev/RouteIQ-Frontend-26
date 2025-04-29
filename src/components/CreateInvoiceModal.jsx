import React from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
const CreateInvoiceModal = ({ open, handleOpen }) => {
    return (
        <div>
            <Dialog className='px-7 py-6 rounded-[4px]' open={open} handler={handleOpen}>
                <Card color="transparent" shadow={false}>
                    <div className='flex justify-between items-center'>
                        <Typography className='text-[24px] md:text-[32px] text-[#202224] font-bold'>
                            Create Invoice
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Select School/Company
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Enter pickup location"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 my-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    No of Buses
                                </Typography>
                                <input
                                    type='text'
                                    value="05"
                                    readOnly
                                    className="w-full outline-none border border-[#D5D5D5] my-3 rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Mode
                                </Typography>
                                <div className="flex items-center space-x-4 mt-7">
                                    <label className="flex items-center">
                                        <input type="radio" name="mode" className="mr-2 accent-[#C01824]" checked size={25} />
                                        <span className='font-[600] text-[#000]'>Monthly</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="mode" className="mr-2 accent-[#C01824]" />
                                        <span className='font-[600] text-[#000]'>Weekly</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Date
                                </Typography>
                                <input
                                    type='date'
                                    placeholder="Select date"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] py-3 my-3 px-3 bg-[#F5F6FA"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Type
                                </Typography>
                                <div className="flex items-center space-x-4 mt-7">
                                    <label className="flex items-center">
                                        <input type="radio" name="type" className="mr-2 accent-[#C01824]" checked />
                                        <span className='font-[600] text-[#000]'>School</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="type" className="mr-2 accent-[#C01824]" />
                                        <span className='font-[600] text-[#000]'>Trip</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Unit Price
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus no 1 Mileage
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus no 2 Mileage
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus no 3 Mileage
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus no 4 Mileage
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div>
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus no 5 Mileage
                                </Typography>
                                <input
                                    type='text'
                                    placeholder="Unit price"
                                    className="w-full outline-none border border-[#D5D5D5] rounded-[6px] my-3 py-3 px-3 bg-[#F5F6FA]"
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

export default CreateInvoiceModal
