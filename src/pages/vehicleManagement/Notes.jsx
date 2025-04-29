import React from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Typography } from '@material-tailwind/react'
import ButtonComponent from '@/components/buttons/CustomButton'

const Notes = ({ item, onBack, handleSeeMoreInfoClick }) => {
    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-[97vh]'>
                <VendorDashboardHeader title='Notes' TextClassName='md:text-[22px]' className='ms-12' icon={true} handleNavigate={onBack} />
                <div className='flex flex-row w-[97%] h-[23vh] justify-between h-[33vh] m-5 border-b-2 border-[#d3d3d3]'>
                    <div className='flex flex-row w-[60%] h-[23vh] gap-[59px]'>
                        <img src={item?.vehiclImg} />
                        <div className='flex flex-col h-full w-[65%] gap-[13px]'>
                            <Typography className="mb-2 text-start font-extrabold text-[19px] text-black">
                                {item?.vehicleName}
                            </Typography>
                            <div className='flex flex-row gap-[85px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Bus type
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    School Bus
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[50px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Vehicle Make
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Minotour
                                </Typography>
                            </div>
                            <div className='flex flex-row gap-[45px]'>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    Number Plate
                                </Typography>
                                <Typography className="mb-2 text-center font-bold text-[16px] text-black">
                                    112200
                                </Typography>
                            </div>
                            <ButtonComponent sx={{ width: '145px', height: '42px', fontSize: '13px' }} label='See more Info' Icon={false} onClick={() => handleSeeMoreInfoClick(item)} />
                        </div>
                    </div>
                </div>
                {/* ------------------- Notes Input ------------------- */}
                <div className="mb-1 flex flex-col gap-5 w-[95%] h-[19vh] ps-12 mt-5">
                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                        Notes
                    </Typography>
                    <textarea
                        type="text"
                        placeholder={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`}
                        name='notes'
                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] h-[16vh] placeholder-[#000]"
                    />
                </div>
            </div>
        </section>
    )
}

export default Notes
