import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { schoolService } from "@/services/schoolService";
import { vendorService } from "@/services/vendorService";

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
};

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toStringValue = (value) => (value === undefined || value === null ? "" : String(value));

const toNumberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const normalizeVendorProfile = (profile, fallbackUser = {}) => {
  const addressData = profile?.addressDetails || profile?.address || profile?.Address || {};
  const stateValue = pickFirst(
    profile?.stateId,
    profile?.StateId,
    addressData?.stateId,
    addressData?.StateId,
    fallbackUser?.stateId
  );
  const cityValue = pickFirst(
    profile?.cityId,
    profile?.CityId,
    addressData?.cityId,
    addressData?.CityId,
    fallbackUser?.cityId
  );

  return {
    fullName: toStringValue(
      pickFirst(profile?.fullName, profile?.FullName, profile?.name, profile?.NameAndTitle, fallbackUser?.name, fallbackUser?.fullName)
    ),
    username: toStringValue(
      pickFirst(profile?.username, profile?.Username, fallbackUser?.username, fallbackUser?.email)
    ),
    companyName: toStringValue(
      pickFirst(profile?.companyName, profile?.CompanyName, fallbackUser?.companyName)
    ),
    email: toStringValue(
      pickFirst(profile?.email, profile?.Email, fallbackUser?.email)
    ),
    contactPhone: toStringValue(
      pickFirst(profile?.contactNumber, profile?.ContactNumber, fallbackUser?.contactPhone)
    ),
    officePhone: toStringValue(
      pickFirst(profile?.officePhone, profile?.OfficePhone, fallbackUser?.officePhone)
    ),
    nameAndTitle: toStringValue(
      pickFirst(profile?.nameAndTitle, profile?.NameAndTitle, fallbackUser?.nameAndTitle)
    ),
    address: toStringValue(
      pickFirst(profile?.address, profile?.Address, addressData?.address, addressData?.Address, fallbackUser?.address)
    ),
    stateId: toStringValue(stateValue),
    cityId: toStringValue(cityValue),
    zipCode: toStringValue(
      pickFirst(profile?.zipCode, profile?.ZipCode, addressData?.zipCode, addressData?.ZipCode, fallbackUser?.zipCode)
    ),
    logoUrl: toStringValue(
      pickFirst(profile?.logoUrl, profile?.LogoUrl, profile?.Logo, profile?.profileImage, profile?.ProfileImage, fallbackUser?.profileImage, fallbackUser?.logoUrl, fallbackUser?.Logo)
    ),
  };
};

const buildVendorSessionUser = (normalized, fallbackUser = {}) => ({
  ...(fallbackUser || {}),
  name: normalized.nameAndTitle || normalized.fullName || fallbackUser?.name || "",
  fullName: normalized.fullName || fallbackUser?.fullName || "",
  username: normalized.username || fallbackUser?.username || "",
  email: normalized.email || fallbackUser?.email || "",
  companyName: normalized.companyName || fallbackUser?.companyName || "",
  contactPhone: normalized.contactPhone || fallbackUser?.contactPhone || "",
  officePhone: normalized.officePhone || fallbackUser?.officePhone || "",
  nameAndTitle: normalized.nameAndTitle || fallbackUser?.nameAndTitle || "",
  address: normalized.address || fallbackUser?.address || "",
  stateId: normalized.stateId || fallbackUser?.stateId || "",
  cityId: normalized.cityId || fallbackUser?.cityId || "",
  zipCode: normalized.zipCode || fallbackUser?.zipCode || "",
  profileImage: normalized.logoUrl || fallbackUser?.profileImage || "",
  logoUrl: normalized.logoUrl || fallbackUser?.logoUrl || "",
});

