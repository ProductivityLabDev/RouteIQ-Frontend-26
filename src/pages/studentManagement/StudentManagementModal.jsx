import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, Typography } from '@material-tailwind/react';
import { closeicon, profileavatar, studentone, locationicon } from '@/assets';
import { BiEdit } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { createStudent } from '@/redux/slices/studentSlice';
import { toast } from 'react-hot-toast';
import { Autocomplete } from '@react-google-maps/api';

const fieldLabelClass = "text-[13px] font-semibold uppercase tracking-[0.08em] text-[#6D7280]";
const fieldInputClass = "w-full rounded-xl border border-[#D9DEE8] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#1F2937] outline-none transition focus:border-[#C01824] focus:bg-white";

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

  useEffect(() => {
    if (open && isLoaded) {
      const handlePacClick = (e) => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer && pacContainer.contains(e.target)) {
          e.stopPropagation();
          e.preventDefault();
        }
      };

      document.addEventListener('mousedown', handlePacClick, true);
      document.addEventListener('click', handlePacClick, true);

      return () => {
        document.removeEventListener('mousedown', handlePacClick, true);
        document.removeEventListener('click', handlePacClick, true);
      };
    }
  }, [open, isLoaded]);

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
    <>
      <style>{`
        .pac-container {
          z-index: 9999 !important;
        }
        .pac-container .pac-item {
          cursor: pointer;
        }
        .pac-container .pac-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    <Dialog className="!m-0 !w-[92vw] !max-w-[980px] !min-w-0 !rounded-[28px] !shadow-2xl !p-0 overflow-hidden" open={open} handler={handleOpen} size="xl" dismiss={{ enabled: false }}>
      <Card color="transparent" shadow={false} className="max-h-[92vh] overflow-hidden bg-white">
        <div className="border-b border-[#E8ECF3] bg-[linear-gradient(135deg,#fff7f5_0%,#ffffff_48%,#f8fafc_100%)] px-7 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C01824]">
                Vendor Student Portal
              </p>
              <Typography className="mt-1 text-[26px] md:text-[30px] font-extrabold text-[#202224] leading-tight">
                {editDriver ? 'Edit Student' : 'Add New Student'}
              </Typography>
              <p className="mt-1 text-sm text-[#6B7280]">
                Capture student profile, route stops, guardians and transport details in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#202224] transition hover:border-[#C01824] hover:text-[#C01824]"
            >
              <img src={closeicon} className="h-[15px] w-[15px]" alt="Close" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-118px)] flex-col">
          <div className="overflow-y-auto px-7 py-6">
            <div className="mb-6 flex flex-col items-center rounded-3xl border border-[#EEF2F7] bg-[#FBFCFE] px-6 py-5 text-center">
              <div className="relative">
                <img
                  src={previewImg || studentone}
                  alt="Student"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg shadow-[#C01824]/10"
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
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#C01824] text-white shadow-md transition hover:bg-[#A6131E]"
                  title="Change photo"
                >
                  <BiEdit size={18} />
                </label>
              </div>
              <p className="mt-4 text-base font-bold text-[#1F2937]">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`.trim()
                  : 'Student Profile Photo'}
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Upload a clear student image for quick recognition in the vendor dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#EEF2F7] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C01824]">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#202224]">Student Information</p>
                    <p className="text-xs text-[#6B7280]">Basic profile and school-related details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={fieldLabelClass}>First Name</label>
                    <input type="text" name="firstName" placeholder="Enter first name" className={fieldInputClass} value={formData.firstName} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Last Name</label>
                    <input type="text" name="lastName" placeholder="Enter last name" className={fieldInputClass} value={formData.lastName} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Grade</label>
                    <input type="text" name="grade" placeholder="Enter grade" className={fieldInputClass} value={formData.grade} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Enrollment No</label>
                    <input type="text" name="enrollmentNo" placeholder="Enter enrollment number" className={fieldInputClass} value={formData.enrollmentNo} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Bus No</label>
                    <input type="text" name="busNo" placeholder="Enter assigned bus number" className={fieldInputClass} value={formData.busNo} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Emergency Contact</label>
                    <input type="text" name="emergencyContact" placeholder="Enter emergency contact" className={fieldInputClass} value={formData.emergencyContact} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#EEF2F7] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C01824]">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#202224]">Guardian & Route Details</p>
                    <p className="text-xs text-[#6B7280]">Pickup, drop-off and guardian contact information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={fieldLabelClass}>Pickup Location</label>
                    <div
                      className={`${fieldInputClass} flex items-center gap-3 px-4 py-0`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {isLoaded && window.google?.maps?.places ? (
                        <Autocomplete
                          onLoad={onPickupLoad}
                          onPlaceChanged={onPickupPlaceChanged}
                          className="w-full"
                          options={{
                            types: ['address'],
                            componentRestrictions: { country: 'us' },
                            fields: ['formatted_address', 'geometry', 'name', 'place_id']
                          }}
                        >
                          <input
                            type="text"
                            name="pickupLocation"
                            placeholder="Search pickup location"
                            className="w-full bg-transparent py-3 outline-none"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        </Autocomplete>
                      ) : (
                        <input
                          type="text"
                          name="pickupLocation"
                          placeholder={isLoaded ? "Search pickup location" : "Loading Google Maps..."}
                          className="w-full bg-transparent py-3 outline-none"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          disabled={!isLoaded}
                        />
                      )}
                      <img src={locationicon} alt="Pickup location" className="h-5 w-5 shrink-0" />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Drop Location</label>
                    <div
                      className={`${fieldInputClass} flex items-center gap-3 px-4 py-0`}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {isLoaded ? (
                        <Autocomplete
                          onLoad={onDropoffLoad}
                          onPlaceChanged={onDropoffPlaceChanged}
                          className="w-full"
                          options={{
                            types: ['address'],
                            componentRestrictions: { country: 'us' },
                            fields: ['formatted_address', 'geometry', 'name', 'place_id']
                          }}
                        >
                          <input
                            type="text"
                            name="dropLocation"
                            placeholder="Search drop location"
                            className="w-full bg-transparent py-3 outline-none"
                            value={formData.dropLocation}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        </Autocomplete>
                      ) : (
                        <input
                          type="text"
                          name="dropLocation"
                          placeholder="Loading address search..."
                          className="w-full bg-transparent py-3 outline-none"
                          value={formData.dropLocation}
                          onChange={handleChange}
                          disabled
                        />
                      )}
                      <img src={locationicon} alt="Drop location" className="h-5 w-5 shrink-0" />
                    </div>
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Address</label>
                    <input type="text" name="address" placeholder="Enter home address" className={fieldInputClass} value={formData.address} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Guardian 1</label>
                    <input type="text" name="guardian1" placeholder="Enter primary guardian" className={fieldInputClass} value={formData.guardian1} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Guardian 2</label>
                    <input type="text" name="guardian2" placeholder="Enter secondary guardian" className={fieldInputClass} value={formData.guardian2} onChange={handleChange} />
                  </div>

                  <div>
                    <label className={fieldLabelClass}>Guardian Email</label>
                    <input type="email" name="guardianEmail" placeholder="Enter guardian email" className={fieldInputClass} value={formData.guardianEmail || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E8ECF3] bg-[#FCFCFD] px-7 py-4">
            <Button
              onClick={handleOpen}
              className="rounded-xl border border-[#C01824] bg-white px-8 py-3 text-[15px] font-semibold capitalize text-[#C01824] shadow-none hover:shadow-none"
              variant="outlined"
              disabled={loading.creating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-[#C01824] px-8 py-3 text-[15px] font-semibold capitalize shadow-lg shadow-[#C01824]/20"
              variant="filled"
              disabled={loading.creating}
            >
              {loading.creating ? 'Submitting...' : editDriver ? 'Update Student' : 'Submit Student'}
            </Button>
          </div>
        </form>
      </Card>
    </Dialog>
    </>
  );
}
