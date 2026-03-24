import { backArrow, editicon } from '@/assets';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairSchedules, updateRepairSchedule } from '@/redux/slices/repairScheduleSlice';
import { Spinner } from '@material-tailwind/react';
import { format } from 'date-fns';

const SehcudleManagement = ({ onBack, vehicle, selectedDate }) => {
    const dispatch = useDispatch();
    const { repairSchedules, loading } = useSelector((state) => state.repairSchedule);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [editingNotesId, setEditingNotesId] = useState(null);
    const [editingNotesText, setEditingNotesText] = useState('');

    // Extract busId from vehicle prop
    const busId = vehicle?.vehicleId 
        || vehicle?.VehicleId 
        || vehicle?.BusId 
        || vehicle?.busId 
        || vehicle?.id 
        || vehicle?.Id
        || vehicle?.ID;

    // Fetch repair schedules when component mounts or busId changes
    useEffect(() => {
        if (busId) {
            dispatch(fetchRepairSchedules(busId));
        } else {
            // If no busId, fetch all repair schedules
            dispatch(fetchRepairSchedules());
        }
    }, [dispatch, busId]);

    // Filter schedules by selected date if provided
    useEffect(() => {
        if (!repairSchedules || repairSchedules.length === 0) {
            setFilteredSchedules([]);
            return;
        }

        if (selectedDate) {
            const selectedDateStr = format(new Date(selectedDate), 'yyyy-MM-dd');
            const filtered = repairSchedules.filter((schedule) => {
                if (!schedule.repairDate) return false;
                const scheduleDate = format(new Date(schedule.repairDate), 'yyyy-MM-dd');
                return scheduleDate === selectedDateStr;
            });
            setFilteredSchedules(filtered);
        } else {
            setFilteredSchedules(repairSchedules);
        }
    }, [repairSchedules, selectedDate]);

    const handleStartNotesEdit = (item) => {
        setEditingNotesId(item.maintenanceId);
        setEditingNotesText(item.notes || '');
    };

    const handleCancelNotesEdit = () => {
        setEditingNotesId(null);
        setEditingNotesText('');
    };

    const handleSaveNotes = async (maintenanceId) => {
        const result = await dispatch(
            updateRepairSchedule({
                maintenanceId,
                payload: {
                    notes: editingNotesText || '',
                },
            })
        );

        if (updateRepairSchedule.fulfilled.match(result)) {
            if (busId) {
                dispatch(fetchRepairSchedules(busId));
            } else {
                dispatch(fetchRepairSchedules());
            }
            handleCancelNotesEdit();
        }
    };

    return (
        <section className=" bg-white w-full h-full">
            <div className="flex items-center mb-8 mt-8 gap-7 ms-4">
                <img src={backArrow} alt="Back" onClick={onBack} />
                <h1 className="text-xl font-bold">Scheduled Maintenance</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#EEEEEE]">
                            {['Repair/Service Description', 'P/N', 'Part Description', 'Qty', 'Vendor', 'Part Cost', 'Mileage', 'Estimated Completion', 'Terminal', 'Notes'].map((header, index) => (
                                <th key={index} className="p-2 text-left text-sm font-bold text-[#141516] border">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading.fetching ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center">
                                    <div className="flex justify-center items-center">
                                        <Spinner className="h-8 w-8 text-[#C01824]" />
                                        <span className="ml-3 text-gray-500">Loading scheduled maintenance...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredSchedules.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500">
                                    {selectedDate 
                                        ? `No scheduled maintenance found for ${format(new Date(selectedDate), 'MMM dd, yyyy')}`
                                        : "No scheduled maintenance found"
                                    }
                                </td>
                            </tr>
                        ) : (
                            filteredSchedules.map((item, index) => (
                                <tr key={item.maintenanceId || index} className="border-b">
                                    <td className="p-2 border">{item.serviceDesc || "N/A"}</td>
                                    <td className="p-2 border">{item.passNum || "N/A"}</td>
                                    <td className="p-2 border">{item.partDesc || "N/A"}</td>
                                    <td className="p-2 border">{item.quantity || "N/A"}</td>
                                    <td className="p-2 border">{item.vendor || "N/A"}</td>
                                    <td className="p-2 border">{item.partCost ? `$${item.partCost}` : "N/A"}</td>
                                    <td className="p-2 border">{item.mileage ? `${item.mileage}Km` : "N/A"}</td>
                                    <td className="p-2 border">{item.estimatedCompletionTime || "N/A"}</td>
                                    <td className="p-2 border">{item.terminal || "N/A"}</td>
                                    <td className="p-2 border">
                                        {editingNotesId === item.maintenanceId ? (
                                            <div className="flex flex-col gap-2">
                                                <textarea
                                                    value={editingNotesText}
                                                    onChange={(e) => setEditingNotesText(e.target.value)}
                                                    rows={3}
                                                    className="w-full rounded border border-[#D5D5D5] p-2 text-sm outline-none"
                                                    placeholder="Enter notes"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveNotes(item.maintenanceId)}
                                                        disabled={loading.updating}
                                                        className="rounded bg-[#C01824] px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                                                    >
                                                        {loading.updating ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelNotesEdit}
                                                        className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="mr-2 text-[#C01824] underline">
                                                    {item.notes || "See Notes"}
                                                </span>
                                                <img
                                                    src={editicon}
                                                    className="cursor-pointer"
                                                    alt="Edit Icon"
                                                    onClick={() => handleStartNotesEdit(item)}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default SehcudleManagement
