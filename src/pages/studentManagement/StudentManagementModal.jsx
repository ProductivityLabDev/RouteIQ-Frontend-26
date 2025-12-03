import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { closeicon, profileavatar, studentone } from '@/assets';
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { createStudent } from '@/redux/slices/studentSlice';
import { toast } from 'react-hot-toast';


export function StudentManagementModal({ open, handleOpen, editDriver, studentEditData, refreshStudents }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.students);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pickupLocation: '',
    dropLocation: '',
    grade: '',
    emergencyContact: '',
    enrollmentNo: '',
    address: '',
    guardian1: '',
    guardian2: '',
    guardianEmail: '',
    busNo: '',
  });

  const [previewImg, setPreviewImg] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (editDriver && studentEditData) {
      setFormData({
        firstName: studentEditData?.FirstName || studentEditData?.firstName || '',
        lastName: studentEditData?.LastName || studentEditData?.lastName || '',
        pickupLocation: studentEditData?.PickUp || studentEditData?.pickupLocation || '',
        dropLocation: studentEditData?.PickDown || studentEditData?.dropLocation || '',
        grade: studentEditData?.Grade || studentEditData?.grade || '',
        emergencyContact: studentEditData?.ContactPhone || studentEditData?.emergencyContact || '',
        enrollmentNo: studentEditData?.EnrollmentNumber || studentEditData?.enrollmentNo || '',
        address: studentEditData?.Address || studentEditData?.address || '',
        guardian1: studentEditData?.Guardian1 || studentEditData?.guardian1 || '',
        guardian2: studentEditData?.Guardian2 || studentEditData?.guardian2 || '',
        guardianEmail: studentEditData?.GuardianEmail || studentEditData?.guardianEmail || '',
        busNo: studentEditData?.BusNo || studentEditData?.busNo || '',
      });
      setPreviewImg(studentEditData?.studentPic || '');
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        pickupLocation: '',
        dropLocation: '',
        grade: '',
        emergencyContact: '',
        enrollmentNo: '',
        address: '',
        guardian1: '',
        guardian2: '',
        guardianEmail: '',
        busNo: '',
      });
      setPreviewImg('');
      setSelectedFile(null);
    }
  }, [editDriver, studentEditData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(createStudent(formData));

      if (createStudent.fulfilled.match(result)) {
        toast.success(result.payload?.message || "Student created successfully!");
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          pickupLocation: '',
          dropLocation: '',
          grade: '',
          emergencyContact: '',
          enrollmentNo: '',
          address: '',
          guardian1: '',
          guardian2: '',
          guardianEmail: '',
          busNo: '',
        });
        setPreviewImg('');
        setSelectedFile(null);

        // Refresh students list if callback provided
        if (refreshStudents) {
          await refreshStudents();
        }

        // Close modal
        handleOpen();
      } else {
        toast.error(result.payload || "Failed to create student. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error creating student:", err);
      toast.error(err.message || "Failed to create student. Please try again.");
    }
  };

  return (
    <Dialog className="px-7 py-6 rounded-[4px]" open={open} handler={handleOpen} size="xl">
      <Card color="transparent" shadow={false} className="max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center flex-shrink-0 pb-3 border-b mb-4">
          <Typography className="text-[24px] md:text-[32px] text-[#202224] font-bold">
            {editDriver ? 'Edit Student' : 'Add New Student......................'}
          </Typography>
          <Button className="p-1" variant="text" onClick={handleOpen}>
            <img src={closeicon} className="w-[17px] h-[17px]" alt="" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="md:mt-5 mb-2 md:max-w-screen-lg flex-1 overflow-y-auto pr-2">
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
                name="firstName"
                placeholder="First Name"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.firstName}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.lastName}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                placeholder="Pickup Location"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.pickupLocation}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Drop Location</label>
              <input
                type="text"
                name="dropLocation"
                placeholder="Drop Location"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.dropLocation}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Grade</label>
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.grade}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Enrollment No</label>
              <input
                type="text"
                name="enrollmentNo"
                placeholder="Enrollment No."
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.enrollmentNo}
                onChange={handleChange}
              />
            </div>

            <div className="mb-1 flex flex-col gap-5 w-full">
              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="Emergency Contact"
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

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Guardian 1</label>
              <input
                type="text"
                name="guardian1"
                placeholder="Guardian 1"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.guardian1}
                onChange={handleChange}
              />

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Guardian 2</label>
              <input
                type="text"
                name="guardian2"
                placeholder="Guardian 2"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.guardian2}
                onChange={handleChange}
              />

              <div>
                <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  placeholder="Guardian Email"
                  className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] w-full"
                  value={formData.guardianEmail || ''}
                  onChange={handleChange}
                />
              </div>

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Bus No</label>
              <input
                type="text"
                name="busNo"
                placeholder="Bus No"
                className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                value={formData.busNo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-x-4 flex justify-end mt-6 flex-shrink-0 pt-4 border-t">
            <Button 
              onClick={handleOpen} 
              className="mt-8 px-14 py-2.5 border-2 border-[#C01824] text-[18px] text-[#C01824] capitalize rounded-[6px]" 
              size="lg" 
              variant="outlined"
              disabled={loading.creating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="mt-8 px-14 py-2.5 bg-[#C01824] text-[18px] capitalize rounded-[6px]" 
              variant="filled" 
              size="lg"
              disabled={loading.creating}
            >
              {loading.creating ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Card>
    </Dialog>
  );
}
