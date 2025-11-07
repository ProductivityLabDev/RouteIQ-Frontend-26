import { pickFileIcon } from '@/assets';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
const AddDriver = ({ handleCancel }) => {

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    const [payTypes, setPayTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [terminals, setTerminals] = useState([]);
    const [payCycle, setpayCycle] = useState([])
    const [submitting, setSubmitting] = useState(false);
    const [cities, setCity] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        adress: "",
        city: "",
        state: "",
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


    // ---------- CREATE EMPLOYEE ----------

    const handleSubmitEmployee = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Prepare data exactly how backend expects
            const employeeData = {
                name: formData.name,
                adress: formData.adress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                dop: formData.dop,
                joiningDate: formData.joiningDate,
                positionType: formData.positionType,
                email: formData.email,
                payGrade: formData.payGrade,
                routeRate: formData.routeRate,
                payCycle: formData.payCycle,
                payType: formData.payTypeId,
                fuelCardCode: Number(formData.fuelCardCode) || null,
                terminalAssigmed: formData.terminalAssigmed,
                status: "Active",
                filePath: null,

            };

            console.log("Submitting payload:", employeeData);

            const res = await axios.post(
                `${BASE_URL}/institute/createEmployeeInfo`,
                employeeData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data?.message || "Employee created successfully!");
            alert(res.data?.message || "Employee created successfully!");
        } catch (err) {
            console.error("Error creating employee:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to create employee");
        } finally {
            setSubmitting(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getPayTypes = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/institute/paytypes`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched pay types:", res.data);
            // ✅ API gives { ok:true, data:[...] }
            if (res.data?.data && Array.isArray(res.data.data)) {
                setPayTypes(res.data.data);
            } else {
                setPayTypes([]);
            }
        } catch (err) {
            console.error("Error fetching pay types:", err);
            setPayTypes([]);
        } finally {
            setLoading(false);
        }
    };
    const getPaycycles = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/institute/paycycles`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched pay cycles:", res.data);
            // ✅ API gives { ok:true, data:[...] }
            if (res.data?.data && Array.isArray(res.data.data)) {
                setpayCycle(res.data.data);
            } else {
                setpayCycle([]);
            }
        } catch (err) {
            console.error("Error fetching pay types:", err);
            setpayCycle([]);
        } finally {
            setLoading(false);
        }
    };
    const getTerminals = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/terminals`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched terminals:", res.data);

            // ✅ Works for both cases: direct array or wrapped in `data`
            const terminalsArray = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

            setTerminals(terminalsArray);
        } catch (err) {
            console.error("Error fetching terminals:", err);
            setTerminals([]);
        } finally {
            setLoading(false);
        }
    };
    const getCity = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/institute/GetStates`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched City:", res.data);

            // ✅ Works for both cases: direct array or wrapped in `data`
            const CityArray = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

            setCity(CityArray);
        } catch (err) {
            console.error("Error fetching terminals:", err);
            setCity([]);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (token) getPayTypes();
        getPaycycles();
        getTerminals()
        getCity()
    }, [token]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white w-full rounded-lg">
            <form className="w-full">
                <div className="flex flex-row w-full gap-6 p-6">
                    {/* First column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />


                        <label className="block text-sm font-medium text-black mt-4 mb-1">Zip</label>
                        <input
                            type="text"
                            name='zipCode'
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.zipCode}
                            onChange={handleChange}
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Start Date</label>
                        <input
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] w-full py-3 px-6 bg-[#F5F6FA] text-gray-900"
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.email}
                            onChange={handleChange}
                        />


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
                            Pay Cycle
                        </label>
                        <div className="relative">
                            <select
                                name="payCycle"
                                value={formData.payCycle}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setFormData((prev) => ({ ...prev, payCycle: selectedId }));
                                }}
                                className="outline-none border border-[#D5D5D5] text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full"
                            >
                                <option value="">Select</option>
                                {loading ? (
                                    <option className="text-gray-500">Loading...</option>
                                ) : payCycle.length > 0 ? (
                                    payCycle.map((cycle) => (
                                        <option key={cycle.Id} value={cycle.Id} className="text-black">
                                            {cycle.Name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No pay cycles found</option>
                                )}
                            </select>
                        </div>

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Add Social Security #</label>
                        <input
                            type="number"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                    </div>


                    {/* Second column */}
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-black mb-1">Address</label>
                        <input
                            type="text"
                            name="adress"
                            value={formData.adress}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />


                        <label className="block text-sm font-medium text-black mt-4 mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />
                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Grade</label>
                        <input
                            type="text"
                            name='payGrade'
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.payGrade}
                            onChange={handleChange}
                        />

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Terminal Assigned To</label>
                        <select
                            name="terminalAssigmed"
                            value={formData.terminalAssigmed}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full"
                        >
                            <option value="">Select</option>
                            {loading ? (
                                <option className="text-gray-500">Loading...</option>
                            ) : terminals.length > 0 ? (
                                terminals.map((t) => (
                                    <option key={t.id} value={t.id} className="text-black">
                                        {t.name} ({t.code})
                                    </option>
                                ))
                            ) : (
                                <option>No terminals found</option>
                            )}
                        </select>


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
                        <label className="block text-sm font-medium text-black mb-1">City</label>
                        {/* <input
                            type="text"
                            name='city'
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                            value={formData.city}
                            onChange={handleChange}
                        /> */}

                        <div className="relative">
                            <select
                                name="city"
                                value={formData.city}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setFormData((prev) => ({ ...prev, city: selectedId }));
                                }}
                                className="outline-none border border-[#D5D5D5] text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full"
                            >
                                <option value="">Select</option>
                                {loading ? (
                                    <option className="text-gray-500">Loading...</option>
                                ) : cities.length > 0 ? (
                                    payCycle.map((cycle) => (
                                        <option key={cycle.Id} value={cycle.Id} className="text-black">
                                            {cycle.StateName}
                                        </option>
                                    ))
                                ) : (
                                    <option>No city found</option>
                                )}
                            </select>
                        </div>

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            name="dop"
                            value={formData.dop || ""}
                            onChange={handleChange}
                            className="outline-none border border-[#D5D5D5] w-full rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                        {/* <label className="block text-sm font-medium text-black mt-4 mb-1">Type</label>
                        <input
                            type="text"
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        /> */}

                        <label className="block text-sm font-medium text-black mt-4 mb-1">Pay Type</label>
                        <div className="relative">
                            {/* <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full">
                                <option>Select</option>
                                <option>Hourly</option>
                                <option>Salary</option>
                                <option>Commission</option>
                                 <option>Other</option>
                            </select> */}

                            <select
                                name="payTypeId"
                                value={formData.payTypeId || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selected = payTypes.find((p) => String(p.Id) === selectedId);
                                    setFormData((prev) => ({
                                        ...prev,
                                        payTypeId: selected?.Id || "",
                                        payTypeName: selected?.Name || "",
                                    }));
                                }}
                                className="outline-none border border-[#D5D5D5] text-black rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-full"
                            >
                                <option value="">Select</option>
                                {loading ? (
                                    <option className="text-gray-500">Loading...</option>
                                ) : payTypes.length > 0 ? (
                                    payTypes.map((type) => (
                                        <option key={type.Id} value={type.Id} className="text-black">
                                            {type.Name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No pay types found</option>
                                )}
                            </select>

                        </div>

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
                            className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
                        />

                    </div>
                </div>

                {/* File upload section */}
                <div className="mt-6 border border-dashed border-[#EBB7BB] rounded-lg p-6 text-center m-6 w-full h-32 flex flex-row gap-3 items-center justify-center">
                    <div className="flex justify-center">
                        <img src={pickFileIcon} className="w-10 h-10" />
                    </div>
                    <p className="mt-1 text-sm text-red-600">Drag and Drop Files</p>
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
                    <button
                        type="button"
                        onClick={handleCancel}
                        onSubmit={handleSubmitEmployee}
                        className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded"
                    >
                        Submit
                    </button>
                    {/* <div
                        type="submit"
                        onClick={handleSubmitEmployee}
                        style={{ height: 40, width: 40, backgroundColor: 'black' }}
                    >
                        {submitting ? 'Submitting…' : 'Submit'}
                    </div> */}

                </div>
            </form>
        </div>
    );
};

export default AddDriver