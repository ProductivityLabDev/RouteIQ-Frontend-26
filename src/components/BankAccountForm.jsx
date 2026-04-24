import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeProfile } from '@/redux/slices/employeeDashboardSlice';
import { schoolService } from '@/services/schoolService';

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
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (!profile) dispatch(fetchEmployeeProfile());
  }, [dispatch, profile]);

  useEffect(() => {
    let active = true;

    const loadCities = async () => {
      try {
        const response = await schoolService.getCities();
        if (!active) return;

        const normalizedCities = (Array.isArray(response?.data) ? response.data : [])
          .map((city) => {
            const id = city?.CityId ?? city?.id ?? city?.Id;
            const name = city?.CityName ?? city?.name ?? city?.Name;
            if (!id || !name) return null;
            return { id: Number(id), name: String(name) };
          })
          .filter(Boolean);

        setCityOptions(normalizedCities);
      } catch {
        if (active) setCityOptions([]);
      }
    };

    loadCities();
    return () => {
      active = false;
    };
  }, []);

  const resolvedCityName = useMemo(() => {
    const rawCity = profile?.City;
    if (rawCity === undefined || rawCity === null || rawCity === '') return '';

    const matchedCity = cityOptions.find(
      (city) => String(city.id) === String(rawCity) || city.name.toLowerCase() === String(rawCity).toLowerCase()
    );

    return matchedCity?.name || String(rawCity);
  }, [profile?.City, cityOptions]);

  useEffect(() => {
    if (!profile) return;

    const rawCity = profile?.City;
    const matchedCity = cityOptions.find(
      (city) => String(city.id) === String(rawCity) || city.name.toLowerCase() === String(rawCity).toLowerCase()
    );

    console.log("Employee dashboard city resolution", {
      profileCity: rawCity,
      cityOptionsSample: cityOptions.slice(0, 10),
      totalCityOptions: cityOptions.length,
      matchedCity,
      resolvedCityName,
    });
  }, [profile, cityOptions, resolvedCityName]);

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
        <Field label="City"           value={resolvedCityName} />
        <Field label="Address"        value={profile?.Address} />
        <Field label="Zip Code"       value={profile?.ZipCode} />
      </div>
    </div>
  );
}
