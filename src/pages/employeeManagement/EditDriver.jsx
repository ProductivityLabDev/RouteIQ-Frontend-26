import { pickFileIcon } from "@/assets";
import { employeeService } from "@/services/employeeService";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchCities,
  fetchPayCycles,
  fetchPayTypes,
  fetchStates,
  fetchTerminals,
} from "@/redux/slices/employeSlices";

const Field = ({ label, required, error, touched, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-black">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && touched && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide col-span-2 border-b pb-1 mb-1">
    {children}
  </h3>
);

const inputCls = (err, touch) =>
  `outline-none border rounded-md py-2.5 px-4 bg-[#F5F6FA] w-full text-sm ${
    err && touch ? "border-red-500" : "border-[#D5D5D5]"
  }`;

const FileUpload = ({ label, file, existingUrl, existingLabel, fileRef, onChange, onRemove }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-black">{label}</label>
    {file ? (
      <div className="border-2 border-green-500 rounded-lg p-3 bg-green-50 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-6 h-6 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 ml-4 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ) : (
      <>
        {existingUrl ? (
          <a
            href={existingUrl}
            target="_blank"
            rel="noreferrer"
            className="block border border-[#D5D5D5] rounded-lg px-4 py-3 bg-white text-sm text-[#C01824] hover:underline"
          >
            Current file: {existingLabel}
          </a>
        ) : null}
        <div className="border border-dashed border-[#EBB7BB] rounded-lg h-24 flex items-center justify-center gap-3 relative hover:border-[#C01824] transition-colors cursor-pointer">
          <input
            type="file"
            ref={fileRef}
            accept="image/*,.pdf,.doc,.docx"
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <img src={pickFileIcon} className="w-8 h-8" alt="upload" />
          <p className="text-sm text-red-600">Replace file</p>
        </div>
      </>
    )}
  </div>
);

const INITIAL_FORM = {
  name: "",
  address: "",
  city: "",
  stateId: "",
  zipCode: "",
  dateOfBirth: "",
  joiningDate: "",
  positionType: "",
  email: "",
  payGrade: "",
  routeRate: "",
  payCycle: "",
  payTypeId: "",
  fuelCardCode: "",
  terminalAssigned: "",
  phone: "",
  socialSecurityNo: "",
  bankName: "",
  accountNumber: "",
  routingNo: "",
  status: "Active",
};

const REQUIRED = [
  "name",
  "address",
  "city",
  "stateId",
  "zipCode",
  "dateOfBirth",
  "joiningDate",
  "email",
  "payCycle",
  "payTypeId",
  "terminalAssigned",
];

const validateField = (name, value, allValues = {}) => {
  const str = value == null ? "" : String(value).trim();
  switch (name) {
    case "name":
      if (!str) return "Name is required";
      if (str.length < 2) return "Minimum 2 characters";
      break;
    case "address":
      if (!str) return "Address is required";
      break;
    case "city":
      if (!str) return "City is required";
      break;
    case "stateId":
      if (!str) return "State is required";
      break;
    case "zipCode":
      if (!str) return "Zip code is required";
      if (!/^\d{5}(-\d{4})?$/.test(str)) return "Invalid zip code";
      break;
    case "dateOfBirth":
      if (!str) return "Date of birth is required";
      break;
    case "joiningDate":
      if (!str) return "Joining date is required";
      break;
    case "email":
      if (!str) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return "Invalid email address";
      break;
    case "phone":
      if (str) {
        const digits = str.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 15) return "Must be 10-15 digits";
      }
      break;
    case "payCycle":
      if (!str) return "Pay cycle is required";
      break;
    case "payTypeId":
      if (!str) return "Pay type is required";
      break;
    case "terminalAssigned":
      if (!str) return "Terminal is required";
      break;
    case "routeRate":
      if (str && (Number.isNaN(Number(str)) || Number(str) < 0)) return "Must be a positive number";
      break;
    case "bankName":
      if ((allValues.accountNumber || allValues.routingNo) && !str) return "Bank name is required";
      break;
    default:
      break;
  }
  return "";
};

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const EditDriver = ({ employee, handleCancel, onSaved }) => {
  const dispatch = useDispatch();
  const { payTypes, payCycles, terminals, states, cities } = useSelector((s) => s.employees);

  const employeeId = employee?.EmployeeId || employee?.employeeId || employee?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [employeeDetail, setEmployeeDetail] = useState(null);

  const [existingFiles, setExistingFiles] = useState({
    profile: "",
    license: "",
    certificate: "",
  });

  const fileRef = useRef(null);
  const licenseRef = useRef(null);
  const certRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  const cityDropdownRef = useRef(null);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState("");

  useEffect(() => {
    dispatch(fetchPayTypes());
    dispatch(fetchPayCycles());
    dispatch(fetchTerminals());
    dispatch(fetchStates());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    const loadEmployee = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getEmployeeById(Number(employeeId));
        const data = response.data || {};
        setEmployeeDetail(data);
        setExistingFiles({
          profile: data.FilePath || data.filePath || "",
          license:
            data.DrivingLicensePath ||
            data.drivingLicensePath ||
            data.LicensePath ||
            data.licensePath ||
            "",
          certificate:
            data.CertificatePath ||
            data.certificatesPath ||
            data.CertificatesPath ||
            "",
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  const filteredCities = useMemo(
    () =>
      (cities || []).filter((city) =>
        city.CityName?.toLowerCase().includes(citySearch.toLowerCase())
      ),
    [cities, citySearch]
  );

  useEffect(() => {
    if (!employeeDetail) return;

    const findStateId =
      employeeDetail.StateId ||
      employeeDetail.stateId ||
      states.find(
        (state) =>
          String(state.StateName || "").toLowerCase() ===
          String(employeeDetail.StateName || "").toLowerCase()
      )?.StateId ||
      "";

    const findCity =
      cities.find((city) => city.CityId === employeeDetail.CityId) ||
      cities.find(
        (city) =>
          String(city.CityName || "").toLowerCase() ===
          String(employeeDetail.CityName || "").toLowerCase()
      );

    const findTerminalId =
      employeeDetail.TerminalAssignedId ||
      employeeDetail.terminalAssignedId ||
      terminals.find(
        (terminal) =>
          String(terminal.TerminalName || terminal.name || "").toLowerCase() ===
          String(employeeDetail.TerminalName || "").toLowerCase()
      )?.TerminalId ||
      terminals.find(
        (terminal) =>
          String(terminal.TerminalCode || "").toLowerCase() ===
          String(employeeDetail.TerminalCode || "").toLowerCase()
      )?.TerminalId ||
      "";

    const findPayCycleId =
      employeeDetail.PayCycleId ||
      payCycles.find(
        (cycle) =>
          String(cycle.PayCycleName || cycle.name || "").toLowerCase() ===
          String(employeeDetail.PayCycleName || "").toLowerCase()
      )?.PayCycleId ||
      "";

    const findPayTypeId =
      employeeDetail.PayTypeId ||
      payTypes.find(
        (type) =>
          String(type.PayTypeName || type.name || "").toLowerCase() ===
          String(employeeDetail.PayTypeName || "").toLowerCase()
      )?.PayTypeId ||
      "";

    setFormData({
      name: employeeDetail.Name || "",
      address: employeeDetail.Address || "",
      city: findCity?.CityId ? String(findCity.CityId) : "",
      stateId: findStateId ? String(findStateId) : "",
      zipCode: employeeDetail.ZipCode || "",
      dateOfBirth: formatDateInput(employeeDetail.DateOfBirth),
      joiningDate: formatDateInput(employeeDetail.JoiningDate),
      positionType:
        employeeDetail.PositionType != null ? String(employeeDetail.PositionType) : "",
      email: employeeDetail.Email || "",
      payGrade: employeeDetail.PayGrade || "",
      routeRate:
        employeeDetail.RouteRate != null ? String(employeeDetail.RouteRate) : "",
      payCycle: findPayCycleId ? String(findPayCycleId) : "",
      payTypeId: findPayTypeId ? String(findPayTypeId) : "",
      fuelCardCode:
        employeeDetail.FuelCardCode != null ? String(employeeDetail.FuelCardCode) : "",
      terminalAssigned: findTerminalId ? String(findTerminalId) : "",
      phone: employeeDetail.Phone || "",
      socialSecurityNo:
        employeeDetail.SocialSecurityNo || employeeDetail.SSN || "",
      bankName: employeeDetail.BankName || employeeDetail.bankName || "",
      accountNumber: employeeDetail.AccountNumber || "",
      routingNo: employeeDetail.RoutingNo || "",
      status: employeeDetail.Status || "Active",
    });

    setSelectedCityName(findCity?.CityName || employeeDetail.CityName || "");
  }, [employeeDetail, cities, states, terminals, payCycles, payTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, { ...formData, [name]: value }) }));
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city: String(city.CityId) }));
    setSelectedCityName(city.CityName || "");
    setCitySearch("");
    setShowCityDropdown(false);
    setErrors((prev) => ({ ...prev, city: "" }));
  };

  const makeFileHandler = (setter, ref) => ({
    onChange: (e) => {
      const file = e.target.files?.[0];
      if (file) setter(file);
    },
    onRemove: () => {
      setter(null);
      if (ref.current) ref.current.value = "";
    },
  });

  const photoHandlers = makeFileHandler(setSelectedFile, fileRef);
  const licenseHandlers = makeFileHandler(setLicenseFile, licenseRef);
  const certHandlers = makeFileHandler(setCertFile, certRef);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resolvedCityId =
      formData.city ||
      cities.find(
        (city) =>
          String(city.CityName || "").toLowerCase() ===
          String(selectedCityName || citySearch || "").toLowerCase()
      )?.CityId ||
      "";

    const resolvedStateId =
      formData.stateId ||
      states.find(
        (state) =>
          String(state.StateName || "").toLowerCase() ===
          String(employeeDetail?.StateName || "").toLowerCase()
      )?.StateId ||
      "";

    const resolvedPayCycleId =
      formData.payCycle ||
      payCycles.find(
        (cycle) =>
          String(cycle.PayCycleName || cycle.name || "").toLowerCase() ===
          String(employeeDetail?.PayCycleName || "").toLowerCase()
      )?.PayCycleId ||
      "";

    const resolvedPayTypeId =
      formData.payTypeId ||
      payTypes.find(
        (type) =>
          String(type.PayTypeName || type.name || "").toLowerCase() ===
          String(employeeDetail?.PayTypeName || "").toLowerCase()
      )?.PayTypeId ||
      "";

    const resolvedTerminalId =
      formData.terminalAssigned ||
      terminals.find(
        (terminal) =>
          String(terminal.TerminalName || terminal.name || "").toLowerCase() ===
          String(employeeDetail?.TerminalName || "").toLowerCase()
      )?.TerminalId ||
      "";

    const validationData = {
      ...formData,
      city: resolvedCityId ? String(resolvedCityId) : "",
      stateId: resolvedStateId ? String(resolvedStateId) : "",
      payCycle: resolvedPayCycleId ? String(resolvedPayCycleId) : "",
      payTypeId: resolvedPayTypeId ? String(resolvedPayTypeId) : "",
      terminalAssigned: resolvedTerminalId ? String(resolvedTerminalId) : "",
    };

    const newTouched = {};
    const newErrors = {};
    REQUIRED.forEach((key) => {
      newTouched[key] = true;
      newErrors[key] = validateField(key, validationData[key], validationData);
    });
    ["phone", "routeRate", "bankName"].forEach((key) => {
      if (validationData[key] || key === "bankName") {
        newErrors[key] = validateField(key, validationData[key], validationData);
      }
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));

    if (Object.values(newErrors).some(Boolean)) {
      const firstErrorField = REQUIRED.find((key) => newErrors[key]) || ["phone", "routeRate"].find((key) => newErrors[key]);
      if (firstErrorField) {
        const node = document.querySelector(`[name="${firstErrorField}"]`);
        node?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        node?.focus?.();
      }
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      if (selectedFile) payload.append("filePath", selectedFile);
      if (licenseFile) payload.append("drivingLicenses", licenseFile);
      if (certFile) payload.append("certificates", certFile);

      const normalizedDob = formData.dateOfBirth || "";

      const emergencyDigits = String(formData.phone || "").replace(/\D/g, "");
      const normalizedEmergencyContact = emergencyDigits
        ? String(Number(emergencyDigits))
        : "";

      payload.append("name", formData.name || "");
      payload.append("adress", formData.address || "");
      payload.append("city", String(resolvedCityId || "0"));
      payload.append("zipCode", formData.zipCode || "");
      payload.append("stateId", String(resolvedStateId || "0"));
      payload.append("dob", normalizedDob);
      payload.append("joiningDate", formData.joiningDate || "");
      payload.append("status", formData.status || "Active");
      payload.append("positionType", formData.positionType || "");
      payload.append("email", formData.email || "");
      payload.append("phone", formData.phone || "");
      payload.append("emergencyContact", normalizedEmergencyContact);
      payload.append("payGrade", formData.payGrade || "");
      payload.append("routeRate", formData.routeRate || "");
      payload.append("terminalAssigmedId", String(resolvedTerminalId || ""));
      payload.append("fuelCardCode", formData.fuelCardCode || "0");
      payload.append("payCycleId", String(resolvedPayCycleId || ""));
      payload.append("payType", String(resolvedPayTypeId || ""));
      payload.append("socialSecurityNo", formData.socialSecurityNo || "");
      payload.append("bankName", formData.bankName || "");
      payload.append("accountNumber", formData.accountNumber || "");
      payload.append("routingNo", formData.routingNo || "");

      const result = await employeeService.updateEmployee(Number(employeeId), payload);

      toast.success(result?.data?.message || "Employee updated successfully");
      onSaved?.();
      handleCancel?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  const isDriver = Number(formData.positionType) === 1;

  if (loading) {
    return (
      <div className="bg-white w-full rounded-lg border shadow-sm p-10 text-center text-gray-500">
        Loading employee...
      </div>
    );
  }

  return (
    <div className="bg-white w-full rounded-lg border shadow-sm">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-6">
          <SectionTitle>Personal Information</SectionTitle>

          <Field label="Position Type">
            <select
              name="positionType"
              value={formData.positionType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.positionType, touched.positionType)}
            >
              <option value="">Select position</option>
              <option value="1">Driver</option>
              <option value="2">Dispatcher</option>
              <option value="3">Mechanic</option>
              <option value="4">Terminal Manager</option>
              <option value="5">Retailer</option>
            </select>
          </Field>

          <Field label="Full Name" required error={errors.name} touched={touched.name}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Employee full name"
              className={inputCls(errors.name, touched.name)}
            />
          </Field>

          <Field label="Date of Birth" required error={errors.dateOfBirth} touched={touched.dateOfBirth}>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.dateOfBirth, touched.dateOfBirth)}
            />
          </Field>

          <Field label="Phone" error={errors.phone} touched={touched.phone}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 555-0101"
              className={inputCls(errors.phone, touched.phone)}
            />
          </Field>

          <Field label="Email" required error={errors.email} touched={touched.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="employee@example.com"
              className={inputCls(errors.email, touched.email)}
            />
          </Field>

          <Field label="Address" required error={errors.address} touched={touched.address}>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Street address"
              className={inputCls(errors.address, touched.address)}
            />
          </Field>

          <Field label="State" required error={errors.stateId} touched={touched.stateId}>
            <select
              name="stateId"
              value={formData.stateId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.stateId, touched.stateId)}
            >
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.StateId} value={state.StateId}>
                  {state.StateName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="City" required error={errors.city} touched={touched.city}>
            <div className="relative" ref={cityDropdownRef}>
              <input
                type="text"
                value={citySearch || selectedCityName}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowCityDropdown(true);
                  if (!e.target.value) {
                    setFormData((prev) => ({ ...prev, city: "" }));
                    setSelectedCityName("");
                  }
                }}
                onFocus={() => {
                  setShowCityDropdown(true);
                  if (selectedCityName) setCitySearch("");
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, city: true }));
                  setErrors((prev) => ({
                    ...prev,
                    city: validateField("city", formData.city),
                  }));
                }}
                placeholder="Search city..."
                className={inputCls(errors.city, touched.city)}
              />
              {showCityDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <div
                        key={city.CityId}
                        onClick={() => handleCitySelect(city)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {city.CityName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      {citySearch ? "No cities found" : "Start typing..."}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Field>

          <Field label="Zip Code" required error={errors.zipCode} touched={touched.zipCode}>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 12345"
              className={inputCls(errors.zipCode, touched.zipCode)}
            />
          </Field>

          <SectionTitle>Employment</SectionTitle>

          <Field label="Start Date" required error={errors.joiningDate} touched={touched.joiningDate}>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.joiningDate, touched.joiningDate)}
            />
          </Field>

          <Field label="Terminal Assigned" required error={errors.terminalAssigned} touched={touched.terminalAssigned}>
            <select
              name="terminalAssigned"
              value={formData.terminalAssigned}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.terminalAssigned, touched.terminalAssigned)}
            >
              <option value="">Select terminal</option>
              {terminals.map((terminal) => (
                <option key={terminal.TerminalId || terminal.id} value={terminal.TerminalId || terminal.id}>
                  {terminal.TerminalName || terminal.name || "N/A"}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pay Grade">
            <input
              type="text"
              name="payGrade"
              value={formData.payGrade}
              onChange={handleChange}
              placeholder="e.g. D3"
              className={inputCls(errors.payGrade, touched.payGrade)}
            />
          </Field>

          <Field label="Pay Type" required error={errors.payTypeId} touched={touched.payTypeId}>
            <select
              name="payTypeId"
              value={formData.payTypeId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.payTypeId, touched.payTypeId)}
            >
              <option value="">Select pay type</option>
              {payTypes.map((type) => (
                <option key={type.PayTypeId || type.id} value={type.PayTypeId || type.id}>
                  {type.PayTypeName || type.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Pay Cycle" required error={errors.payCycle} touched={touched.payCycle}>
            <select
              name="payCycle"
              value={formData.payCycle}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputCls(errors.payCycle, touched.payCycle)}
            >
              <option value="">Select pay cycle</option>
              {payCycles.map((cycle) => (
                <option key={cycle.PayCycleId || cycle.id} value={cycle.PayCycleId || cycle.id}>
                  {cycle.PayCycleName || cycle.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Route Rate" error={errors.routeRate} touched={touched.routeRate}>
            <input
              type="number"
              name="routeRate"
              value={formData.routeRate}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              step="0.01"
              placeholder="e.g. 25.00"
              className={inputCls(errors.routeRate, touched.routeRate)}
            />
          </Field>

          <Field label="Fuel Card Code">
            <input
              type="text"
              name="fuelCardCode"
              value={formData.fuelCardCode}
              onChange={handleChange}
              className={inputCls(errors.fuelCardCode, touched.fuelCardCode)}
            />
          </Field>

          <SectionTitle>Financial Information</SectionTitle>

          <Field label="Social Security No">
            <input
              type="password"
              name="socialSecurityNo"
              value={formData.socialSecurityNo}
              onChange={handleChange}
              placeholder="XXX-XX-XXXX"
              className={inputCls(errors.socialSecurityNo, touched.socialSecurityNo)}
            />
          </Field>

          <Field label="Bank Name" error={errors.bankName} touched={touched.bankName}>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Bank name"
              className={inputCls(errors.bankName, touched.bankName)}
            />
          </Field>

          <Field label="Account Number">
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={inputCls(errors.accountNumber, touched.accountNumber)}
            />
          </Field>

          <Field label="Routing Number">
            <input
              type="text"
              name="routingNo"
              value={formData.routingNo}
              onChange={handleChange}
              className={inputCls(errors.routingNo, touched.routingNo)}
            />
          </Field>

          <SectionTitle>Documents</SectionTitle>

          <FileUpload
            label="Profile Photo"
            file={selectedFile}
            existingUrl={existingFiles.profile}
            existingLabel="Current profile file"
            fileRef={fileRef}
            onChange={photoHandlers.onChange}
            onRemove={photoHandlers.onRemove}
          />

          {isDriver ? (
            <FileUpload
              label="Driving License"
              file={licenseFile}
              existingUrl={existingFiles.license}
              existingLabel="Current driving license"
              fileRef={licenseRef}
              onChange={licenseHandlers.onChange}
              onRemove={licenseHandlers.onRemove}
            />
          ) : (
            <div />
          )}

          <FileUpload
            label="Certificates"
            file={certFile}
            existingUrl={existingFiles.certificate}
            existingLabel="Current certificate file"
            fileRef={certRef}
            onChange={certHandlers.onChange}
            onRemove={certHandlers.onRemove}
          />
        </div>

        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-2.5 bg-[#C01824] text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update Employee"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-10 py-2.5 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDriver;
