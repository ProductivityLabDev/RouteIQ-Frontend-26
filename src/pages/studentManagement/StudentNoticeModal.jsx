import React from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon, noticeIcon } from '@/assets'

const StudentNoticeModal = ({ open, handleOpen, noticeState }) => {
    return (
        <div>
            {noticeState ?
                <Dialog className='py-6 rounded-[4px]' size='md' open={open} handler={handleOpen}>
                    <Card color="transparent" shadow={false}>
                        <div className='flex justify-between items-center px-5 border-b border-[#C2C2C2]'>
                            <div className='flex gap-6 items-center flex-row'>
                                <img src={noticeIcon} />
                                <Typography className='text-[21px] md:text-[21px] text-[#202224] font-bold'>
                                    Note
                                </Typography>
                            </div>
                            <Button
                                className='p-1'
                                variant="text"
                                onClick={handleOpen}
                            >
                                <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                            </Button>
                        </div>
                        <form className="md:mt-5 mb-2 md:max-w-screen-lg">
                            <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7 ps-8'>
                                <Typography className='text-[16px] md:text-[16px] text-[#2C2F32] font-[400]'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis volutpat penatibus nullam elementum pulvinar lectus cras tempus iaculis. Ut nascetur  nullam elementum pulvinar lectus cras tempus iaculis. Ut nascetur  nullam elementum pulvinar lectus cras tempus iaculis. Ut nascetur
                                </Typography>
                            </div>
                        </form>
                    </Card>
                </Dialog>
                :
                <Dialog className='px-7 py-6 rounded-[4px]' size='xs' open={open} handler={handleOpen}>
                    <Card color="transparent" shadow={false}>
                        <div className='flex justify-between items-center'>
                            <Typography className='text-[24px] md:text-[32px] text-[#202224] font-bold'>
                                Child Absence
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
                                    <input
                                        type='text'
                                        className="outline-none border border-[#808080] rounded-[6px] py-3 px-3 bg-[#fff] text-[#2C2F32]"
                                        disabled
                                        value='All Week'
                                    />
                                    <input
                                        type='text'
                                        className="outline-none border border-[#808080] rounded-[6px] py-3 px-3 bg-[#fff] text-[#2C2F32]"
                                        disabled
                                        value='All Week'
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 py-2'>
                                <Typography className='text-[18px] md:text-[18px] text-[#202224] font-bold'>
                                    Reason for Absence
                                </Typography>
                                <div className='flex flex-col w-[384px] h-[119px] bg-[#DDDDE1] items-center rounded-[4px] p-4'>
                                    <Typography className='text-[14px] md:text-[14px] text-[#202224] text-start font-bold'>
                                        Due to a severe illness, Mark was unable to attend school and was under medical care.
                                    </Typography>
                                </div>
                            </div>
                        </form>
                    </Card>
                </Dialog>
            }

        </div>
    )
}

export default StudentNoticeModal
