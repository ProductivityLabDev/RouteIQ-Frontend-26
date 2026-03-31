import React, { useEffect, useMemo, useState } from 'react'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import { Button, Typography } from '@material-tailwind/react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
    createRepairSchedule,
    fetchRepairScheduleById,
    fetchRepairSchedules,
    updateRepairSchedule,
} from '@/redux/slices/repairScheduleSlice'
import { fetchTerminals } from '@/redux/slices/busesSlice'

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
    repairType: 'repair',
}

const hasAnyValue = (formData) =>
    Object.values(formData).some((value) => String(value || '').trim() !== '')

const requiredFieldLabels = {
    repairService: 'Repair/Service',
    partNumber: 'P/N',
    partCost: 'Part Cost',
    repairDate: 'Repair Date',
    vendor: 'Vendor',
    partDescription: 'Part Description',
    quantity: 'Qty',
    mileage: 'Mileage',
    estimatedCompletionTime: 'Estimated Completion Time',
    terminal: 'Terminal',
    repairType: 'Repair Type',
}

const validateRepairForm = (formData) => {
    for (const [field, label] of Object.entries(requiredFieldLabels)) {
        if (!String(formData[field] ?? '').trim()) {
            return `${label} is required`
        }
    }

    if (!/^\d+$/.test(String(formData.partNumber).trim()) || Number(formData.partNumber) <= 0) {
        return 'P/N must be a positive whole number'
    }

    if (!/^\d+$/.test(String(formData.quantity).trim()) || Number(formData.quantity) <= 0) {
        return 'Qty must be a positive whole number'
    }

    if (Number.isNaN(Number(formData.partCost)) || Number(formData.partCost) <= 0) {
        return 'Part Cost must be greater than 0'
    }

    if (Number.isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
        return 'Mileage must be 0 or greater'
    }

    return ''
}

