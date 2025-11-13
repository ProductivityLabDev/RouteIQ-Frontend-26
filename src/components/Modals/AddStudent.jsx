import React, { useState } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
import axios from 'axios'

export function AddStudent({ open, handleOpen }) {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        pickupLocation: "" ,
        dropLocation: "",
        grade: "",
        emergencyContact: "",
        enrollmentNo: "",
        address: "",
        guardian1: "" ,
        guardian2: "" ,
        busNo: ""
    });

    const [submitting, setSubmitting] = useState(false);

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
                firstName: formData.firstName,
                lastName: formData.lastName,
                pickupLocation: formData.pickupLocation,
                dropLocation: formData.dropLocation,
                grade: formData.grade,
                emergencyContact: formData.emergencyContact,
                enrollmentNo: formData.enrollmentNo,
                address: formData.address,
                guardian1: formData.guardian1,
                guardian2: formData.guardian2,
                busNo: formData.busNo
            };

            console.log("📤 Sending payload:", payload);

            const res = await axios.post(`${BASE_URL}/institute/create-student`, payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Student created:", res.data);
            alert(res.data?.message || "Student created successfully!");

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                pickupLocation: "",
                dropLocation: "",
                grade: "",
                emergencyContact: "",
                enrollmentNo: "",
                address: "",
                guardian1: "",
                guardian2: "",
                busNo: ""
            });

            // Close modal
            handleOpen();
        } catch (err) {
            console.error("❌ Error creating student:", err.response?.data || err);
            alert(err.response?.data?.message || "Failed to create student. Please try again.");
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
                            Add New Student
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
                                    First Name
                                </Typography>
                                <input
                                    type='text'
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Pickup Location
                                </Typography>
                                <input
                                    type='text'
                                    name="pickupLocation"
                                    value={formData.pickupLocation}
                                    onChange={handleChange}
                                    placeholder="Pickup location"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Grade
                                </Typography>
                                <input
                                    type='text'
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    placeholder="Your grade"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Enrollment No
                                </Typography>
                                <input
                                    type="number"
                                    name="enrollmentNo"
                                    value={formData.enrollmentNo}
                                    onChange={handleChange}
                                    placeholder="Enrollment No."
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 1
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian1"
                                    value={formData.guardian1}
                                    onChange={handleChange}
                                    placeholder="Guardian one"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Bus No
                                </Typography>
                                <input
                                    type="text"
                                    name="busNo"
                                    value={formData.busNo}
                                    onChange={handleChange}
                                    placeholder="Bus number"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Last Name
                                </Typography>
                                <input
                                    type='text'
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Drop Location
                                </Typography>
                                <input
                                    type='text'
                                    name="dropLocation"
                                    value={formData.dropLocation}
                                    onChange={handleChange}
                                    placeholder="Drop location"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Emergency Contact
                                </Typography>
                                <input
                                    type='tel'
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Emergency contact"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Address
                                </Typography>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Address here"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 2
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian2"
                                    value={formData.guardian2}
                                    onChange={handleChange}
                                    placeholder="Guardian two"
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

