import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, Dialog, Typography } from '@material-tailwind/react'
import { closeicon } from '@/assets'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchTerminals, fetchInstituteTypes, fetchStates, fetchCities, createInstitute } from '@/redux/slices/schoolSlice'
import { toast } from 'react-hot-toast'

// ── Helpers ─────────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
);

const inputCls = (hasError) =>
    `w-full outline-none border rounded-md py-2 px-3 bg-gray-50 text-sm focus:bg-white transition-all ${
        hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-[#C01824]'
    }`;

// ── Initial state ────────────────────────────────────────────────────────────
const INITIAL = {
    district: '', president: '', terminal: '', principal: '',
    school: '', totalStudent: '', totalBuses: '', contact: '',
    Address: '', Email: '', PhoneNo: '', instituteType: '',
    stateId: '', city: '', ZipCode: '',
};

// ── Validation ───────────────────────────────────────────────────────────────
const validateForm = (formData) => {
    const e = {};
    if (!formData.school.trim())        e.school        = 'School name is required';
    if (!formData.terminal)             e.terminal      = 'Terminal is required';
    if (!formData.instituteType)        e.instituteType = 'Institute type is required';
    if (!formData.Address.trim())       e.Address       = 'Address is required';
    if (formData.Email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email.trim()))
                                        e.Email         = 'Invalid email address';
    if (formData.PhoneNo.trim()) {
        const digits = formData.PhoneNo.replace(/[\s\-()]/g, '');
        if (digits.length < 7)          e.PhoneNo       = 'Invalid phone number';
    }
    if (formData.ZipCode.trim() && !/^\d{5}(-\d{4})?$/.test(formData.ZipCode.trim()))
                                        e.ZipCode       = 'Invalid zip code (e.g. 12345)';
    return e;
};

/**
 * @type {React.FC<import('./SchoolManagement').SchoolManagementModalProps>}
 */
