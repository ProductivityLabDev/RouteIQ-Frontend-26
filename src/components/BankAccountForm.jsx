import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeProfile } from '@/redux/slices/employeeDashboardSlice';

const Field = ({ label, value }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-[#2C2F32]">{label}</label>
    <div className="w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm text-gray-700">
      {value || '--'}
    </div>
  </div>
);

export default function BankAccountForm() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((s) => s.employeeDashboard);

  useEffect(() => {
    if (!profile) dispatch(fetchEmployeeProfile());
  }, [dispatch, profile]);

  if (loading.profile) {
    return (
      <div className="bg-white p-6 h-[75vh] rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 h-[75vh] rounded-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name"      value={profile?.Name} />
        <Field label="Contact Number" value={profile?.Phone} />
        <Field label="Email"          value={profile?.Email} />
        <Field label="City"           value={profile?.City} />
        <Field label="Address"        value={profile?.Address} />
        <Field label="Zip Code"       value={profile?.ZipCode} />
      </div>
    </div>
  );
}
