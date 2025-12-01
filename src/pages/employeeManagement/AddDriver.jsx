import { pickFileIcon } from '@/assets';
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchPayTypes, fetchPayCycles, fetchTerminals, createEmployee } from '@/redux/slices/employeSlices';

const AddDriver = ({ handleCancel }) => {
    const dispatch = useDispatch();
    const { payTypes, payCycles, terminals, loading, error } = useSelector((state) => state.employees);

    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        adress: "",
        city: "",
        zipCode: "",
        dop: "",
        joiningDate: "",
        positionType: "",
        email: "",
        payGrade: "",
        routeRate: "",
        payCycle: "",
        payType: "",
        fuelCardCode: "",
        terminalAssigmed: "",
        phone: "",
        payTypeId: "",
    });
    
    // File ref for file upload
    const fileRef = useRef(null);


    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.adress || formData.adress.trim() === "") {
            newErrors.adress = "Address is required";
        }

        if (!formData.city || formData.city.trim() === "") {
            newErrors.city = "City is required";
        }


        if (!formData.zipCode || formData.zipCode.trim() === "") {
            newErrors.zipCode = "Zip Code is required";
        } else {
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(formData.zipCode.trim())) {
                newErrors.zipCode = "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
            }
        }

        if (!formData.dop || formData.dop.trim() === "") {
            newErrors.dop = "Date of Birth is required";
        } else {
            const dob = new Date(formData.dop);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18 || age > 100) {
                newErrors.dop = "Date of Birth must be valid (age 18-100)";
            }
        }

        if (!formData.joiningDate || formData.joiningDate.trim() === "") {
            newErrors.joiningDate = "Start Date is required";
        } else {
            const joinDate = new Date(formData.joiningDate);
            const today = new Date();
            if (joinDate > today) {
                newErrors.joiningDate = "Start Date cannot be in the future";
            }
        }

        if (!formData.email || formData.email.trim() === "") {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = "Please enter a valid email address";
            }
        }

        // Phone validation (if phone field exists in formData)
        if (formData.phone) {
            const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 15) {
                newErrors.phone = "Phone number must be between 10-15 digits";
            }
        }

        // Position Type validation (if field exists in form)
        // Note: If positionType field is not in the form, remove this validation
        // if (!formData.positionType || formData.positionType.trim() === "") {
        //     newErrors.positionType = "Position Type is required";
        // }

        if (!formData.payCycle || formData.payCycle.trim() === "") {
            newErrors.payCycle = "Pay Cycle is required";
        }

        if (!formData.payTypeId || formData.payTypeId === "" || formData.payTypeId === 0) {
            newErrors.payTypeId = "Pay Type is required";
        }

        if (!formData.terminalAssigmed || formData.terminalAssigmed === "" || formData.terminalAssigmed === 0) {
            newErrors.terminalAssigmed = "Terminal Assigned is required";
        }

        // Validate routeRate if provided (should be a number)
        if (formData.routeRate && formData.routeRate.trim() !== "") {
            if (isNaN(parseFloat(formData.routeRate)) || parseFloat(formData.routeRate) < 0) {
                newErrors.routeRate = "Route Rate must be a positive number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        // Validate single field on blur
        validateForm();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // ---------- CREATE EMPLOYEE ----------

    const handleSubmitEmployee = async (e) => {
        e.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            const errorMessages = Object.values(errors).filter(msg => msg);
            errorMessages.forEach(error => {
                toast.error(error);
            });
            return;
        }

        try {
            // Collect file from ref
            const file = fileRef.current?.files?.[0] || null;

            // Prepare employee data with file
            const employeeData = {
                ...formData,
                status: "Active",
                file: file,
                emergencyContact: formData.phone || "", // Map phone to emergencyContact
            };
            
            console.log("📤 [AddDriver] Submitting employee data:", {
                ...employeeData,
                file: file ? file.name : "No file",
                payTypeId: employeeData.payTypeId,
            });

            const result = await dispatch(createEmployee(employeeData));

            if (createEmployee.fulfilled.match(result)) {
                toast.success(result.payload?.message || "Employee created successfully!");
                // Reset form
                setFormData({
                    name: "",
                    adress: "",
                    city: "",
                    zipCode: "",
                    dop: "",
                    joiningDate: "",
                    positionType: "",
                    email: "",
                    payGrade: "",
                    routeRate: "",
                    payCycle: "",
                    payType: "",
                    fuelCardCode: "",
                    terminalAssigmed: "",
                    phone: "",
                    payTypeId: "",
                });
                // Reset file input
                if (fileRef.current) fileRef.current.value = "";
                
                if (handleCancel) {
                    handleCancel();
                }
            } else {
                toast.error(result.payload || "Failed to create employee");
            }
        } catch (err) {
            console.error("Error creating employee:", err);
            toast.error(err.message || "Failed to create employee");
        }
    };



    useEffect(() => {
        // Fetch all required data on component mount
        dispatch(fetchPayTypes());
        dispatch(fetchPayCycles());
        dispatch(fetchTerminals());
    }, [dispatch]);

    // Clear validation errors when clicking anywhere on the screen (except form elements)
    useEffect(() => {
        const handleClickAnywhere = (event) => {
            // Check if click is on a form element (input, select, textarea, button, label)
            const isFormElement = event.target.closest('input, select, textarea, button, label');

            // If clicking anywhere except form elements, clear errors
            if (!isFormElement) {
                setErrors({});
                setTouched({});
            }
        };

        // Add event listener to document
        document.addEventListener('click', handleClickAnywhere);

        // Cleanup on unmount
        return () => {
            document.removeEventListener('click', handleClickAnywhere);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white w-full rounded-lg">
            <form className="w-full">
                <div className="flex flex-row w-full gap-6 p-6">
                    {/* First column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.name && touched.name ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.name && touched.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}


                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Zip <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name='zipCode'
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.zipCode && touched.zipCode ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                            value={formData.zipCode}
                            onChange={handleChange}
                            onBlur={() => handleBlur('zipCode')}
                        />
                        {errors.zipCode && touched.zipCode && (
                            <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                        )}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            onBlur={() => handleBlur('joiningDate')}
                            className={`outline-none border rounded-[6px] w-full py-3 px-6 bg-[#F5F6FA] text-gray-900 ${errors.joiningDate && touched.joiningDate ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.joiningDate && touched.joiningDate && (
                            <p className="text-red-500 text-xs mt-1">{errors.joiningDate}</p>
                        )}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.email && touched.email ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                        />
                        {errors.email && touched.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}


                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Pay Rate changes
                        </label>
                        <input
                            type="text"
                            name="routeRate"
                            value={formData.routeRate}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />


                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Pay Cycle <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="payCycle"
                                value={formData.payCycle}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setFormData((prev) => ({ ...prev, payCycle: selectedId }));
                                    if (errors.payCycle) {
                                        setErrors(prev => ({ ...prev, payCycle: "" }));
                                    }
                                }}
                                onBlur={() => handleBlur('payCycle')}
                                className={`outline-none border text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full ${errors.payCycle && touched.payCycle ? 'border-red-500' : 'border-[#D5D5D5]'
                                    }`}
                            >
                                <option value="">Select</option>
                                {loading.payCycles ? (
                                    <option className="text-gray-500">Loading...</option>
                                ) : payCycles.length > 0 ? (
                                    payCycles.map((cycle) => (
                                        <option key={cycle.PayCycleId} value={cycle.PayCycleId} className="text-black">
                                            {cycle.PayCycleName}
                                        </option>
                                    ))
                                ) : (
                                    <option>No pay cycles found</option>
                                )}
                            </select>
                        </div>
                        {errors.payCycle && touched.payCycle && (
                            <p className="text-red-500 text-xs mt-1">{errors.payCycle}</p>
                        )}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Add Social Security #</label>
                        <input
                            type="number"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                    </div>


                    {/* Second column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="adress"
                            value={formData.adress}
                            onChange={handleChange}
                            onBlur={() => handleBlur('adress')}
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.adress && touched.adress ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.adress && touched.adress && (
                            <p className="text-red-500 text-xs mt-1">{errors.adress}</p>
                        )}


                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            onBlur={() => handleBlur('city')}
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.city && touched.city ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.city && touched.city && (
                            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Grade</label>
                        <input
                            type="text"
                            name='payGrade'
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.payGrade}
                            onChange={handleChange}
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Terminal Assigned To <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="terminalAssigmed"
                            value={formData.terminalAssigmed}
                            onChange={handleChange}
                            onBlur={() => handleBlur('terminalAssigmed')}
                            className={`outline-none border text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full ${errors.terminalAssigmed && touched.terminalAssigmed ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        >
                            <option value="">Select</option>
                            {loading.terminals ? (
                                <option className="text-gray-500">Loading...</option>
                            ) : terminals.length > 0 ? (
                                terminals.map((t) => (
                                    <option key={t.id} value={t.id} className="text-black">
                                        {t.name}
                                    </option>
                                ))
                            ) : (
                                <option>No terminals found</option>
                            )}
                        </select>
                        {errors.terminalAssigmed && touched.terminalAssigmed && (
                            <p className="text-red-500 text-xs mt-1">{errors.terminalAssigmed}</p>
                        )}


                        <label className="block text-sm font-medium text-black mt-4 mb-1">Employee Account #</label>
                        <input
                            type="number"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                        <label className="block text-sm font-medium text-black mt-4 mb-1">Routing #</label>
                        <input
                            type="number"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                    </div>

                    {/* Third column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="dop"
                            value={formData.dop || ""}
                            onChange={handleChange}
                            onBlur={() => handleBlur('dop')}
                            className={`outline-none border w-full rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.dop && touched.dop ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.dop && touched.dop && (
                            <p className="text-red-500 text-xs mt-1">{errors.dop}</p>
                        )}

                        {/* <label className="block text-sm font-medium text-black mt-4 mb-1">Type</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        /> */}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Pay Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="payTypeId"
                                value={formData.payTypeId !== undefined && formData.payTypeId !== null && formData.payTypeId !== "" ? String(formData.payTypeId) : ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selected = payTypes.find((p) => String(p.PayTypeId) === selectedId);
                                    // Store as number to match the ID
                                    const payTypeIdValue = selected ? Number(selected.PayTypeId) : "";
                                    setFormData((prev) => ({
                                        ...prev,
                                        payTypeId: payTypeIdValue,
                                    }));
                                    if (errors.payTypeId) {
                                        setErrors(prev => ({ ...prev, payTypeId: "" }));
                                    }
                                }}
                                onBlur={() => handleBlur('payTypeId')}
                                className={`outline-none border text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full ${errors.payTypeId && touched.payTypeId ? 'border-red-500' : 'border-[#D5D5D5]'
                                    }`}
                            >
                                <option value="">Select</option>
                                {loading.payTypes ? (
                                    <option className="text-gray-500">Loading...</option>
                                ) : payTypes.length > 0 ? (
                                    payTypes.map((type) => (
                                        <option key={type.PayTypeId} value={String(type.PayTypeId)} className="text-black">
                                            {type.PayTypeName}
                                        </option>
                                    ))
                                ) : (
                                    <option>No pay types found</option>
                                )}
                            </select>
                        </div>
                        {errors.payTypeId && touched.payTypeId && (
                            <p className="text-red-500 text-xs mt-1">{errors.payTypeId}</p>
                        )}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Rate</label>
                        <input
                            type="text"
                            name="routeRate"
                            value={formData.routeRate || ""}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />


                        <label className="block text-sm font-medium text-black mt-4 mb-1">Fuel Card Code</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.fuelCardCode}
                            name='fuelCardCode'
                            onChange={handleChange}
                        />
                        <label className="block text-sm font-medium text-black mt-4 mb-1">Phone #</label>
                        <input
                            type="number"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                            className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${errors.phone && touched.phone ? 'border-red-500' : 'border-[#D5D5D5]'
                                }`}
                        />
                        {errors.phone && touched.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}

                    </div>
                </div>

                {/* File upload section */}
                <div className="p-6">
                    <label className="block text-sm font-medium text-black mb-2">File Upload</label>
                    <div className="mt-2 border border-dashed border-[#EBB7BB] rounded-lg p-6 text-center w-full h-32 flex flex-row gap-3 items-center justify-center relative">
                        <input
                            type="file"
                            ref={fileRef}
                            id="file"
                            accept="image/*,.pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex justify-center">
                            <img src={pickFileIcon} className="w-10 h-10" alt="Upload file" />
                        </div>
                        <p className="mt-1 text-sm text-red-600">Drag and Drop Files or Click to Upload</p>
                    </div>
                    {fileRef.current?.files?.[0] && (
                        <p className="text-xs text-gray-600 mt-1">Selected: {fileRef.current.files[0].name}</p>
                    )}
                </div>
                {/* Buttons */}
                <div className="mt-6 flex justify-start space-x-4 p-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded"
                    >
                        Cancel
                    </button>
                    {/* <button
                        type="button"
                        onSubmit={handleSubmitEmployee}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded"
                    >
                        {submitting ? 'Submitting…' : 'Submit'}
                    </button> */}


                    <button
                        type="submit"
                        onClick={handleSubmitEmployee}
                        disabled={loading.creating}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading.creating ? 'Submitting…' : 'Submit'}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default AddDriver