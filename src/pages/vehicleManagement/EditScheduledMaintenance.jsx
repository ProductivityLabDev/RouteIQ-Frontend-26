import React, { useEffect, useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Button, Typography } from '@material-tailwind/react'

const EditScheduledMaintenance = ({ item, onBack, scheduleRepair, handleAddMore, setEditMode, setIsNavigate }) => {
    const [formData, setFormData] = useState({
        repairService: '',
        partNumber: '',
        partCost: '',
        repairDate: '',
        vendor: '',
        partDescription: '',
        quantity: '',
        mileage: '',
        estimatedCompletionTime: '',
        terminal: '',
        notes: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        setEditMode(false)
        setIsNavigate(true)
        console.log('Form data submitted:', formData);
    };
    useEffect(() => {
        if (item) {
            setFormData({
                repairService: scheduleRepair ? '' : item.desc || '',
                partNumber: scheduleRepair ? '' : item.plateNumber || '',
                partCost: scheduleRepair ? '' : item.partCost || '',
                repairDate: scheduleRepair ? '' : item.repairDate || '',
                vendor: scheduleRepair ? '' : item.vendor || '',
                partDescription: scheduleRepair ? '' : item.partDesc || '',
                quantity: scheduleRepair ? '' : item.qty || '',
                mileage: scheduleRepair ? '' : item.mileage || '',
                estimatedCompletionTime: scheduleRepair ? '' : item.estimatedCompletion || '',
                terminal: scheduleRepair ? '' : item.terminal || '',
                notes: scheduleRepair ? '' : item.notes || ''
            });
        }
    }, [item]);
    return (
        <section className='w-full h-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader title={scheduleRepair ? 'Schedule Repair' : 'Edit Scheduled Maintenance'} icon={true} TextClassName='md:text-[22px]' className='ms-12' handleNavigate={onBack} />
                <form className="md:mt-5 mb-2 md:max-w-screen-lg ms-12">
                    <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                        <div className="mb-1 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Repair/Service
                            </Typography>
                            <input
                                type='text'
                                name='repairService'
                                value={formData.repairService}
                                placeholder='Enter repair/service description'
                                onChange={handleChange}
                                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                P/N
                            </Typography>
                            <input
                                type='number'
                                name='partNumber'
                                placeholder='Enter P/N'
                                value={formData.partNumber}
                                onChange={handleChange}
                                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Part Cost
                            </Typography>
                            <input
                                type="text"
                                name='partCost'
                                placeholder='Enter part cost'
                                value={formData.partCost}
                                onChange={handleChange}
                                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Repair Date
                            </Typography>
                            <input
                                type='date'
                                name='repairDate'
                                placeholder='Select date'
                                value={formData.repairDate}
                                onChange={handleChange}
                                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Vendor
                            </Typography>
                            <input
                                type='text'
                                name='vendor'
                                placeholder='Enter vendor'
                                value={formData.vendor}
                                onChange={handleChange}
                                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                        </div>
                        <div className="mb-1 flex flex-col gap-5 w-full">
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Part Description
                            </Typography>
                            <input
                                type='text'
                                name='partDescription'
                                value={formData.partDescription}
                                placeholder='Enter part description'
                                onChange={handleChange}
                                className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Qty
                            </Typography>
                            <input
                                type='number'
                                placeholder='Enter quantity'
                                name='quantity'
                                value={formData.quantity}
                                onChange={handleChange}
                                className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Mileage
                            </Typography>
                            <input
                                type="text"
                                name='mileage'
                                placeholder='Enter mileage'
                                value={formData.mileage}
                                onChange={handleChange}
                                className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Estimated Completion Time
                            </Typography>
                            <input
                                type="text"
                                name='estimatedCompletionTime'
                                placeholder='Enter completion time'
                                value={formData.estimatedCompletionTime}
                                onChange={handleChange}
                                className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                            <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                Terminal
                            </Typography>
                            <input
                                type="text"
                                name='terminal'
                                value={formData.terminal}
                                placeholder='Enter terminal'
                                onChange={handleChange}
                                className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                            />
                        </div>
                    </div>
                    <div className="mb-1 flex flex-col gap-5 w-full h-[19vh]">
                        <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                            Notes
                        </Typography>
                        <textarea
                            type="text"
                            placeholder='Type Notes'
                            name='notes'
                            value={formData.notes}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] h-[16vh]"
                        />
                    </div>
                    <div className='space-x-4 flex justify-start mb-9'>
                        {scheduleRepair && (
                            <Button onClick={handleAddMore} className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                                Add More
                            </Button>
                        )}
                        <Button onClick={scheduleRepair ? handleAddMore : handleSubmit} className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditScheduledMaintenance
