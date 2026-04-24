import { useState, useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployeeProfile, fetchEmployeeProfile } from '@/redux/slices/employeeDashboardSlice';
import { schoolService } from '@/services/schoolService';

export default function UpdateBankAccountForm({ closeModal }) {
  const dispatch  = useDispatch();
  const { profile, loading } = useSelector((s) => s.employeeDashboard);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

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
        city:    '',
        address: profile.Address || '',
        zipCode: profile.ZipCode || '',
      });
      setCitySearch(String(profile.City || ''));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    let active = true;

    const loadCities = async () => {
      setLoadingCities(true);
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

        const uniqueCities = Array.from(
          new Map(normalizedCities.map((city) => [city.id, city])).values()
        );

        setCityOptions(uniqueCities);
      } catch {
        if (active) setCityOptions([]);
      } finally {
        if (active) setLoadingCities(false);
      }
    };

    loadCities();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!cityOptions.length || !citySearch || form.city) return;

    const matchedCity = cityOptions.find(
      (city) =>
        city.name.toLowerCase() === citySearch.trim().toLowerCase() ||
        String(city.id) === String(citySearch).trim()
    );

    if (matchedCity) {
      setForm((prev) => ({ ...prev, city: matchedCity.id }));
      setCitySearch(matchedCity.name);
    }
  }, [cityOptions, citySearch, form.city]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredCities = cityOptions
    .filter((city) =>
      city.name.toLowerCase().includes((citySearch || '').trim().toLowerCase())
    )
    .slice(0, 10);

  const handleCitySelect = (city) => {
    setForm((prev) => ({ ...prev, city: city.id }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
  };

  const handleSave = async () => {
    const result = await dispatch(updateEmployeeProfile({
      phone:   form.phone,
      email:   form.email,
      city:    form.city || null,
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
          <div className="relative">
            <input
              type="text"
              name="citySearch"
              value={citySearch}
              onChange={(e) => {
                const nextValue = e.target.value;
                setCitySearch(nextValue);
                setForm((prev) => ({ ...prev, city: '' }));
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowCityDropdown(false), 120);
              }}
              placeholder={loadingCities ? 'Loading cities...' : 'Search city'}
              className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA] text-sm"
            />

            {showCityDropdown && !loadingCities && filteredCities.length > 0 ? (
              <div className="absolute z-20 mt-1 w-full rounded-[6px] border border-[#D5D5D5] bg-white shadow-lg max-h-56 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onMouseDown={() => handleCitySelect(city)}
                    className="block w-full px-3 py-2 text-left text-sm text-[#2C2F32] hover:bg-[#F5F6FA]"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
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