export function SchoolManagementModal({ open, handleOpen, editInstitute, editSchoolData, refreshSchools }) {
    const dispatch = useAppDispatch();
    const { terminals, instituteTypes, states, cities, loading } = useAppSelector((s) => s.schools);

    const [formData, setFormData] = useState(INITIAL);
    const [errors, setErrors]     = useState({});
    const [touched, setTouched]   = useState({});

    // City searchable dropdown
    const cityDropdownRef = useRef(null);
    const [citySearch, setCitySearch]             = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // Load dropdowns when modal opens
    useEffect(() => {
        if (!open) return;
        dispatch(fetchTerminals());
        dispatch(fetchInstituteTypes());
        dispatch(fetchStates());
        dispatch(fetchCities());
    }, [open, dispatch]);

    // Populate or reset form
    useEffect(() => {
        if (editInstitute && editSchoolData) {
            setFormData({
                district:     editSchoolData.district      || '',
                president:    editSchoolData.president     || '',
                terminal:     editSchoolData.terminal      || '',
                principal:    editSchoolData.principal     || editSchoolData.principle || '',
                school:       editSchoolData.school        || editSchoolData.name || '',
                totalStudent: editSchoolData.totalStudent  || editSchoolData.totalStudents || '',
                totalBuses:   editSchoolData.totalBuses    || '',
                contact:      editSchoolData.contact       || '',
                Address:      editSchoolData.Address       || editSchoolData.address || '',
                Email:        editSchoolData.Email         || editSchoolData.email || '',
                PhoneNo:      editSchoolData.PhoneNo       || editSchoolData.phoneNo || '',
                instituteType: editSchoolData.instituteType || editSchoolData.InstituteType || '',
                stateId:      editSchoolData.stateId       || editSchoolData.StateId || '',
                city:         editSchoolData.city          || editSchoolData.City || '',
                ZipCode:      editSchoolData.ZipCode       || editSchoolData.zipCode || '',
            });
        } else {
            setFormData(INITIAL);
            setErrors({});
            setTouched({});
        }
    }, [editInstitute, editSchoolData, open]);

    // Close city dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target))
                setShowCityDropdown(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filteredCities = Array.isArray(cities)
        ? cities.filter((c) => c.CityName?.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 100)
        : [];

    const selectedCityName = cities.find((c) => c.CityId === Number(formData.city))?.CityName || '';

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const handleBlur = (name) => {
        setTouched((p) => ({ ...p, [name]: true }));
        const errs = validateForm({ ...formData });
        setErrors((p) => ({ ...p, [name]: errs[name] || '' }));
    };

    const handleCitySelect = (city) => {
        setFormData((p) => ({ ...p, city: city.CityId }));
        setCitySearch('');
        setShowCityDropdown(false);
        setErrors((p) => ({ ...p, city: '' }));
    };

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = validateForm(formData);
        // Touch all validated fields
        setTouched(Object.fromEntries(Object.keys(errs).map((k) => [k, true])));
        setErrors(errs);

        if (Object.values(errs).some(Boolean)) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            const result = await dispatch(createInstitute(formData));

            if (createInstitute.fulfilled.match(result)) {
                toast.success(result.payload?.message || 'School created successfully!');
                refreshSchools?.();
                handleOpen();
            } else {
                toast.error(result.payload || 'Failed to create school. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create school. Please try again.');
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <Dialog className="px-6 py-5" open={open} handler={handleOpen} size="lg">
            <Card color="transparent" shadow={false}>
                {/* Header */}
                <div className="flex justify-between items-center mb-5 pb-3 border-b">
                    <Typography className="text-xl font-bold text-gray-800">
                        {editInstitute ? 'Edit Institute' : 'Add School'}
                    </Typography>
                    <Button className="p-1 hover:bg-gray-100 rounded" variant="text" onClick={handleOpen}>
                        <img src={closeicon} className="w-5 h-5" alt="Close" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                        {/* ── Column 1 ── */}
                        <Field label="School Name" required error={touched.school && errors.school}>
                            <input type="text" name="school" value={formData.school}
                                onChange={handleChange} onBlur={() => handleBlur('school')}
                                placeholder="e.g. Lincoln High School"
                                className={inputCls(touched.school && errors.school)} />
                        </Field>

                        <Field label="Institute Type" required error={touched.instituteType && errors.instituteType}>
                            <select name="instituteType" value={formData.instituteType}
                                onChange={handleChange} onBlur={() => handleBlur('instituteType')}
                                className={inputCls(touched.instituteType && errors.instituteType)}>
                                <option value="">Select institute type</option>
                                {loading.instituteTypes ? <option disabled>Loading...</option>
                                    : instituteTypes.map((t) => (
                                        <option key={t.Id} value={t.Id}>{t.InstituteTypeName}</option>
                                    ))}
                            </select>
                        </Field>

                        <Field label="Terminal" required error={touched.terminal && errors.terminal}>
                            <select name="terminal" value={formData.terminal}
                                onChange={handleChange} onBlur={() => handleBlur('terminal')}
                                className={inputCls(touched.terminal && errors.terminal)}>
                                <option value="">Select terminal</option>
                                {loading.terminals ? <option disabled>Loading...</option>
                                    : terminals.map((t) => {
                                        const id   = t.TerminalId ?? t.id;
                                        const name = t.TerminalName ?? t.name ?? `Terminal ${id}`;
                                        return <option key={id} value={id}>{name}</option>;
                                    })}
                            </select>
                        </Field>

                        <Field label="District">
                            <input type="text" name="district" value={formData.district}
                                onChange={handleChange} placeholder="School district"
                                className={inputCls()} />
                        </Field>

                        <Field label="Principal">
                            <input type="text" name="principal" value={formData.principal}
                                onChange={handleChange} placeholder="Principal name"
                                className={inputCls()} />
                        </Field>

                        <Field label="President">
                            <input type="text" name="president" value={formData.president}
                                onChange={handleChange} placeholder="President name"
                                className={inputCls()} />
                        </Field>

                        <Field label="Total Students">
                            <input type="number" name="totalStudent" value={formData.totalStudent}
                                onChange={handleChange} placeholder="e.g. 500" min={0}
                                className={inputCls()} />
                        </Field>

                        <Field label="Total Buses">
                            <input type="number" name="totalBuses" value={formData.totalBuses}
                                onChange={handleChange} placeholder="e.g. 10" min={0}
                                className={inputCls()} />
                        </Field>

                        {/* ── Column 2 ── */}
                        <Field label="Address" required error={touched.Address && errors.Address}>
                            <input type="text" name="Address" value={formData.Address}
                                onChange={handleChange} onBlur={() => handleBlur('Address')}
                                placeholder="Street address"
                                className={inputCls(touched.Address && errors.Address)} />
                        </Field>

                        <Field label="State">
                            <select name="stateId" value={formData.stateId}
                                onChange={handleChange}
                                className={inputCls()}>
                                <option value="">Select state</option>
                                {loading.states ? <option disabled>Loading...</option>
                                    : states.map((s) => (
                                        <option key={s.StateId} value={s.StateId}>{s.StateName}</option>
                                    ))}
                            </select>
                        </Field>

                        {/* City — searchable dropdown */}
                        <Field label="City">
                            <div className="relative" ref={cityDropdownRef}>
                                <input
                                    type="text"
                                    value={citySearch || selectedCityName}
                                    onChange={(e) => {
                                        setCitySearch(e.target.value);
                                        setShowCityDropdown(true);
                                        if (!e.target.value) setFormData((p) => ({ ...p, city: '' }));
                                    }}
                                    onFocus={() => { setShowCityDropdown(true); if (selectedCityName) setCitySearch(''); }}
                                    placeholder={loading.cities ? 'Loading cities...' : 'Search city...'}
                                    className={inputCls()}
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
                                            : <div className="px-4 py-2 text-sm text-gray-400">
                                                {citySearch ? 'No cities found' : 'Start typing...'}
                                              </div>
                                        }
                                    </div>
                                )}
                            </div>
                        </Field>

                        <Field label="Zip Code" error={touched.ZipCode && errors.ZipCode}>
                            <input type="text" name="ZipCode" value={formData.ZipCode}
                                onChange={handleChange} onBlur={() => handleBlur('ZipCode')}
                                placeholder="e.g. 12345"
                                className={inputCls(touched.ZipCode && errors.ZipCode)} />
                        </Field>

                        <Field label="Email" error={touched.Email && errors.Email}>
                            <input type="email" name="Email" value={formData.Email}
                                onChange={handleChange} onBlur={() => handleBlur('Email')}
                                placeholder="school@example.com"
                                className={inputCls(touched.Email && errors.Email)} />
                        </Field>

                        <Field label="Phone No" error={touched.PhoneNo && errors.PhoneNo}>
                            <input type="tel" name="PhoneNo" value={formData.PhoneNo}
                                onChange={handleChange} onBlur={() => handleBlur('PhoneNo')}
                                placeholder="e.g. 555-0123"
                                className={inputCls(touched.PhoneNo && errors.PhoneNo)} />
                        </Field>

                        <Field label="Contact Person">
                            <input type="text" name="contact" value={formData.contact}
                                onChange={handleChange} placeholder="Contact person name"
                                className={inputCls()} />
                        </Field>

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <Button type="button" onClick={handleOpen} size="lg" variant="outlined"
                            disabled={loading.creating}
                            className="px-8 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 capitalize">
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" variant="filled"
                            disabled={loading.creating}
                            className="px-8 py-2 bg-[#C01824] text-white font-medium rounded-md hover:bg-[#A01520] capitalize">
                            {loading.creating ? 'Submitting...' : (editInstitute ? 'Update School' : 'Add School')}
                        </Button>
                    </div>
                </form>
            </Card>
        </Dialog>
    );
}
