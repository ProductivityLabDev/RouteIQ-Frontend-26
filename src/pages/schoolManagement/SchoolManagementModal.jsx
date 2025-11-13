import React, { useState, useEffect } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
import axios from 'axios'

export function SchoolManagementModal({ open, handleOpen, editInstitute }) {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

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

    const [submitting, setSubmitting] = useState(false);
    const [terminals, setTerminals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTerminals = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/terminals`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched terminals:", res.data);

                // ✅ Works for both cases: direct array or wrapped in `data`
                const terminalsArray = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.data)
                        ? res.data.data
                        : [];

                setTerminals(terminalsArray);
            } catch (err) {
                console.error("Error fetching terminals:", err);
                setTerminals([]);
            } finally {
                setLoading(false);
            }
        };

        if (open && token) {
            getTerminals();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                district: formData.district,
                president: formData.president,
                terminal: formData.terminal ? Number(formData.terminal) : null,
                principle: formData.principle,
                school: formData.school,
                totalStudent: formData.totalStudent ? Number(formData.totalStudent) : null,
                totalBuses: formData.totalBuses ? Number(formData.totalBuses) : null,
                contact: formData.contact,
                Address: formData.Address,
                Email: formData.Email,
                PhoneNo: formData.PhoneNo
            };

            console.log("📤 Sending payload:", payload);

            const res = await axios.post(`${BASE_URL}/institute/createinstituteInfo`, payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Institute created:", res.data);
            alert(res.data?.message || "School created successfully!");

            // Reset form
            setFormData({
                district: "",
                president: "",
                terminal: "",
                principle: "",
                school: "",
                totalStudent: "",
                totalBuses: "",
                contact: "",
                Address: "",
                Email: "",
                PhoneNo: ""
            });

            // Close modal
            handleOpen();
        } catch (err) {
            console.error("❌ Error creating institute:", err.response?.data || err);
            alert(err.response?.data?.message || "Failed to create school. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Dialog className='px-7 py-6 rounded-[4px]' open={open} handler={handleOpen}>
                <Card color="transparent" shadow={false}>
                    <div className='flex justify-between items-center'>
                        <Typography className='text-[24px] md:text-[32px] text-[#202224] font-bold'>
                            {editInstitute ? 'Edit Institute' : 'Add School'}
                        </Typography>
                        <Button
                            className='p-1'
                            variant="text"
                            onClick={handleOpen}
                        >
                            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                        </Button>
                    </div>
                    <form className="md:mt-5 mb-2 md:max-w-screen-lg" onSubmit={handleSubmit}>
                        <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    District
                                </Typography>
                                <input
                                    type='text'
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Terminal
                                </Typography>
                                <select
                                    name="terminal"
                                    value={formData.terminal}
                                    onChange={handleChange}
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                >
                                    <option value="">Select Terminal</option>
                                    {loading ? (
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
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    School Name
                                </Typography>
                                <input
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleChange}
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Total Buses
                                </Typography>
                                <input
                                    type="text"
                                    name="totalBuses"
                                    value={formData.totalBuses}
                                    onChange={handleChange}
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    School Address
                                </Typography>
                                <input
                                    type='text'
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Email
                                </Typography>
                                <input
                                    type='email'
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />

                            </div>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    President
                                </Typography>
                                <input
                                    type='text'
                                    name="president"
                                    value={formData.president}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Principle
                                </Typography>
                                <input
                                    type="text"
                                    name="principle"
                                    value={formData.principle}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Total Students
                                </Typography>
                                <input
                                    type='text'
                                    name="totalStudent"
                                    value={formData.totalStudent}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Contact No
                                </Typography>
                                <input
                                    type='number'
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />

                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Phone No
                                </Typography>
                                <input
                                    type='number'
                                    name="PhoneNo"
                                    value={formData.PhoneNo}
                                    onChange={handleChange}
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />

                            </div>

                        </div>
                        <div className='space-x-4 flex justify-end'>
                            <Button
                                type="button"
                                onClick={handleOpen}
                                className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]"
                                size='lg'
                                variant='outlined'
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]"
                                variant='filled'
                                size='lg'
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </div>
    )
}