export function VendorProfile() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user?.user);
  const vendorUser = useMemo(() => loggedInUser || readJson("vendor") || {}, [loggedInUser]);
  const profileBootstrapUserRef = useRef(vendorUser);
  const cityRef = useRef(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityOpen, setCityOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    companyName: "",
    email: "",
    contactPhone: "",
    officePhone: "",
    nameAndTitle: "",
    address: "",
    stateId: "",
    cityId: "",
    zipCode: "",
  });

  useEffect(() => {
    const onOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const bootstrapUser = profileBootstrapUserRef.current || {};
      try {
        setLoadingProfile(true);
        const response = await vendorService.getProfile();
        const normalized = normalizeVendorProfile(response?.data, bootstrapUser);
        setForm((prev) => ({ ...prev, ...normalized }));
        setLogoPreview(normalized.logoUrl || null);
      } catch (loadError) {
        const fallbackProfile = normalizeVendorProfile({}, bootstrapUser);
        setForm((prev) => ({ ...prev, ...fallbackProfile }));
        setLogoPreview(fallbackProfile.logoUrl || null);
        setError(loadError?.response?.data?.message || "Failed to load vendor profile.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [dispatch]);

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const res = await schoolService.getStates();
        setStates(res?.data || []);
      } catch (loadError) {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const res = await schoolService.getCities();
        setCities(res?.data || []);
      } catch (loadError) {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setSuccess(false);
    setError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setSuccess(false);
    setError("");
  };

  const getCityName = (cityId) => {
    const city = cities.find((item) => String(item.CityId ?? item.cityId ?? item.id) === String(cityId));
    return city?.CityName ?? city?.cityName ?? city?.name ?? "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        fullName: form.fullName.trim() || undefined,
        username: form.username.trim() || undefined,
        companyName: form.companyName.trim() || undefined,
        contactNumber: form.contactPhone.trim() || undefined,
        officePhone: form.officePhone.trim() || undefined,
        nameAndTitle: form.nameAndTitle.trim() || undefined,
        address: form.address.trim() || undefined,
        zipCode: form.zipCode.trim() || undefined,
        stateId: toNumberValue(form.stateId),
        cityId: toNumberValue(form.cityId),
      };

      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
      );

      const profileResponse = await vendorService.updateProfile(cleanPayload);
      let nextLogoUrl = logoPreview;

      if (logoFile) {
        const logoResponse = await vendorService.updateProfileLogo(logoFile);
        nextLogoUrl = pickFirst(
          logoResponse?.data?.logoUrl,
          logoResponse?.data?.LogoUrl,
          logoResponse?.data?.profileImage,
          logoResponse?.data?.ProfileImage,
          nextLogoUrl
        );
        setLogoFile(null);
      }

      const normalized = normalizeVendorProfile(
        {
          ...(profileResponse?.data || {}),
          logoUrl: nextLogoUrl,
        },
        {
          ...vendorUser,
          email: form.email,
        }
      );

      setForm((prev) => ({ ...prev, ...normalized, email: form.email || normalized.email }));
      setLogoPreview(nextLogoUrl || normalized.logoUrl || null);

      const nextVendorUser = {
        ...buildVendorSessionUser(
          {
            ...normalized,
            email: form.email || normalized.email,
            logoUrl: nextLogoUrl || normalized.logoUrl,
          },
          vendorUser
        ),
        cityName: getCityName(normalized.cityId),
      };

      localStorage.setItem("vendor", JSON.stringify(nextVendorUser));
      const token = localStorage.getItem("token");
      dispatch(setUser({ user: nextVendorUser, token }));
      setSuccess(true);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Failed to save vendor profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = (() => {
    const query = citySearch.trim().toLowerCase();
    if (!query) return cities.slice(0, 10);
    return cities
      .filter((city) => String(city.CityName ?? city.cityName ?? city.name ?? "").toLowerCase().includes(query))
      .slice(0, 10);
  })();

  return (
    <section className="w-full">
      <div className="mt-7 w-full">
        <div className="rounded-[14px] bg-[linear-gradient(135deg,#C01824_0%,#8E1019_100%)] p-6 text-white md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.26em] text-white/70">
                Vendor Workspace
              </div>
              <h1 className="mt-3 text-[30px] font-extrabold leading-tight">Edit Profile</h1>
              <p className="mt-3 max-w-[720px] text-[14px] leading-6 text-white/80">
                Update your company identity, contact details and vendor-facing profile information from one place.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90">
                  {form.email || "No email added"}
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90">
                  {form.contactPhone || "No phone added"}
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white/90">
                  {form.companyName || "Company not set"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-start lg:justify-end">
            <div className="flex items-center gap-4 rounded-[16px] bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="relative flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
                {logoPreview ? (
                  <img src={logoPreview} alt="Vendor profile" className="h-full w-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9 text-white/85">
                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <div className="text-[17px] font-bold">{form.nameAndTitle || form.fullName || form.username || "Vendor Profile"}</div>
                <div className="mt-1 text-[13px] text-white/80">{form.companyName || "Add company details"}</div>
                <div className="mt-3 inline-flex rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                  Upload new photo
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full rounded-[12px] bg-transparent p-0">
          <div className="w-full rounded-[12px] bg-transparent p-0 md:p-2">
            <div className="flex flex-col gap-3 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#98A2B3]">
                  Company Details
                </div>
                <h2 className="mt-2 text-[28px] font-extrabold text-[#141516]">
                  Vendor Profile Settings
                </h2>
                <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-[#667085]">
                  Keep your vendor identity current so documents, invoices and communication screens reflect the right information.
                </p>
              </div>
              <div className="rounded-[12px] bg-[#F8E9EB] px-4 py-3 text-[13px] font-medium text-[#8E1019]">
                {loadingProfile ? "Loading profile..." : "Changes save directly to your vendor profile."}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Full Name
                    </Typography>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Username
                    </Typography>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Company Name
                    </Typography>
                    <input
                      type="text"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Name And Title
                    </Typography>
                    <input
                      type="text"
                      name="nameAndTitle"
                      value={form.nameAndTitle}
                      onChange={handleChange}
                      placeholder="Enter name and title"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Contact Phone
                    </Typography>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={form.contactPhone}
                      onChange={handleChange}
                      placeholder="Enter contact phone number"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Email
                    </Typography>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      readOnly
                      disabled
                      placeholder="Email address"
                      className="w-full cursor-not-allowed rounded-[10px] border border-[#D0D5DD] bg-[#F9FAFB] px-4 py-3 text-[15px] text-[#667085] outline-none"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Office Phone
                    </Typography>
                    <input
                      type="tel"
                      name="officePhone"
                      value={form.officePhone}
                      onChange={handleChange}
                      placeholder="Enter office phone number"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      ZIP Code
                    </Typography>
                    <input
                      type="text"
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      placeholder="Enter ZIP code"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      Address
                    </Typography>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    />
                  </div>
                  <div>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      State
                    </Typography>
                    <select
                      name="stateId"
                      value={form.stateId}
                      onChange={handleChange}
                      className="w-full rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                    >
                      <option value="">{loadingStates ? "Loading..." : "Select state"}</option>
                      {states.map((state) => {
                        const id = state.StateId ?? state.stateId ?? state.id;
                        const name = state.StateName ?? state.stateName ?? state.name ?? `State ${id}`;
                        return (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div ref={cityRef}>
                    <Typography variant="paragraph" className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#475467]">
                      City
                    </Typography>
                    <div className="relative">
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setCityOpen((prev) => !prev)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") setCityOpen((prev) => !prev);
                        }}
                        className="flex min-h-[50px] w-full items-center justify-between rounded-[10px] border border-[#D0D5DD] bg-white px-4 py-3 text-[15px] text-[#101828] outline-none transition focus:border-[#C01824] focus:ring-2 focus:ring-[#F3D3D6]"
                      >
                        <span className={form.cityId ? "text-[#101828]" : "text-gray-400"}>
                          {loadingCities ? "Loading..." : form.cityId ? getCityName(form.cityId) : "Select city"}
                        </span>
                        <span className="text-gray-500">{cityOpen ? "▲" : "▼"}</span>
                      </div>
                      {cityOpen && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[10px] border border-[#D0D5DD] bg-white shadow-lg">
                          <input
                            type="text"
                            placeholder="Search city..."
                            value={citySearch}
                            onChange={(event) => setCitySearch(event.target.value)}
                            className="w-full border-b border-[#EAECF0] bg-[#F9FAFB] p-3 outline-none"
                          />
                          <div className="max-h-[220px] overflow-y-auto">
                            {filteredCities.map((city) => {
                              const id = city.CityId ?? city.cityId ?? city.id;
                              const name = city.CityName ?? city.cityName ?? city.name ?? `City ${id}`;
                              return (
                                <div
                                  key={id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => {
                                    setForm((prev) => ({ ...prev, cityId: String(id) }));
                                    setCityOpen(false);
                                    setCitySearch("");
                                  }}
                                  className="cursor-pointer px-4 py-3 hover:bg-[#F9FAFB]"
                                >
                                  {name}
                                </div>
                              );
                            })}
                            {!loadingCities && filteredCities.length === 0 && (
                              <div className="p-3 text-sm text-gray-500">No city found.</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border border-[#EAECF0] bg-white p-5">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#98A2B3]">
                    Quick Summary
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="rounded-[12px] bg-[#F9FAFB] p-4">
                      <div className="text-[12px] font-medium text-[#667085]">Profile Name</div>
                      <div className="mt-1 break-words text-[16px] font-bold text-[#141516]">
                        {form.fullName || "Not set yet"}
                      </div>
                    </div>
                    <div className="rounded-[12px] bg-[#F9FAFB] p-4">
                      <div className="text-[12px] font-medium text-[#667085]">Company</div>
                      <div className="mt-1 break-words text-[16px] font-bold text-[#141516]">
                        {form.companyName || "Not set yet"}
                      </div>
                    </div>
                    <div className="rounded-[12px] bg-[#F9FAFB] p-4">
                      <div className="text-[12px] font-medium text-[#667085]">Primary Contact</div>
                      <div className="mt-1 break-words text-[15px] font-semibold text-[#141516]">
                        {form.email || "No email"}
                      </div>
                      <div className="mt-1 text-[14px] text-[#667085]">
                        {form.contactPhone || "No phone"}
                      </div>
                    </div>
                  </div>

                  {error ? <p className="mt-5 text-sm text-[#C01824]">{error}</p> : null}
                  {success ? <p className="mt-5 text-sm text-green-600">Vendor profile saved successfully.</p> : null}

                  <Button
                    type="submit"
                    disabled={submitting || loadingProfile}
                    className="mt-6 flex w-full items-center justify-center rounded-[10px] bg-[#C01824] py-3 text-[17px] font-semibold capitalize shadow-md shadow-red-200"
                    variant="filled"
                    size="lg"
                  >
                    {submitting ? "Saving..." : loadingProfile ? "Loading..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VendorProfile;
