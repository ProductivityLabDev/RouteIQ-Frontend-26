import React, { useState, useEffect } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTerminals, createInstitute } from '@/redux/slices/schoolSlice'
import { toast } from 'react-hot-toast'

export function SchoolManagementModal({ open, handleOpen, editInstitute, editSchoolData, refreshSchools }) {
    const dispatch = useDispatch();
    const { terminals, loading, error } = useSelector((state) => state.schools);

    const [formData, setFormData] = useState({
        district: "",
        president: "",
        terminal: 0,
        principle: "",
        school: "",
        totalStudent: "",
        totalBuses: "",
        contact: "",
        Address: "",
        Email: "",
        PhoneNo: ""
    });

    useEffect(() => {
        if (open) {
            dispatch(fetchTerminals());
        }
    }, [open, dispatch]);

    // Populate form when editing
    useEffect(() => {
        if (editInstitute && editSchoolData) {
            setFormData({
                district: editSchoolData.district || "",
                president: editSchoolData.president || "",
                terminal: editSchoolData.terminal || 0,
                principle: editSchoolData.principle || "",
                school: editSchoolData.school || editSchoolData.name || "",
                totalStudent: editSchoolData.totalStudent || editSchoolData.totalStudents || "",
                totalBuses: editSchoolData.totalBuses || "",
                contact: editSchoolData.contact || "",
                Address: editSchoolData.Address || editSchoolData.address || "",
                Email: editSchoolData.Email || editSchoolData.email || "",
                PhoneNo: editSchoolData.PhoneNo || editSchoolData.phoneNo || ""
            });
        } else {
            // Reset form when opening for new school
            setFormData({
                district: "",
                president: "",
                terminal: 0,
                principle: "",
                school: "",
                totalStudent: "",
                totalBuses: "",
                contact: "",
                Address: "",
                Email: "",
                PhoneNo: ""
            });
        }
    }, [editInstitute, editSchoolData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await dispatch(createInstitute(formData));

            if (createInstitute.fulfilled.match(result)) {
                toast.success(result.payload?.message || "School created successfully!");
                
                // Reset form
                setFormData({
                    district: "",
                    president: "",
                    terminal: 0,
                    principle: "",
                    school: "",
                    totalStudent: "",
                    totalBuses: "",
                    contact: "",
                    Address: "",
                    Email: "",
                    PhoneNo: ""
                });

                // Refresh schools list if callback provided
                if (refreshSchools) {
                    await refreshSchools();
                }

                // Close modal
                handleOpen();
            } else {
                toast.error(result.payload || "Failed to create school. Please try again.");
            }
        } catch (err) {
            console.error("❌ Error creating institute:", err);
            toast.error(err.message || "Failed to create school. Please try again.");
        }
    };

    return (
        <div>
            <Dialog className='px-6 py-5' open={open} handler={handleOpen} size="lg">
                <Card color="transparent" shadow={false} className="max-w-5xl">
                    <div className='flex justify-between items-center mb-5 pb-3 border-b'>
                        <Typography className='text-xl font-bold text-gray-800'>
                            {editInstitute ? 'Edit Institute' : 'Add School'}
                        </Typography>
                        <Button
                            className='p-1 hover:bg-gray-100 rounded'
                            variant="text"
                            onClick={handleOpen}
                        >
                            <img src={closeicon} className='w-5 h-5' alt="Close" />
                        </Button>
                    </div>
                    <form className="mt-4 mb-2" onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        District
                                    </label>
                                    <input
                                        type='text'
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Terminal
                                    </label>
                                    <select
                                        name="terminal"
                                        value={formData.terminal}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    >
                                    <option value="">Select Terminal</option>
                                    {loading.terminals ? (
                                        <option className="text-gray-500">Loading...</option>
                                    ) : terminals.length > 0 ? (
                                            terminals.map((t) => (
                                                <option key={t.id} value={t.id} className="text-black">
                                                    {t.name} {t.code ? `(${t.code})` : ''}
                                                </option>
                                            ))
                                        ) : (
                                            <option>No terminals found</option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        School Name
                                    </label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Total Buses
                                    </label>
                                    <input
                                        type="text"
                                        name="totalBuses"
                                        value={formData.totalBuses}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        School Address
                                    </label>
                                    <input
                                        type='text'
                                        name="Address"
                                        value={formData.Address}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type='email'
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>

                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        President
                                    </label>
                                    <input
                                        type='text'
                                        name="president"
                                        value={formData.president}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Principle
                                    </label>
                                    <input
                                        type="text"
                                        name="principle"
                                        value={formData.principle}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Total Students
                                    </label>
                                    <input
                                        type='text'
                                        name="totalStudent"
                                        value={formData.totalStudent}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Contact No
                                    </label>
                                    <input
                                        type='number'
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Phone No
                                    </label>
                                    <input
                                        type='number'
                                        name="PhoneNo"
                                        value={formData.PhoneNo}
                                        onChange={handleChange}
                                        className="w-full outline-none border border-gray-300 rounded-md py-2 px-3 bg-gray-50 focus:bg-white focus:border-[#C01824] transition-all"
                                    />
                                </div>

                            </div>

                        </div>
                        <div className='flex justify-end gap-3 mt-6 pt-4 border-t'>
                            <Button
                                type="button"
                                onClick={handleOpen}
                                className="px-8 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                                size='lg'
                                variant='outlined'
                                disabled={loading.creating}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="px-8 py-2 bg-[#C01824] text-white font-medium rounded-md hover:bg-[#A01520]"
                                variant='filled'
                                size='lg'
                                disabled={loading.creating}
                            >
                                {loading.creating ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </div>
    )
}

