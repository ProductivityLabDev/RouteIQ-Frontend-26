import { Button, Card, Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useRef } from "react";
import { schoolDashboardService } from "@/services/schoolDashboardService";
import { schoolService } from "@/services/schoolService";

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toStringValue = (value) => (value === undefined || value === null ? "" : String(value));

const findOptionId = (items, idCandidates = [], nameCandidates = [], idKeys = [], nameKeys = []) => {
  const directId = idCandidates.find((value) => value !== undefined && value !== null && value !== "");
  if (directId !== undefined) return String(directId);

  const normalizedNames = nameCandidates
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);

  if (normalizedNames.length === 0) return "";

  const matched = (Array.isArray(items) ? items : []).find((item) => {
    const optionName = nameKeys
      .map((key) => item?.[key])
      .find((value) => value !== undefined && value !== null && value !== "");

    return normalizedNames.includes(String(optionName || "").trim().toLowerCase());
  });

  if (!matched) return "";

  const matchedId = idKeys
    .map((key) => matched?.[key])
    .find((value) => value !== undefined && value !== null && value !== "");

  return matchedId !== undefined ? String(matchedId) : "";
};

export function Profile() {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [citySearch, setCitySearch] = useState('');
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef(null);
  const profileSnapshotRef = useRef(null);

  useEffect(() => {
    const onOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const [form, setForm] = useState({
    instituteName: '',
    contactPhone: '',
    mobileNo: '',
    address: '',
    stateId: '',
    contactEmail: '',
    zipCode: '',
    cityId: '',
  });

  const mapProfileToForm = (profile, stateOptions = states, cityOptions = cities) => {
    const stateId = findOptionId(
      stateOptions,
      [profile?.stateId, profile?.StateId, profile?.state, profile?.State],
      [profile?.stateName, profile?.StateName, profile?.state, profile?.State],
      ["StateId", "stateId", "id"],
      ["StateName", "stateName", "name"]
    );

    const cityId = findOptionId(
      cityOptions,
      [profile?.cityId, profile?.CityId, profile?.city, profile?.City],
      [profile?.cityName, profile?.CityName, profile?.city, profile?.City],
      ["CityId", "cityId", "id"],
      ["CityName", "cityName", "name"]
    );

    return {
      instituteName: toStringValue(pickFirst(profile?.instituteName, profile?.InstituteName, profile?.schoolName, profile?.SchoolName)),
      contactPhone: toStringValue(pickFirst(profile?.contactPhone, profile?.ContactPhone)),
      mobileNo: toStringValue(pickFirst(profile?.mobileNo, profile?.MobileNo, profile?.officePhone, profile?.OfficePhone)),
      address: toStringValue(pickFirst(profile?.address, profile?.Address)),
      stateId,
      contactEmail: toStringValue(pickFirst(profile?.contactEmail, profile?.ContactEmail, profile?.email, profile?.Email)),
      zipCode: toStringValue(pickFirst(profile?.zipCode, profile?.ZipCode)),
      cityId,
    };
  };

  useEffect(() => {
    const load = async () => {
      setLoadingStates(true);
      try {
        const res = await schoolService.getStates();
        setStates(res?.data || []);
      } catch (e) {
      } finally {
        setLoadingStates(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingCities(true);
      try {
        const res = await schoolService.getCities();
        setCities(res?.data || []);
      } catch (e) {
      } finally {
        setLoadingCities(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingProfile(true);
      try {
        const res = await schoolDashboardService.getProfile();
        const d = res?.data ?? res ?? {};
        profileSnapshotRef.current = d;
        setForm((prev) => ({
          ...prev,
          ...mapProfileToForm(d),
        }));
        const logoUrl = d.logo ?? d.Logo ?? d.logoUrl ?? d.LogoUrl;
        if (logoUrl) setLogoPreview(logoUrl);
      } catch (e) {
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!profileSnapshotRef.current) return;
    if (!states.length && !cities.length) return;

    setForm((prev) => {
      const mapped = mapProfileToForm(profileSnapshotRef.current, states, cities);
      return {
        ...prev,
        stateId: mapped.stateId || prev.stateId,
        cityId: mapped.cityId || prev.cityId,
      };
    });
  }, [states, cities]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cityId) {
      setError('Please select a city');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const fd = new FormData();
      fd.append('instituteName', form.instituteName);
      fd.append('contactEmail', form.contactEmail);
      fd.append('contactPhone', form.contactPhone);
      fd.append('mobileNo', form.mobileNo);
      fd.append('address', form.address);
      fd.append('zipCode', form.zipCode);
      if (form.stateId) fd.append('stateId', form.stateId);
      if (form.cityId) fd.append('cityId', form.cityId);
      if (logoFile) fd.append('logo', logoFile);
      await schoolDashboardService.updateProfile(fd);
      try {
        const refreshed = await schoolDashboardService.getProfile();
        const refreshedProfile = refreshed?.data ?? refreshed ?? {};
        profileSnapshotRef.current = refreshedProfile;
        setForm((prev) => ({
          ...prev,
          ...mapProfileToForm(refreshedProfile, states, cities),
        }));
        const refreshedLogo = refreshedProfile.logo ?? refreshedProfile.Logo ?? refreshedProfile.logoUrl ?? refreshedProfile.LogoUrl;
        if (refreshedLogo) setLogoPreview(refreshedLogo);
      } catch (refreshError) {
      }
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-6 w-full">
      <div className="mb-6">
        <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#98A2B3]">
          School Workspace
        </div>
        <h1 className="mt-2 text-[28px] font-extrabold text-[#141516]">Edit Profile</h1>
        <p className="mt-2 max-w-[760px] text-[14px] leading-6 text-[#667085]">
          Update your school identity, contact information and location details from one place.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-[1280px] rounded-[14px] p-5 md:p-8" color="white" shadow={true}>
          <div className="text-center">
            <div className="h-[118px] w-[118px] flex justify-center items-center overflow-hidden mx-auto rounded-full bg-[#ECECEE] relative">
              {loadingProfile ? (
                <span className="text-gray-400 text-sm">Loading...</span>
              ) : logoPreview ? (
                <img src={logoPreview} alt="Uploaded" className="object-cover h-full w-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                  <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </div>
            <p className="pt-2 text-[14px] font-semibold text-[#C01824]">Upload photo</p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 mb-2 w-full max-w-[1120px]">
            {loadingProfile && (
              <p className="text-gray-500 text-sm text-center mb-4">Loading profile...</p>
            )}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'>
              {/* Left column */}
              <div className="mb-1 flex flex-col gap-6 w-full">
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  School Name
                </Typography>
                <input
                  type='text'
                  name="instituteName"
                  value={form.instituteName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your school name"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Contact Phone
                </Typography>
                <input
                  type='tel'
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  required
                  placeholder="Enter contact phone number"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Office Phone No
                </Typography>
                <input
                  type='tel'
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  placeholder="Enter office phone number"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Address
                </Typography>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your address"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  State
                </Typography>
                <select
                  name="stateId"
                  value={form.stateId}
                  onChange={handleChange}
                  required
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA] w-full"
                >
                  <option value="">Select state</option>
                  {loadingStates ? (
                    <option>Loading...</option>
                  ) : (
                    states.map((s) => {
                      const id = s.StateId ?? s.stateId ?? s.id;
                      const name = s.StateName ?? s.stateName ?? s.name ?? `State ${id}`;
                      return <option key={id} value={id}>{name}</option>;
                    })
                  )}
                </select>
              </div>

              {/* Right column */}
              <div className="mb-1 flex flex-col gap-6 w-full">
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Email
                </Typography>
                <input
                  type='email'
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  Mobile No
                </Typography>
                <input
                  type='tel'
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  ZIP Code
                </Typography>
                <input
                  type="text"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter your ZIP code here"
                  className="p-3 outline-none rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA]"
                />
                <Typography variant="paragraph" className="-mb-3 text-[14px] text-[#2C2F32] font-semibold">
                  City
                </Typography>
                <div ref={cityRef} className="relative">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setCityOpen((o) => !o)}
                    onKeyDown={(e) => e.key === 'Enter' && setCityOpen((o) => !o)}
                    className="p-3 rounded-[6px] border border-[#D5D5D5] bg-[#F5F6FA] w-full cursor-pointer flex justify-between items-center min-h-[42px]"
                  >
                    <span className={form.cityId ? 'text-[#2C2F32]' : 'text-gray-400'}>
                      {loadingCities ? 'Loading...' : form.cityId
                        ? ((() => { const c = cities.find((x) => (x.CityId ?? x.cityId ?? x.id) == form.cityId); return c?.CityName ?? c?.cityName ?? c?.name ?? form.cityId; })())
                        : 'Select city'}
                    </span>
                    <span className="text-gray-500">{cityOpen ? '▲' : '▼'}</span>
                  </div>
                  {cityOpen && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-[6px] border border-[#D5D5D5] bg-white shadow-lg overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 w-full outline-none border-b border-[#D5D5D5] bg-[#F5F6FA]"
                        autoFocus
                      />
                      <div className="max-h-[200px] overflow-y-auto">
                        {loadingCities ? (
                          <div className="p-3 text-gray-500">Loading...</div>
                        ) : (() => {
                          const q = (citySearch || '').trim().toLowerCase();
                          const filtered = q
                            ? cities.filter((c) => {
                                const name = (c.CityName ?? c.cityName ?? c.name ?? '').toString().toLowerCase();
                                return name.includes(q);
                              })
                            : cities;
                          const top10 = filtered.slice(0, 10);
                          const selectedCity = form.cityId && filtered.find((c) => (c.CityId ?? c.cityId ?? c.id) == form.cityId);
                          const toShow = selectedCity && !top10.some((c) => (c.CityId ?? c.cityId ?? c.id) == form.cityId)
                            ? [selectedCity, ...top10.filter((c) => (c.CityId ?? c.cityId ?? c.id) != form.cityId)].slice(0, 10)
                            : top10;
                          return toShow.map((c) => {
                            const id = c.CityId ?? c.cityId ?? c.id;
                            const name = c.CityName ?? c.cityName ?? c.name ?? `City ${id}`;
                            return (
                              <div
                                key={id}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  handleChange({ target: { name: 'cityId', value: String(id) } });
                                  setCityOpen(false);
                                  setCitySearch('');
                                }}
                                className="p-3 hover:bg-[#F5F6FA] cursor-pointer"
                              >
                                {name}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                  <input type="hidden" name="cityId" value={form.cityId} required />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-[#C01824] text-sm mt-4 text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mt-4 text-center">Profile updated successfully!</p>
            )}

            <Button
              type="submit"
              disabled={submitting || loadingProfile}
              className="mt-10 mb-4 flex min-w-[220px] justify-center text-[18px] font-normal capitalize bg-[#C01824] disabled:opacity-60"
              variant='filled'
              size='lg'
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </form>
      </Card>
    </section>
  );
}

export default Profile;
