import { calendar, DocumentTag } from '@/assets';
import { DriverProfile } from '@/data';
import { Button, Tab, Tabs, TabsBody, } from '@material-tailwind/react';
import { useState } from 'react';
import { IoEllipsisVertical } from "react-icons/io5";


const TrainingDocuments = () => {
    const [activeDriver, setActiveDriver] = useState(0);
    const [activeTab, setActiveTab] = useState("alldrivers");

    const documents = Array(2).fill().map((_, i) => ({
        id: i + 1,
        title: "Training # 01",
        date: 'May 30,2024',
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'..."
    }));
    return (
        <div className='w-full h-full flex flex-row gap-4 mt-4'>
            <div className='bg-white w-full md:max-w-[280px] pt-2 overflow-y-auto rounded-lg shadow-md'>
                <Tabs value={activeTab}>
                    <TabsBody className='pt-2'>
                        {DriverProfile.map(({ name, busNo, imgSrc, role }, index) => (
                            <div key={index}>
                                <Button
                                    onClick={() => setActiveDriver(index)}
                                    className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${activeDriver === index
                                        ? 'bg-[#C01824] text-white'
                                        : 'bg-white'
                                        }`}
                                >
                                    <img src={imgSrc} className="rounded-full w-[43px] h-[43px]" />
                                    <div className={`text-start text-base`}>
                                        <h6 className={`font-bold text-[16px] capitalize ${activeDriver === index ? 'text-white' : 'text-black'
                                            }`}>{name}</h6>
                                        <p className={`font-light text-[14px] ${activeDriver === index ? 'text-white' : 'text-black'
                                            }`}>
                                            BUS NO. <span className='font-bold'>{busNo}</span>
                                        </p>
                                    </div>
                                </Button>
                                <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                            </div>
                        ))}
                    </TabsBody>
                </Tabs>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 w-full">
                <div className="flex flex-col h-full gap-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-[#F5F5F5] p-4 rounded shadow-sm relative" style={{ height: '150px' }}>
                            <div className="absolute left-0 top-0 h-20 w-10 flex items-center justify-center">
                                <img src={DocumentTag} className='-translate-y-3' />
                            </div>
                            <div className="flex justify-between mb-2 ps-2 ml-6">
                                <div>
                                    <p className="text-sm font-medium">{doc.title}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={`rounded-full h-4 w-4`}>
                                            <img src={calendar} />
                                        </div>
                                        <span className="text-xs text-[#202224]">{doc.date}</span>
                                    </div>
                                </div>
                                <button className="text-black">
                                    <IoEllipsisVertical />
                                </button>
                            </div>
                            <p className="text-xs text-[#68696A] mt-3">{doc.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrainingDocuments