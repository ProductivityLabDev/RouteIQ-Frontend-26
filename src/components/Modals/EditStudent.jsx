import React, { useEffect, useState } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
import { schoolService } from '@/services/schoolService'

export function EditStudent({ open, handleOpen, student, onSaved, instituteId = 1 }) {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        grade: "",
        emergencyContact: "",
        enrollmentNo: "",
        address: "",
        guardian1: "",
        guardian2: "",
    });

    useEffect(() => {
        if (!student) return;
        setForm({
            firstName: student.name || "",
            lastName: student.lastname || "",
            grade: student.grade || "",
            emergencyContact: student.contact || "",
            enrollmentNo: student.enrollment || "",
            address: student.address || "",
            guardian1: student.guardian1 || "",
            guardian2: student.guardian2 || "",
        });
    }, [student]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student?.id) return;
        try {
            setSubmitting(true);
            await schoolService.updateStudent(instituteId, student.id, {
                firstName: form.firstName,
                lastName: form.lastName,
                grade: form.grade,
                emergencyContact: form.emergencyContact,
                enrollmentNo: form.enrollmentNo,
                address: form.address,
                guardian1: form.guardian1,
                guardian2: form.guardian2,
            });
            if (typeof onSaved === "function") onSaved();
            handleOpen();
        } catch (err) {
            console.error("Failed to update student:", err);
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
                            Edit Student
                        </Typography>
                        <Button
                            className='p-1'
                            variant="text"
                            onClick={handleOpen}
                        >
                            <img src={closeicon} className='w-[17px] h-[17px]' alt="" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="md:mt-5 mb-2 md:max-w-screen-lg">
                        <div className='flex justify-between md:flex-nowrap flex-wrap md:space-x-7'>
                            <div className="mb-1 flex flex-col gap-5 w-full">
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    First Name
                                </Typography>
                                <input
                                    type='text'
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={onChange}
                                    placeholder="Name"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Grade
                                </Typography>
                                <input
                                    type='text'
                                    name="grade"
                                    value={form.grade}
                                    onChange={onChange}
                                    placeholder="Your grade"
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Enrollment No
                                </Typography>
                                <input
                                    type="text"
                                    name="enrollmentNo"
                                    value={form.enrollmentNo}
                                    onChange={onChange}
                                    placeholder="Enrollment No."
                                    className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 1
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian1"
                                    value={form.guardian1}
                                    onChange={onChange}
                                    placeholder="Guardian one"
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
                                    value={form.lastName}
                                    onChange={onChange}
                                    placeholder="Last Name"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Emergency Contact
                                </Typography>
                                <input
                                    type='tel'
                                    name="emergencyContact"
                                    value={form.emergencyContact}
                                    onChange={onChange}
                                    placeholder="Emergency contact"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Address
                                </Typography>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={onChange}
                                    placeholder="Address here"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                                <Typography variant="paragraph" className="-mb-3 text-[#2C2F32] text-[14px] font-bold">
                                    Guardian 2
                                </Typography>
                                <input
                                    type="text"
                                    name="guardian2"
                                    value={form.guardian2}
                                    onChange={onChange}
                                    placeholder="Guardian two"
                                    className=" outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                                />
                            </div>
                        </div>
                        <div className='space-x-4 flex justify-end'>
                            <Button onClick={handleOpen} className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]" size='lg' variant='outlined'>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting} className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant='filled' size='lg'>
                                {submitting ? "Saving..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </Dialog>
        </div>
    )
}

