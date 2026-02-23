import { useState, useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployeeProfile, fetchEmployeeProfile } from '@/redux/slices/employeeDashboardSlice';

export default function UpdateBankAccountForm({ closeModal }) {
  const dispatch  = useDispatch();
  const { profile, loading } = useSelector((s) => s.employeeDashboard);

  const [form, setForm] = useState({
    phone:   '',
    email:   '',
    city:    '',
    address: '',
    zipCode: '',
  });

  // Pre-populate from Redux profile when available
  useEffect(() => {
    if (!profile) {
      dispatch(fetchEmployeeProfile());
    } else {
      setForm({
        phone:   profile.Phone   || '',
        email:   profile.Email   || '',
        city:    profile.City    || '',
        address: profile.Address || '',
        zipCode: profile.ZipCode || '',
      });
    }
  }, [profile, dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const result = await dispatch(updateEmployeeProfile({
      phone:   form.phone,
      email:   form.email,
      city:    form.city,
      address: form.address,
      zipCode: form.zipCode,
    }));
    if (!result.error) closeModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg h-[75vh] mx-auto">
      <div className="grid grid-cols-2 gap-4">

        {/* Read-only: Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">Full Name</label>
          <input
            type="text"
            value={profile?.Name || ''}
            readOnly
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#ECECEC] text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">Contact Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
          />
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
          />
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
          />
        </div>

        {/* Zip Code */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-[#2C2F32]">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex gap-3 mt-4">
          <Button
            className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px] capitalize"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#C01824] px-12 py-2 capitalize text-sm font-normal disabled:opacity-60"
            variant="filled"
            disabled={loading.submitting}
            onClick={handleSave}
          >
            {loading.submitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
