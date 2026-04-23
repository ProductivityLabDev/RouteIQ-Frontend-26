import { pickFileIcon } from '@/assets';
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchPayTypes, fetchPayCycles, fetchTerminals, fetchStates, fetchCities, createEmployee } from '@/redux/slices/employeSlices';

// ── Reusable helpers ────────────────────────────────────────────────────────
const Field = ({ label, required, error, touched, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-black">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
);

const inputCls = (err, touch) =>
    `outline-none border rounded-md py-2.5 px-4 bg-[#F5F6FA] w-full text-sm ${err && touch ? 'border-red-500' : 'border-[#D5D5D5]'}`;

const SectionTitle = ({ children }) => (
    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide col-span-2 border-b pb-1 mb-1">{children}</h3>
);

const getFlagEmoji = (countryCode) =>
    String.fromCodePoint(...countryCode.toUpperCase().split('').map((char) => 127397 + char.charCodeAt()));

const PHONE_COUNTRIES = [
    { code: "US", label: "United States", flag: "🇺🇸", dialCode: "+1", maxLength: 10 },
    { code: "CA", label: "Canada", flag: "🇨🇦", dialCode: "+1", maxLength: 10 },
    { code: "MX", label: "Mexico", flag: "🇲🇽", dialCode: "+52", maxLength: 10 },
    { code: "GB", label: "United Kingdom", flag: "🇬🇧", dialCode: "+44", maxLength: 10 },
    { code: "DE", label: "Germany", flag: "🇩🇪", dialCode: "+49", maxLength: 11 },
    { code: "FR", label: "France", flag: "🇫🇷", dialCode: "+33", maxLength: 9 },
    { code: "ES", label: "Spain", flag: "🇪🇸", dialCode: "+34", maxLength: 9 },
    { code: "IT", label: "Italy", flag: "🇮🇹", dialCode: "+39", maxLength: 10 },
    { code: "PK", label: "Pakistan", flag: "🇵🇰", dialCode: "+92", maxLength: 10 },
    { code: "IN", label: "India", flag: "🇮🇳", dialCode: "+91", maxLength: 10 },
    { code: "BD", label: "Bangladesh", flag: "🇧🇩", dialCode: "+880", maxLength: 10 },
    { code: "SA", label: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966", maxLength: 9 },
    { code: "AE", label: "UAE", flag: "🇦🇪", dialCode: "+971", maxLength: 9 },
    { code: "QA", label: "Qatar", flag: "🇶🇦", dialCode: "+974", maxLength: 8 },
    { code: "AU", label: "Australia", flag: "🇦🇺", dialCode: "+61", maxLength: 9 },
];

// ── File upload box ─────────────────────────────────────────────────────────
const FileUpload = ({ label, file, fileRef, onChange, onRemove }) => (
    <div>
        <label className="text-sm font-medium text-black">{label}</label>
        {!file ? (
            <div className="mt-1 border border-dashed border-[#EBB7BB] rounded-lg h-24 flex items-center justify-center gap-3 relative hover:border-[#C01824] transition-colors cursor-pointer">
                <input
                    type="file"
                    ref={fileRef}
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <img src={pickFileIcon} className="w-8 h-8" alt="upload" />
                <p className="text-sm text-red-600">Drag & drop or click to upload</p>
            </div>
        ) : (
            <div className="mt-1 border-2 border-green-500 rounded-lg p-3 bg-green-50 flex items-center justify-between">
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
        )}
    </div>
);

// ── Validation ──────────────────────────────────────────────────────────────
const INITIAL_FORM = {
    name: '', address: '', city: '', stateId: '', zipCode: '',
    dateOfBirth: '', joiningDate: '', positionType: '', email: '',
    payGrade: '', routeRate: '', payCycle: '', payTypeId: '',
    fuelCardCode: '', terminalAssigned: '', phone: '', phoneCountry: 'US',
    socialSecurityNo: '', bankName: '', accountNumber: '', routingNo: '',
};

const validateField = (name, value, allValues = {}) => {
    const str = value == null ? '' : String(value).trim();
    if (name === 'phone') {
        if (!str) return '';
        const digits = str.replace(/\D/g, '');
        const selectedCountry = PHONE_COUNTRIES.find((country) => country.code === allValues.phoneCountry) || PHONE_COUNTRIES[0];
        if (digits.length < 6 || digits.length > selectedCountry.maxLength) return `Must be 6-${selectedCountry.maxLength} digits`;
        return '';
    }
    switch (name) {
        case 'name':
            if (!str) return 'Name is required';
            if (str.length < 2) return 'Minimum 2 characters';
            break;
        case 'address':
            if (!str) return 'Address is required';
            break;
        case 'city':
            if (!str) return 'City is required';
            break;
        case 'stateId':
            if (!str) return 'State is required';
            break;
        case 'zipCode':
            if (!str) return 'Zip code is required';
            if (!/^\d{5}(-\d{4})?$/.test(str)) return 'Invalid zip code (e.g. 12345)';
            break;
        case 'dateOfBirth': {
            if (!str) return 'Date of birth is required';
            const age = new Date().getFullYear() - new Date(str).getFullYear();
            if (age < 18 || age > 100) return 'Age must be between 18–100';
            break;
        }
        case 'joiningDate':
            if (!str) return 'Start date is required';
            break;
        case 'email':
            if (!str) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return 'Invalid email address';
            break;
        case 'phone':
            if (str) {
                const digits = str.replace(/[\s\-()]/g, '');
                if (digits.length < 10 || digits.length > 15) return 'Must be 10–15 digits';
            }
            break;
        case 'payCycle':
            if (!str) return 'Pay cycle is required';
            break;
        case 'payTypeId':
            if (!str) return 'Pay type is required';
            break;
        case 'terminalAssigned':
            if (!str) return 'Terminal is required';
            break;
        case 'routeRate':
            if (str && (isNaN(parseFloat(str)) || parseFloat(str) < 0)) return 'Must be a positive number';
            break;
        case 'bankName':
            if ((allValues.accountNumber || allValues.routingNo) && !str) return 'Bank name is required';
            break;
        default:
            break;
    }
    return '';
};

const REQUIRED = ['name', 'address', 'city', 'stateId', 'zipCode', 'dateOfBirth', 'joiningDate', 'email', 'payCycle', 'payTypeId', 'terminalAssigned'];

// ── Component ───────────────────────────────────────────────────────────────
const AddDriver = ({ handleCancel }) => {
    const dispatch = useDispatch();
    const { payTypes, payCycles, terminals, states, cities, loading } = useSelector((s) => s.employees);

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors]     = useState({});
    const [touched, setTouched]   = useState({});

    // Photo upload
    const fileRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // License upload (Driver only)
    const licenseRef = useRef(null);
    const [licenseFile, setLicenseFile] = useState(null);

    // Certificate upload
    const certRef = useRef(null);
    const [certFile, setCertFile] = useState(null);

    // City searchable dropdown
    const cityDropdownRef = useRef(null);
    const [citySearch, setCitySearch]         = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [selectedCityName, setSelectedCityName] = useState('');
    const phoneCountryDropdownRef = useRef(null);
    const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] = useState(false);

    useEffect(() => {
        dispatch(fetchPayTypes());
        dispatch(fetchPayCycles());
        dispatch(fetchTerminals());
        dispatch(fetchStates());
        dispatch(fetchCities());
    }, [dispatch]);

    // Close city dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target))
                setShowCityDropdown(false);
            if (phoneCountryDropdownRef.current && !phoneCountryDropdownRef.current.contains(e.target))
                setShowPhoneCountryDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filteredCities = (cities || []).filter((c) =>
        c.CityName?.toLowerCase().includes(citySearch.toLowerCase())
    );

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const selectedCountry = PHONE_COUNTRIES.find((country) => country.code === formData.phoneCountry) || PHONE_COUNTRIES[0];
            const digitsOnly = value.replace(/\D/g, '').slice(0, selectedCountry.maxLength);
            setFormData((p) => ({ ...p, [name]: digitsOnly }));
        } else {
            setFormData((p) => ({ ...p, [name]: value }));
        }
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((p) => ({ ...p, [name]: true }));
        setErrors((p) => ({ ...p, [name]: validateField(name, value, { ...formData, [name]: value }) }));
    };

    const handlePhoneCountryChange = (e) => {
        const nextCountry = e.target.value;
        const selectedCountry = PHONE_COUNTRIES.find((country) => country.code === nextCountry) || PHONE_COUNTRIES[0];
        setFormData((p) => ({
            ...p,
            phoneCountry: nextCountry,
            phone: String(p.phone || '').replace(/\D/g, '').slice(0, selectedCountry.maxLength),
        }));
        setTouched((p) => ({ ...p, phone: true }));
        setErrors((p) => ({
            ...p,
            phone: validateField('phone', formData.phone, { ...formData, phoneCountry: nextCountry }),
        }));
    };

    const handleCitySelect = (city) => {
        setFormData((p) => ({ ...p, city: city.CityId != null ? String(city.CityId) : '' }));
        setSelectedCityName(city.CityName || '');
        setCitySearch('');
        setShowCityDropdown(false);
        setErrors((p) => ({ ...p, city: '' }));
    };

    const makeFileHandler = (setter, ref) => ({
        onChange: (e) => { const f = e.target.files?.[0]; if (f) setter(f); },
        onRemove: () => { setter(null); if (ref.current) ref.current.value = ''; },
    });

    const photoHandlers  = makeFileHandler(setSelectedFile, fileRef);
    const licenseHandlers = makeFileHandler(setLicenseFile, licenseRef);
    const certHandlers   = makeFileHandler(setCertFile, certRef);
    const selectedPhoneCountry = PHONE_COUNTRIES.find((country) => country.code === formData.phoneCountry) || PHONE_COUNTRIES[0];

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTouched = {};
        const newErrors  = {};
        REQUIRED.forEach((key) => {
            newTouched[key] = true;
            newErrors[key]  = validateField(key, formData[key]);
        });
        ['phone', 'routeRate', 'bankName'].forEach((key) => {
            if (formData[key] || key === 'bankName') newErrors[key] = validateField(key, formData[key], formData);
        });

        setTouched((p) => ({ ...p, ...newTouched }));
        setErrors((p)  => ({ ...p, ...newErrors }));

        if (Object.values(newErrors).some(Boolean)) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            const result = await dispatch(createEmployee({
                ...formData,
                status: 'Active',
                filePath: fileRef.current?.files?.[0] || selectedFile || null,
                drivingLicenses: licenseRef.current?.files?.[0] || licenseFile || null,
                certificates: certRef.current?.files?.[0] || certFile || null,
                emergencyContact: `${selectedPhoneCountry.dialCode}${formData.phone || ''}`,
            }));

            if (createEmployee.fulfilled.match(result)) {
                toast.success(result.payload?.message || 'Employee created successfully!');
                handleCancel?.();
            } else {
                toast.error(result.payload || 'Failed to create employee');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create employee');
        }
    };

    const isDriver = Number(formData.positionType) === 1;

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="bg-white w-full rounded-lg border shadow-sm">
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 p-6">

                    {/* ── Personal Information ── */}
                    <SectionTitle>Personal Information</SectionTitle>

                    <Field label="Position Type" error={errors.positionType} touched={touched.positionType}>
                        <select
                            name="positionType"
                            value={formData.positionType}
                            onChange={(e) => setFormData((p) => ({ ...p, positionType: e.target.value ? Number(e.target.value) : '' }))}
                            onBlur={handleBlur}
                            className={inputCls(errors.positionType, touched.positionType)}
                        >
                            <option value="">Select position</option>
                            <option value={1}>Driver</option>
                            <option value={2}>Mechanic</option>
                            <option value={3}>Accountant</option>
                            <option value={4}>Manager</option>
                            <option value={5}>Terminal Manager</option>
                        </select>
                    </Field>

                    <Field label="Full Name" required error={errors.name} touched={touched.name}>
                        <input type="text" name="name" value={formData.name}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Employee full name"
                            className={inputCls(errors.name, touched.name)} />
                    </Field>

                    <Field label="Date of Birth" required error={errors.dateOfBirth} touched={touched.dateOfBirth}>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth}
                            onChange={handleChange} onBlur={handleBlur}
                            className={inputCls(errors.dateOfBirth, touched.dateOfBirth)} />
                    </Field>

                    <Field label="Phone" error={errors.phone} touched={touched.phone}>
                        <div className="flex gap-2">
                            <div className="relative w-[220px]" ref={phoneCountryDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowPhoneCountryDropdown((prev) => !prev)}
                                    className={`flex w-full items-center justify-between rounded-md border bg-[#F5F6FA] px-3 py-2.5 text-sm ${errors.phone && touched.phone ? 'border-red-500' : 'border-[#D5D5D5]'}`}
                                >
                                    <span className="truncate text-left">
                                        {getFlagEmoji(selectedPhoneCountry.code)} {selectedPhoneCountry.label} ({selectedPhoneCountry.dialCode})
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">▼</span>
                                </button>
                                {showPhoneCountryDropdown && (
                                    <div className="absolute left-0 top-[calc(100%+6px)] z-20 max-h-64 w-full overflow-y-auto rounded-md border border-[#D5D5D5] bg-white shadow-lg">
                                        {PHONE_COUNTRIES.map((country) => (
                                            <button
                                                key={country.code}
                                                type="button"
                                                onClick={() => {
                                                    handlePhoneCountryChange({ target: { value: country.code } });
                                                    setShowPhoneCountryDropdown(false);
                                                }}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[#F5F6FA]"
                                            >
                                                <span>{getFlagEmoji(country.code)}</span>
                                                <span className="truncate">{country.label}</span>
                                                <span className="ml-auto text-gray-500">{country.dialCode}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    {getFlagEmoji(selectedPhoneCountry.code)} {selectedPhoneCountry.dialCode}
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    inputMode="numeric"
                                    maxLength={selectedPhoneCountry.maxLength}
                                    placeholder={`Phone number (${selectedPhoneCountry.maxLength} digits max)`}
                                    className={`${inputCls(errors.phone, touched.phone)} pl-20`}
                                />
                            </div>
                        </div>
                    </Field>

                    <Field label="Email" required error={errors.email} touched={touched.email}>
                        <input type="email" name="email" value={formData.email}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="employee@example.com"
                            className={inputCls(errors.email, touched.email)} />
                    </Field>

                    <Field label="Address" required error={errors.address} touched={touched.address}>
                        <input type="text" name="address" value={formData.address}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Street address"
                            className={inputCls(errors.address, touched.address)} />
                    </Field>

                    <Field label="State" required error={errors.stateId} touched={touched.stateId}>
                        <select name="stateId" value={formData.stateId}
                            onChange={handleChange} onBlur={handleBlur}
                            className={inputCls(errors.stateId, touched.stateId)}>
                            <option value="">Select state</option>
                            {loading.states ? <option disabled>Loading...</option>
                                : states.map((s) => <option key={s.StateId} value={s.StateId}>{s.StateName}</option>)}
                        </select>
                    </Field>

                    {/* City searchable dropdown */}
                    <Field label="City" required error={errors.city} touched={touched.city}>
                        <div className="relative" ref={cityDropdownRef}>
                            <input
                                type="text"
                                value={citySearch || selectedCityName}
                                onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); if (!e.target.value) { setFormData((p) => ({ ...p, city: '' })); setSelectedCityName(''); } }}
                                onFocus={() => { setShowCityDropdown(true); if (selectedCityName) setCitySearch(''); }}
                                onBlur={() => { setTouched((p) => ({ ...p, city: true })); setErrors((p) => ({ ...p, city: validateField('city', formData.city) })); }}
                                placeholder={loading.cities ? 'Loading cities...' : 'Search city...'}
                                className={inputCls(errors.city, touched.city)}
                            />
                            {showCityDropdown && !loading.cities && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                                    {filteredCities.length > 0
                                        ? filteredCities.map((c) => (
                                            <div key={c.CityId} onClick={() => handleCitySelect(c)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                                                {c.CityName}
                                            </div>
                                        ))
                                        : <div className="px-4 py-2 text-sm text-gray-400">{citySearch ? 'No cities found' : 'Start typing...'}</div>
                                    }
                                </div>
                            )}
                        </div>
                    </Field>

                    <Field label="Zip Code" required error={errors.zipCode} touched={touched.zipCode}>
                        <input type="text" name="zipCode" value={formData.zipCode}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="e.g. 12345"
                            className={inputCls(errors.zipCode, touched.zipCode)} />
                    </Field>

                    {/* ── Employment ── */}
                    <SectionTitle>Employment</SectionTitle>

                    <Field label="Start Date" required error={errors.joiningDate} touched={touched.joiningDate}>
                        <input type="date" name="joiningDate" value={formData.joiningDate}
                            onChange={handleChange} onBlur={handleBlur}
                            className={inputCls(errors.joiningDate, touched.joiningDate)} />
                    </Field>

                    <Field label="Terminal Assigned" required error={errors.terminalAssigned} touched={touched.terminalAssigned}>
                        <select name="terminalAssigned" value={formData.terminalAssigned}
                            onChange={handleChange} onBlur={handleBlur}
                            className={inputCls(errors.terminalAssigned, touched.terminalAssigned)}>
                            <option value="">Select terminal</option>
                            {loading.terminals ? <option disabled>Loading...</option>
                                : terminals.map((t) => <option key={t.TerminalId || t.id} value={t.TerminalId || t.id}>{t.TerminalName || t.name || 'N/A'}</option>)}
                        </select>
                    </Field>

                    <Field label="Pay Grade" error={errors.payGrade} touched={touched.payGrade}>
                        <input type="text" name="payGrade" value={formData.payGrade}
                            onChange={handleChange} placeholder="e.g. G3"
                            className={inputCls()} />
                    </Field>

                    <Field label="Pay Type" required error={errors.payTypeId} touched={touched.payTypeId}>
                        <select name="payTypeId"
                            value={formData.payTypeId !== '' ? String(formData.payTypeId) : ''}
                            onChange={(e) => {
                                const sel = payTypes.find((p) => String(p.PayTypeId) === e.target.value);
                                setFormData((p) => ({ ...p, payTypeId: sel ? Number(sel.PayTypeId) : '' }));
                                setErrors((p) => ({ ...p, payTypeId: '' }));
                            }}
                            onBlur={handleBlur}
                            className={inputCls(errors.payTypeId, touched.payTypeId)}>
                            <option value="">Select pay type</option>
                            {loading.payTypes ? <option disabled>Loading...</option>
                                : payTypes.map((t) => <option key={t.PayTypeId} value={String(t.PayTypeId)}>{t.PayTypeName}</option>)}
                        </select>
                    </Field>

                    <Field label="Pay Cycle" required error={errors.payCycle} touched={touched.payCycle}>
                        <select name="payCycle" value={formData.payCycle}
                            onChange={(e) => { setFormData((p) => ({ ...p, payCycle: e.target.value })); setErrors((p) => ({ ...p, payCycle: '' })); }}
                            onBlur={handleBlur}
                            className={inputCls(errors.payCycle, touched.payCycle)}>
                            <option value="">Select pay cycle</option>
                            {loading.payCycles ? <option disabled>Loading...</option>
                                : payCycles.map((c) => <option key={c.PayCycleId} value={c.PayCycleId}>{c.PayCycleName}</option>)}
                        </select>
                    </Field>

                    <Field label="Route Rate" error={errors.routeRate} touched={touched.routeRate}>
                        <input type="number" name="routeRate" value={formData.routeRate}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="e.g. 25.00" min={0} step="0.01"
                            className={inputCls(errors.routeRate, touched.routeRate)} />
                    </Field>

                    <Field label="Fuel Card Code">
                        <input type="text" name="fuelCardCode" value={formData.fuelCardCode}
                            onChange={handleChange} placeholder="Optional"
                            className={inputCls()} />
                    </Field>

                    {/* ── Financial ── */}
                    <SectionTitle>Financial Information</SectionTitle>

                    <Field label="Social Security No">
                        <input type="password" name="socialSecurityNo" value={formData.socialSecurityNo}
                            onChange={handleChange} placeholder="XXX-XX-XXXX"
                            className={inputCls()} />
                    </Field>

                    <Field label="Bank Name" error={errors.bankName} touched={touched.bankName}>
                        <input type="text" name="bankName" value={formData.bankName}
                            onChange={handleChange} onBlur={handleBlur} placeholder="Bank name"
                            className={inputCls(errors.bankName, touched.bankName)} />
                    </Field>

                    <Field label="Account Number">
                        <input type="text" name="accountNumber" value={formData.accountNumber}
                            onChange={handleChange} placeholder="Bank account number"
                            className={inputCls()} />
                    </Field>

                    <Field label="Routing Number">
                        <input type="text" name="routingNo" value={formData.routingNo}
                            onChange={handleChange} placeholder="Bank routing number"
                            className={inputCls()} />
                    </Field>

                    {/* ── Documents ── */}
                    <SectionTitle>Documents</SectionTitle>

                    <FileUpload
                        label="Profile Photo"
                        file={selectedFile}
                        fileRef={fileRef}
                        onChange={photoHandlers.onChange}
                        onRemove={photoHandlers.onRemove}
                    />

                    {isDriver && (
                        <FileUpload
                            label="Driving License (Driver only)"
                            file={licenseFile}
                            fileRef={licenseRef}
                            onChange={licenseHandlers.onChange}
                            onRemove={licenseHandlers.onRemove}
                        />
                    )}

                    <FileUpload
                        label="Certificates (optional)"
                        file={certFile}
                        fileRef={certRef}
                        onChange={certHandlers.onChange}
                        onRemove={certHandlers.onRemove}
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 pb-6">
                    <button
                        type="submit"
                        disabled={loading.creating}
                        className="px-10 py-2.5 bg-[#C01824] text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading.creating ? 'Submitting...' : 'Add Employee'}
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

export default AddDriver;
