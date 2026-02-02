import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { closeicon, profileavatar, studentone, locationicon } from '@/assets';
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { createStudent } from '@/redux/slices/studentSlice';
import { toast } from 'react-hot-toast';
import { Autocomplete } from '@react-google-maps/api';


export function StudentManagementModal({ open, handleOpen, editDriver, studentEditData, refreshStudents, isGoogleMapsLoaded }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.students);
  
  // Use Google Maps loader from parent component (Students.jsx)
  // This ensures script loads before modal opens
  const isLoaded = isGoogleMapsLoaded !== undefined ? isGoogleMapsLoaded : false;
  
  useEffect(() => {
    console.log("🔍 [StudentModal] Google Maps Status:", {
      isLoaded,
      modalOpen: open,
      receivedFromParent: isGoogleMapsLoaded !== undefined
    });
  }, [isLoaded, open, isGoogleMapsLoaded]);

  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pickupLocation: '',
    pickupLatitude: null,
    pickupLongitude: null,
    dropLocation: '',
    dropLatitude: null,
    dropLongitude: null,
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
        pickupLatitude: studentEditData?.PickupLatitude || studentEditData?.pickupLatitude || studentEditData?.Latitude || null,
        pickupLongitude: studentEditData?.PickupLongitude || studentEditData?.pickupLongitude || studentEditData?.Longitude || null,
        dropLocation: studentEditData?.PickDown || studentEditData?.dropLocation || '',
        dropLatitude: studentEditData?.DropLatitude || studentEditData?.dropLatitude || null,
        dropLongitude: studentEditData?.DropLongitude || studentEditData?.dropLongitude || null,
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
        pickupLatitude: null,
        pickupLongitude: null,
        dropLocation: '',
        dropLatitude: null,
        dropLongitude: null,
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

  // Google Places Autocomplete handlers - Exact same as Route Management
  const onPickupLoad = (autocomplete) => {
    console.log("✅ [StudentModal] Pickup Autocomplete loaded!");
    setAutocompletePickup(autocomplete);
  };
  
  const onDropoffLoad = (autocomplete) => {
    console.log("✅ [StudentModal] Dropoff Autocomplete loaded!");
    setAutocompleteDropoff(autocomplete);
  };

  const onPickupPlaceChanged = () => {
    if (autocompletePickup !== null) {
      const place = autocompletePickup.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setFormData(prev => ({
        ...prev,
        pickupLocation: place.formatted_address || place.name,
        pickupLatitude: lat || null,
        pickupLongitude: lng || null,
      }));
    }
  };

  const onDropoffPlaceChanged = () => {
    if (autocompleteDropoff !== null) {
      const place = autocompleteDropoff.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setFormData(prev => ({
        ...prev,
        dropLocation: place.formatted_address || place.name,
        dropLatitude: lat || null,
        dropLongitude: lng || null,
      }));
    }
  };

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
          pickupLatitude: null,
          pickupLongitude: null,
          dropLocation: '',
          dropLatitude: null,
          dropLongitude: null,
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
              <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                {isLoaded && window.google?.maps?.places ? (
                  <Autocomplete
                    onLoad={onPickupLoad}
                    onPlaceChanged={onPickupPlaceChanged}
                    className="w-full"
                  >
                    <input
                      type="text"
                      name="pickupLocation"
                      placeholder="Enter pickup location"
                      className="bg-[#F5F6FA] outline-none w-full"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    name="pickupLocation"
                    placeholder={isLoaded ? "Enter pickup location" : "Loading Google Maps..."}
                    className="bg-[#F5F6FA] outline-none w-full"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    disabled={!isLoaded}
                  />
                )}
                <img src={locationicon} alt="location" className="h-5 w-5 ml-2 flex-shrink-0" />
              </div>

              <label className="text-[#2C2F32] text-[14px] font-bold -mb-3">Drop Location</label>
              <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                {isLoaded ? (
                  <Autocomplete
                    onLoad={onDropoffLoad}
                    onPlaceChanged={onDropoffPlaceChanged}
                    className="w-full"
                  >
                    <input
                      type="text"
                      name="dropLocation"
                      placeholder="Enter drop location"
                      className="bg-[#F5F6FA] outline-none w-full"
                      value={formData.dropLocation}
                      onChange={handleChange}
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    name="dropLocation"
                    placeholder="Loading address search..."
                    className="bg-[#F5F6FA] outline-none w-full"
                    value={formData.dropLocation}
                    onChange={handleChange}
                    disabled
                  />
                )}
                <img src={locationicon} alt="location" className="h-5 w-5" />
              </div>

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
