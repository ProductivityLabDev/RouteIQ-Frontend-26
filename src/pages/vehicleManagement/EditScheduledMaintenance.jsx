import React, { useEffect, useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Button, Typography } from '@material-tailwind/react'

const EditScheduledMaintenance = ({ item, onBack, scheduleRepair, setEditMode, setIsNavigate }) => {
    const emptyForm = {
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
        notes: '',
        repairType: ''
    }

    const [formDataList, setFormDataList] = useState([emptyForm])

    // 🔹 Handle input change for a specific form
    const handleChange = (e, index) => {
        const { name, value } = e.target
        const updatedForms = [...formDataList]
        updatedForms[index][name] = value
        setFormDataList(updatedForms)
    }

    // 🔹 Add new blank form
    const handleAddMore = () => {
        setFormDataList([...formDataList, { ...emptyForm }])
    }

    // 🔹 Submit all forms
    const handleSubmit = () => {
        setEditMode(false)
        setIsNavigate(true)
        console.log('Form data submitted:', formDataList)
    }

    // 🔹 Prefill when editing existing item (only first form gets populated)
    useEffect(() => {
        if (item && !scheduleRepair) {
            setFormDataList([{
                repairType: item.repairType || "repair",
                repairService: item.desc || '',
                partNumber: item.plateNumber || '',
                partCost: item.partCost || '',
                repairDate: item.repairDate || '',
                vendor: item.vendor || '',
                partDescription: item.partDesc || '',
                quantity: item.qty || '',
                mileage: item.mileage || '',
                estimatedCompletionTime: item.estimatedCompletion || '',
                terminal: item.terminal || '',
                notes: item.notes || ''
            }])
        }
    }, [item, scheduleRepair])

    return (
        <section className='w-full'>
            <div className='bg-white w-full rounded-[4px] border shadow-sm h-full'>
                <VendorDashboardHeader 
                    title={scheduleRepair ? 'Schedule Repair' : 'Edit Scheduled Maintenance'} 
                    icon={true} 
                    TextClassName='md:text-[22px]' 
                    className='ms-12' 
                    handleNavigate={onBack} 
                />

                <form className="md:mt-5 mb-2 md:max-w-screen-lg ms-12">

                    {formDataList.map((formData, index) => (
                        <div key={index} className="mb-8 p-4 border rounded-md shadow-sm bg-[#FAFAFA]">
                            <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                                {/* Left Column */}
                                <div className="mb-1 flex flex-col gap-5 w-full">
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Repair/Service
                                    </Typography>
                                    <input
                                        type='text'
                                        name='repairService'
                                        value={formData.repairService}
                                        placeholder='Enter repair/service description'
                                        onChange={(e) => handleChange(e, index)}
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
                                        onChange={(e) => handleChange(e, index)}
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
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Repair Date
                                    </Typography>
                                    <input
                                        type='date'
                                        name='repairDate'
                                        value={formData.repairDate}
                                        onChange={(e) => handleChange(e, index)}
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
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                </div>

                                {/* Right Column */}
                                <div className="mb-1 flex flex-col gap-5 w-full">
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Part Description
                                    </Typography>
                                    <input
                                        type='text'
                                        name='partDescription'
                                        value={formData.partDescription}
                                        placeholder='Enter part description'
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Qty
                                    </Typography>
                                    <input
                                        type='number'
                                        name='quantity'
                                        placeholder='Enter quantity'
                                        value={formData.quantity}
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Mileage
                                    </Typography>
                                    <input
                                        type="text"
                                        name='mileage'
                                        placeholder='Enter mileage'
                                        value={formData.mileage}
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Estimated Completion Time
                                    </Typography>
                                    <input
                                        type="text"
                                        name='estimatedCompletionTime'
                                        placeholder='Enter completion time'
                                        value={formData.estimatedCompletionTime}
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Terminal
                                    </Typography>
                                    <input
                                        type="text"
                                        name='terminal'
                                        value={formData.terminal}
                                        placeholder='Enter terminal'
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-1 mt-3 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Repair Type
                                </Typography>
                                <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]" name="repairType" id="repairType" onChange={(e) => handleChange(e, index)}>
                                    <option selected={formData.repairType == 'repair' ? true : false} value="repair">Repair</option>
                                    <option selected={formData.repairType == 'maintenance' ? true : false} value="maintenance">Maintenance</option>
                                </select>
                                {/* <textarea
                                    name='notes'
                                    value={formData.notes}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder='Type Notes'
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] h-[16vh]"
                                /> */}
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Notes
                                </Typography>
                                <textarea
                                    name='notes'
                                    value={formData.notes}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder='Type Notes'
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] h-[16vh]"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Buttons */}
                    <div className='space-x-4 flex justify-start mb-9'>
                        {scheduleRepair && (
                            <Button onClick={handleAddMore} type="button" className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                                Add More
                            </Button>
                        )}
                        <Button onClick={handleSubmit} type="button" className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditScheduledMaintenance
