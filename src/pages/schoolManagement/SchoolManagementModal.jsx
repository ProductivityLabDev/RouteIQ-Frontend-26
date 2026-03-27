import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createInstitute,
  fetchCities,
  fetchInstituteTypes,
  fetchStates,
  fetchTerminals,
} from "@/redux/slices/schoolSlice";
import { toast } from "react-hot-toast";

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-[#171a2a]">
      {label} {required && <span className="text-[#c01824]">*</span>}
    </label>
    {children}
    {error ? (
      <p className="flex items-center gap-1 text-xs text-[#c01824]">
        <span>!</span> {error}
      </p>
    ) : null}
  </div>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 rounded-2xl bg-[#fff1f2] border border-[#f4d4d7] flex items-center justify-center text-base shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a27f83]">Section</p>
      <p className="text-sm font-bold text-[#171a2a]">{title}</p>
      {subtitle ? <p className="text-xs text-[#8a8d98] mt-0.5">{subtitle}</p> : null}
    </div>
    <div className="flex-1 h-px bg-[#ebe6da]" />
  </div>
);

const inputCls = (hasError) =>
  `w-full outline-none border rounded-xl h-12 pl-6 pr-11 [text-indent:0.35rem] bg-[#fafaf8] text-sm text-[#171a2a] placeholder:text-[#b3b3b3] transition-all ${
    hasError
      ? "border-[#c01824] bg-red-50 focus:border-[#c01824]"
      : "border-[#ddd5c7] focus:border-[#c01824] focus:bg-white"
  }`;

const INITIAL = {
  district: "",
  president: "",
  terminal: "",
  principal: "",
  school: "",
  totalStudent: "",
  totalBuses: "",
  contact: "",
  Address: "",
  Email: "",
  PhoneNo: "",
  instituteType: "",
  stateId: "",
  city: "",
  ZipCode: "",
};

const validateForm = (formData) => {
  const errors = {};
  if (!formData.school.trim()) errors.school = "School name is required";
  if (!formData.terminal) errors.terminal = "Terminal is required";
  if (!formData.instituteType) errors.instituteType = "Institute type is required";
  if (!formData.Address.trim()) errors.Address = "Address is required";

  if (formData.Email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email.trim())) {
    errors.Email = "Invalid email address";
  }

  if (formData.PhoneNo.trim()) {
    const digits = formData.PhoneNo.replace(/[\s\-()]/g, "");
    if (digits.length < 7) errors.PhoneNo = "Invalid phone number";
  }

  if (formData.ZipCode.trim() && !/^\d{5}(-\d{4})?$/.test(formData.ZipCode.trim())) {
    errors.ZipCode = "Invalid zip code (e.g. 12345)";
  }

  return errors;
};

export function SchoolManagementModal({
  open,
  handleOpen,
  editInstitute,
  editSchoolData,
  refreshSchools,
}) {
  const dispatch = useAppDispatch();
  const { terminals, instituteTypes, states, cities, loading } = useAppSelector((s) => s.schools);

  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const cityDropdownRef = useRef(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (!open) return;
    dispatch(fetchTerminals());
    dispatch(fetchInstituteTypes());
    dispatch(fetchStates());
    dispatch(fetchCities());
  }, [open, dispatch]);

  useEffect(() => {
    if (editInstitute && editSchoolData) {
      setFormData({
        district: editSchoolData.district || "",
        president: editSchoolData.president || "",
        terminal: editSchoolData.terminal || "",
        principal: editSchoolData.principal || editSchoolData.principle || "",
        school: editSchoolData.school || editSchoolData.name || "",
        totalStudent: editSchoolData.totalStudent || editSchoolData.totalStudents || "",
        totalBuses: editSchoolData.totalBuses || "",
        contact: editSchoolData.contact || "",
        Address: editSchoolData.Address || editSchoolData.address || "",
        Email: editSchoolData.Email || editSchoolData.email || "",
        PhoneNo: editSchoolData.PhoneNo || editSchoolData.phoneNo || "",
        instituteType: editSchoolData.instituteType || editSchoolData.InstituteType || "",
        stateId: editSchoolData.stateId || editSchoolData.StateId || "",
        city: editSchoolData.city || editSchoolData.City || "",
        ZipCode: editSchoolData.ZipCode || editSchoolData.zipCode || "",
      });
    } else {
      setFormData(INITIAL);
      setErrors({});
      setTouched({});
      setCitySearch("");
      setShowCityDropdown(false);
    }
  }, [editInstitute, editSchoolData, open]);

  useEffect(() => {
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCities = Array.isArray(cities)
    ? cities.filter((c) => c.CityName?.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 100)
    : [];

  const selectedCityName =
    cities.find((c) => c.CityId === Number(formData.city))?.CityName || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validateForm(formData);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] || "" }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city: city.CityId }));
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateForm(formData);
    setTouched({
      school: true,
      terminal: true,
      instituteType: true,
      Address: true,
      Email: true,
      PhoneNo: true,
      ZipCode: true,
    });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      const result = await dispatch(createInstitute(formData));
      if (createInstitute.fulfilled.match(result)) {
        toast.success(result.payload?.message || "School created successfully!");
        refreshSchools?.();
        handleOpen();
      } else {
        toast.error(result.payload || "Failed to create school. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create school. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="!m-0 !w-[92vw] !max-w-[820px] !min-w-0 !rounded-3xl !shadow-2xl !p-0 !overflow-hidden bg-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebe6da] bg-[#faf9f6]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#c01824] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c01824]">School Management</p>
            <h2 className="text-lg font-bold text-[#171a2a] leading-tight">
              {editInstitute ? "Edit School" : "Add New School"}
            </h2>
          </div>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#ddd5c7] text-[#6f7280] hover:bg-[#f3f1eb] transition-colors shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-6 py-5 overflow-y-auto space-y-5" style={{ maxHeight: "calc(100vh - 200px)" }}>

          {/* Section 1 — Basic Info */}
          <div>
            <SectionTitle icon="🏫" title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="School Name" required error={touched.school && errors.school}>
                <input type="text" name="school" value={formData.school}
                  onChange={handleChange} onBlur={() => handleBlur("school")}
                  placeholder="e.g. Lincoln High School"
                  className={inputCls(touched.school && errors.school)} />
              </Field>

              <Field label="Institute Type" required error={touched.instituteType && errors.instituteType}>
                <select name="instituteType" value={formData.instituteType}
                  onChange={handleChange} onBlur={() => handleBlur("instituteType")}
                  className={inputCls(touched.instituteType && errors.instituteType)}>
                  <option value="">Select institute type</option>
                  {loading.instituteTypes ? <option disabled>Loading...</option>
                    : instituteTypes.map((t) => <option key={t.Id} value={t.Id}>{t.InstituteTypeName}</option>)}
                </select>
              </Field>

              <Field label="Terminal" required error={touched.terminal && errors.terminal}>
                <select name="terminal" value={formData.terminal}
                  onChange={handleChange} onBlur={() => handleBlur("terminal")}
                  className={inputCls(touched.terminal && errors.terminal)}>
                  <option value="">Select terminal</option>
                  {loading.terminals ? <option disabled>Loading...</option>
                    : terminals.map((t) => {
                      const id = t.TerminalId ?? t.id;
                      const name = t.TerminalName ?? t.name ?? `Terminal ${id}`;
                      return <option key={id} value={id}>{name}</option>;
                    })}
                </select>
              </Field>

              <Field label="District">
                <input type="text" name="district" value={formData.district}
                  onChange={handleChange} placeholder="School district" className={inputCls()} />
              </Field>

              <Field label="Principal">
                <input type="text" name="principal" value={formData.principal}
                  onChange={handleChange} placeholder="Principal name" className={inputCls()} />
              </Field>

              <Field label="President">
                <input type="text" name="president" value={formData.president}
                  onChange={handleChange} placeholder="President name" className={inputCls()} />
              </Field>

              <Field label="Total Students">
                <input type="number" name="totalStudent" value={formData.totalStudent}
                  onChange={handleChange} placeholder="e.g. 500" min={0} className={inputCls()} />
              </Field>

              <Field label="Total Buses">
                <input type="number" name="totalBuses" value={formData.totalBuses}
                  onChange={handleChange} placeholder="e.g. 10" min={0} className={inputCls()} />
              </Field>
            </div>
          </div>

          {/* Section 2 — Contact */}
          <div>
            <SectionTitle icon="📞" title="Contact Details" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Email" error={touched.Email && errors.Email}>
                <input type="email" name="Email" value={formData.Email}
                  onChange={handleChange} onBlur={() => handleBlur("Email")}
                  placeholder="school@example.com"
                  className={inputCls(touched.Email && errors.Email)} />
              </Field>

              <Field label="Phone No" error={touched.PhoneNo && errors.PhoneNo}>
                <input type="tel" name="PhoneNo" value={formData.PhoneNo}
                  onChange={handleChange} onBlur={() => handleBlur("PhoneNo")}
                  placeholder="e.g. 555-0123"
                  className={inputCls(touched.PhoneNo && errors.PhoneNo)} />
              </Field>

              <Field label="Contact Person">
                <input type="text" name="contact" value={formData.contact}
                  onChange={handleChange} placeholder="Contact person name" className={inputCls()} />
              </Field>
            </div>
          </div>

          {/* Section 3 — Location */}
          <div>
            <SectionTitle icon="📍" title="Location" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Address" required error={touched.Address && errors.Address}>
                <input type="text" name="Address" value={formData.Address}
                  onChange={handleChange} onBlur={() => handleBlur("Address")}
                  placeholder="Street address"
                  className={inputCls(touched.Address && errors.Address)} />
              </Field>

              <Field label="Zip Code" error={touched.ZipCode && errors.ZipCode}>
                <input type="text" name="ZipCode" value={formData.ZipCode}
                  onChange={handleChange} onBlur={() => handleBlur("ZipCode")}
                  placeholder="e.g. 12345"
                  className={inputCls(touched.ZipCode && errors.ZipCode)} />
              </Field>

              <Field label="State">
                <select name="stateId" value={formData.stateId}
                  onChange={handleChange} className={inputCls()}>
                  <option value="">Select state</option>
                  {loading.states ? <option disabled>Loading...</option>
                    : states.map((s) => <option key={s.StateId} value={s.StateId}>{s.StateName}</option>)}
                </select>
              </Field>

              <Field label="City">
                <div className="relative" ref={cityDropdownRef}>
                  <input
                    type="text"
                    value={citySearch || selectedCityName}
                    onChange={(e) => {
                      setCitySearch(e.target.value);
                      setShowCityDropdown(true);
                      if (!e.target.value) setFormData((prev) => ({ ...prev, city: "" }));
                    }}
                    onFocus={() => { setShowCityDropdown(true); if (selectedCityName) setCitySearch(""); }}
                    placeholder={loading.cities ? "Loading cities..." : "Search city..."}
                    className={inputCls()}
                  />
                  {showCityDropdown && !loading.cities ? (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-[#ddd5c7] rounded-xl shadow-lg max-h-44 overflow-y-auto">
                      {filteredCities.length > 0
                        ? filteredCities.map((city) => (
                          <div key={city.CityId} onClick={() => handleCitySelect(city)}
                            className="px-4 py-2 hover:bg-[#f3f1eb] cursor-pointer text-sm text-[#171a2a] transition-colors">
                            {city.CityName}
                          </div>
                        ))
                        : <div className="px-4 py-3 text-sm text-[#6f7280]">
                            {citySearch ? "No cities found" : "Start typing to search..."}
                          </div>
                      }
                    </div>
                  ) : null}
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#ebe6da] bg-[#faf9f6]">
          <button
            type="button"
            onClick={handleOpen}
            disabled={loading.creating}
            className="px-5 py-2 rounded-xl border border-[#ddd5c7] text-sm font-semibold text-[#171a2a] hover:bg-[#f3f1eb] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading.creating}
            className="px-5 py-2 rounded-xl bg-[#c01824] text-sm font-semibold text-white hover:bg-[#a61520] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading.creating ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : null}
            {loading.creating ? "Submitting..." : editInstitute ? "Update School" : "Add School"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
