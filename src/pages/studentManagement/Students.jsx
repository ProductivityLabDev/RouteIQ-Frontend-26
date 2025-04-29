import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Typography } from '@material-tailwind/react'
import { FaEllipsisVertical } from "react-icons/fa6";
import { studentData } from '@/data/vendor-students-data';
import { NoteIcon } from '@/assets';
import MenuComponent from '@/components/MenuComponent';
import { StudentManagementModal } from './StudentManagementModal';
import StudentNoticeModal from './StudentNoticeModal';

const Students = () => {
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [openStudentModal, setOpenStudentModal] = useState(false);
    const [openStudentNoticeModal, setOpenStudentNoticeModal] = useState(false);
    const [editStudentModal, setStudentModal] = useState(false)
    const [noticeState, setNoticeState] = useState(false)
    const [studentEditData, setStudentEditData] = useState(null)
    const openInfraction = Boolean(anchorEl1);
    const handleClick = (event, student) => {
        setAnchorEl1(event.currentTarget);
        setStudentEditData(student)
    };

    const handleClose = (callback) => {
        setAnchorEl1(null);
        if (callback) {
            callback();
        }
    };
    const handleStudentModal = () => {
        setStudentModal(false)
        setOpenStudentModal(!openStudentModal)
        setStudentEditData(null)

    }
    const handleOpenEditStudentModal = () => {
        setOpenStudentModal(!openStudentModal)
        setStudentModal(true)
    }
    const handleStudentNoticeModal = () => {
        setOpenStudentNoticeModal(!openStudentNoticeModal)
        setNoticeState(false)
        setStudentEditData(null)

    }
    const handleNotice = () => {
        setOpenStudentNoticeModal(!openStudentNoticeModal)
        setNoticeState(true)
    }
    const menuItems = [
        { label: 'Edit', onClick: handleOpenEditStudentModal },
    ];
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className="flex w-[96%] justify-between flex-row h-[65px] mb-3 items-center">
                    <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>Students</Typography>
                    <div className='flex justify-end gap-12 flex-row'>
                        <Button className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' onClick={handleStudentModal}>
                            Add Student
                        </Button>
                        <Button className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg'>
                            Import File
                        </Button>
                    </div>
                </div>
                {/* -------------------------------------------------- Students Table ----------------------------------------------- */}
                <div className="w-full p-4 bg-white rounded-[4px] border shadow-sm h-[80vh]">
                    <div className="overflow-x-auto mt-3 border border-gray-200 rounded h-[75vh]">
                        <table className="min-w-full">
                            <thead className="bg-[#EEEEEE] items-center self-center">
                                <tr>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Bus No
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Grade
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Emergency Contact
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Enrollment
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Address
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Note
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Attendance Status
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Child Absence
                                    </th>
                                    <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.map((student, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516] flex flex-row items-center gap-2">
                                            <img src={student?.studentPic} />
                                            {student.studentName}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {student.busNo}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {student.Grade}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {student.emergencyContact}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {student.enrollment}
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            {student.address}
                                        </td>
                                        <td className="px-8 text-center py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            <img src={NoteIcon} className="cursor-pointer" alt="Edit Icon" onClick={handleNotice} />
                                        </td>
                                        <td className="px-6 py-4 border-b text-sm font-medium justify-center items-center">
                                            <div className={`${student.attendanceStatus === 'Present' ? 'bg-[#CCFAEB]' : 'bg-[#F6DCDE]'} w-[81px] h-[29px] justify-center items-center text-center pt-1 rounded-md`}>
                                                <span className={`justify-center items-center text-center ${student.attendanceStatus === 'Present' ? 'text-[#0BA071]' : 'text-[#C01824]'}`}>
                                                    {student.attendanceStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-2 border-b text-[14px] font-[600] text-[#141516]">
                                            <img src={NoteIcon} className="cursor-pointer" alt="Edit Icon" onClick={handleStudentNoticeModal} />
                                        </td>
                                        <td className="px-6 py-2 border-b text-[14px] font-[700]">
                                            <FaEllipsisVertical onClick={(event) => handleClick(event, student)} />
                                        </td>
                                    </tr>
                                ))}
                                <MenuComponent
                                    anchorEl={anchorEl1}
                                    open={openInfraction}
                                    handleClose={handleClose}
                                    menuItems={menuItems}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <StudentNoticeModal open={openStudentNoticeModal} handleOpen={handleStudentNoticeModal} noticeState={noticeState} />
            <StudentManagementModal open={openStudentModal} handleOpen={handleStudentModal} editDriver={editStudentModal} studentEditData={studentEditData} />
        </MainLayout>
    )
}

export default Students
