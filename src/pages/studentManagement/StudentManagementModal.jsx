import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { closeicon, profileavatar, studentone } from '@/assets';
import { BiEdit } from "react-icons/bi";


export function StudentManagementModal({ open, handleOpen, editDriver, studentEditData }) {
  const [formData, setFormData] = useState({
    studentPic: '',
    studentName: '',
    Grade: '',
    enrollment: '',
    emergencyContact: '',
    busNo: '',
    address: '',
  });

  const [previewImg, setPreviewImg] = useState('');

  useEffect(() => {
    if (editDriver && studentEditData) {
      setFormData({
        studentPic: studentEditData?.studentPic || '',
        studentName: studentEditData?.studentName || '',
        Grade: studentEditData?.Grade || '',
        enrollment: studentEditData?.enrollment || '',
        emergencyContact: studentEditData?.emergencyContact || '',
        busNo: studentEditData?.busNo || '',
        address: studentEditData?.address || '',
      });
      setPreviewImg(studentEditData?.studentPic || '');
    } else {
      setFormData({
        studentPic: '',
        studentName: '',
        Grade: '',
        enrollment: '',
        emergencyContact: '',
        busNo: '',
        address: '',
      });
      setPreviewImg('');
    }
  }, [editDriver, studentEditData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, studentPic: file }));
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', formData);
    handleOpen();
  };

  return (
    <Dialog className="px-7 py-6 rounded-[4px]" open={open} handler={handleOpen}>
      <Card color="transparent" shadow={false}>
        <div className="flex justify-between items-center">
          <Typography className="text-[24px] md:text-[32px] text-[#202224] font-bold">
            {editDriver ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <Button className="p-1" variant="text" onClick={handleOpen}>
            <img src={closeicon} className="w-[17px] h-[17px]" alt="" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="md:mt-5 mb-2 md:max-w-screen-lg">
          {/* Image Upload */}
          <div className="mb-5 flex flex-col items-center relative w-fit mx-auto">
            <img
              src={previewImg || studentone}
              alt="Student"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
            <input
              type="file"
              id="profilePicUpload"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <label
              htmlFor="profilePicUpload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow"
              title="Change photo"
            >
              <BiEdit size={24}/>
            </label>
          </div>

          <div className="flex justify-between md:flex-nowrap flex-wrap md:space-x-7">
            <div className="mb-1 flex flex-col gap-5 w-full">
              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">First Name</label>
              <input
                type="text"
                name="studentName"
                placeholder="First Name"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.studentName}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Grade</label>
              <input
                type="text"
                name="Grade"
                placeholder="Grade"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.Grade}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Enrollment No</label>
              <input
                type="number"
                name="enrollment"
                placeholder="Enrollment No."
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.enrollment}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Guardian 1</label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="Guardian 1"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>

            <div className="mb-1 flex flex-col gap-5 w-full">
              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Bus No</label>
              <input
                type="text"
                name="busNo"
                placeholder="Bus No"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.busNo}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="Emergency contact"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.emergencyContact}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.address}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Guardian 2</label>
              <input
                type="text"
                name="guardian2"
                placeholder="Guardian 2"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
              />
            </div>
          </div>

          <div className="space-x-4 flex justify-end">
            <Button onClick={handleOpen} className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]" size="lg" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" variant="filled" size="lg">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </Dialog>
  );
}