const EditScheduledMaintenance = ({
    item,
    vehicle,
    onBack,
    scheduleRepair,
    setEditMode,
    setIsNavigate,
}) => {
    const dispatch = useDispatch()
    const { loading, currentRepairSchedule } = useSelector((state) => state.repairSchedule)
    const { terminals } = useSelector((state) => state.buses)
    const [formDataList, setFormDataList] = useState([emptyForm])

    const maintenanceId = item?.maintenanceId || item?.MaintenanceId || item?.id || item?.Id
    const busId = useMemo(
        () =>
            vehicle?.vehicleId ||
            vehicle?.VehicleId ||
            vehicle?.BusId ||
            vehicle?.busId ||
            vehicle?.id ||
            vehicle?.Id ||
            null,
        [vehicle]
    )

    const fallbackTerminal =
        vehicle?.terminal ||
        vehicle?.Terminal ||
        vehicle?.TerminalName ||
        vehicle?.assignedTerminal ||
        vehicle?.AssignedTerminal ||
        ''

    const handleChange = (e, index) => {
        const { name, value } = e.target
        const updatedForms = [...formDataList]
        updatedForms[index][name] = value
        setFormDataList(updatedForms)
    }

    const handleAddMore = () => {
        setFormDataList((prev) => [...prev, { ...emptyForm, terminal: fallbackTerminal }])
    }

    const buildPayload = (formData) => ({
        serviceDesc: formData.repairService || undefined,
        partDesc: formData.partDescription || undefined,
        passNum: formData.partNumber ? Number(formData.partNumber) : undefined,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        partCost: formData.partCost ? Number(formData.partCost) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        repairDate: formData.repairDate || undefined,
        estimatedCompletionTime: formData.estimatedCompletionTime || undefined,
        vendor: formData.vendor || undefined,
        terminal: formData.terminal || undefined,
        repairType: formData.repairType === 'maintenance' ? 2 : 1,
        notes: formData.notes || undefined,
    })

    const handleSubmit = async () => {
        const validForms = formDataList.filter(hasAnyValue)

        if (validForms.length === 0) {
            toast.error('Please fill at least one repair record')
            return
        }

        for (let index = 0; index < validForms.length; index += 1) {
            const validationError = validateRepairForm(validForms[index])
            if (validationError) {
                toast.error(`Record ${index + 1}: ${validationError}`)
                return
            }
        }

        try {
            if (scheduleRepair) {
                if (!busId) {
                    toast.error('Bus ID is required')
                    return
                }

                for (const formData of validForms) {
                    const result = await dispatch(
                        createRepairSchedule({
                            busId: Number(busId),
                            ...buildPayload(formData),
                        })
                    )

                    if (createRepairSchedule.rejected.match(result)) {
                        return
                    }
                }
            } else {
                if (!maintenanceId) {
                    toast.error('Maintenance ID not found')
                    return
                }

                const result = await dispatch(
                    updateRepairSchedule({
                        maintenanceId: Number(maintenanceId),
                        payload: buildPayload(validForms[0]),
                    })
                )

                if (updateRepairSchedule.rejected.match(result)) {
                    return
                }
            }

            if (busId) {
                dispatch(fetchRepairSchedules(busId))
            } else {
                dispatch(fetchRepairSchedules())
            }

            setEditMode(false)
            setIsNavigate(true)
        } catch (error) {
            console.error('Repair schedule submit error:', error)
        }
    }

    useEffect(() => {
        dispatch(fetchTerminals())
    }, [dispatch])

    useEffect(() => {
        if (scheduleRepair) {
            setFormDataList([{ ...emptyForm, terminal: fallbackTerminal }])
        }
    }, [scheduleRepair, fallbackTerminal])

    useEffect(() => {
        if (maintenanceId && !scheduleRepair) {
            dispatch(fetchRepairScheduleById(Number(maintenanceId)))
        }
    }, [dispatch, maintenanceId, scheduleRepair])

    useEffect(() => {
        if (!currentRepairSchedule || scheduleRepair) return

        setFormDataList([{
            repairType: currentRepairSchedule.repairType === 2 ? 'maintenance' : 'repair',
            repairService: currentRepairSchedule.serviceDesc || '',
            partNumber: currentRepairSchedule.passNum || '',
            partCost: currentRepairSchedule.partCost || '',
            repairDate: currentRepairSchedule.repairDate ? String(currentRepairSchedule.repairDate).split('T')[0] : '',
            vendor: currentRepairSchedule.vendor || '',
            partDescription: currentRepairSchedule.partDesc || '',
            quantity: currentRepairSchedule.quantity || '',
            mileage: currentRepairSchedule.mileage || '',
            estimatedCompletionTime: currentRepairSchedule.estimatedCompletionTime || '',
            terminal: currentRepairSchedule.terminal || fallbackTerminal || '',
            notes: currentRepairSchedule.notes || '',
        }])
    }, [currentRepairSchedule, scheduleRepair, fallbackTerminal])

    const terminalOptions = Array.isArray(terminals) ? terminals : []

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
                                <div className="mb-1 flex flex-col gap-5 w-full">
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Repair/Service <span className="text-[#C01824]">*</span>
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
                                        P/N <span className="text-[#C01824]">*</span>
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
                                        Part Cost <span className="text-[#C01824]">*</span>
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
                                        Repair Date <span className="text-[#C01824]">*</span>
                                    </Typography>
                                    <input
                                        type='date'
                                        name='repairDate'
                                        value={formData.repairDate}
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    />

                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Vendor <span className="text-[#C01824]">*</span>
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

                                <div className="mb-1 flex flex-col gap-5 w-full">
                                    <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                        Part Description <span className="text-[#C01824]">*</span>
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
                                        Qty <span className="text-[#C01824]">*</span>
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
                                        Mileage <span className="text-[#C01824]">*</span>
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
                                        Estimated Completion Time <span className="text-[#C01824]">*</span>
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
                                        Terminal <span className="text-[#C01824]">*</span>
                                    </Typography>
                                    <select
                                        name='terminal'
                                        value={formData.terminal}
                                        onChange={(e) => handleChange(e, index)}
                                        className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    >
                                        <option value="">Select terminal</option>
                                        {terminalOptions.map((terminal) => {
                                            const terminalId = terminal.TerminalId || terminal.id
                                            const terminalName = terminal.TerminalName || terminal.name || `Terminal ${terminalId}`
                                            return (
                                                <option key={terminalId} value={terminalName}>
                                                    {terminalName}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-1 mt-3 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Repair Type <span className="text-[#C01824]">*</span>
                                </Typography>
                                <select
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                    name="repairType"
                                    value={formData.repairType}
                                    onChange={(e) => handleChange(e, index)}
                                >
                                    <option value="repair">Repair</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>

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

                    <div className='space-x-4 flex justify-start mb-9'>
                        {scheduleRepair && (
                            <Button onClick={handleAddMore} type="button" className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                                Add More
                            </Button>
                        )}
                        <Button
                            onClick={handleSubmit}
                            type="button"
                            disabled={loading.creating || loading.updating || loading.fetchingById}
                            className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px] disabled:opacity-50"
                            variant='filled'
                            size='lg'
                        >
                            {loading.creating || loading.updating ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditScheduledMaintenance
