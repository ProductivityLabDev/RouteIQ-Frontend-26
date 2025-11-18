import React, { useState, useEffect } from "react";
import {
    Button,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL, getAxiosConfig } from "@/configs/api";

const CreateAccessCard = ({ setCreateAccess, refreshUsers, editUser }) => {
    const isEditMode = !!editUser;
    const [data, setData] = useState([]);
    const [vendorUsers, setVendorUsers] = useState([]);
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true);
    const [terminal, setTerminal] = useState([])
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
        roleCode: "",
        control: "READ_ONLY",
        modules: [],
        terminalCodes: [],
        department: "",
        permission: ""
    });

    const token = localStorage.getItem("token");
    const [forms, setForms] = useState([Date.now()]);

    const handleSave = async () => {
        try {
            // Map permission to control
            const control = formData.permission === "Read & Write" ? "READ_WRITE" : "READ_ONLY";
            
            const payload = {
                username: formData.username,
                password: formData.password,
                roleCode: formData.roleCode,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                control: control,
                modules: formData.modules || [],
                terminalCodes: formData.terminalCodes || [],
            };

            console.log("📤 Sending payload:", payload);
            console.log("🔄 Mode:", isEditMode ? "UPDATE" : "CREATE");

            let res;
            if (isEditMode) {
                // Update existing user
                const userId = editUser.Id || editUser.id || editUser.UserId || editUser.userId || editUser.ID || editUser._id;
                console.log("🔄 Updating user with ID:", userId);
                
                res = await axios.patch(
                    `${BASE_URL}/vendor/users/${userId}`,
                    payload,
                    getAxiosConfig()
                );
                
                console.log("✅ Vendor user updated:", res.data);
                alert("User updated successfully!");
            } else {
                // Create new user
                res = await axios.post(
                    `${BASE_URL}/vendor/users`,
                    payload,
                    getAxiosConfig()
                );
                
                console.log("✅ Vendor user created:", res.data);
                alert("User created successfully!");
            }

            // Reset form and close
            setFormData({
                username: "",
                password: "",
                email: "",
                phoneNumber: "",
                roleCode: "",
                control: "READ_ONLY",
                modules: [],
                terminalCodes: [],
                department: "",
                permission: ""
            });
            setForms([Date.now()]);
            
            // Refresh user list if callback provided
            if (refreshUsers) {
                refreshUsers();
            }
            
            // Close form
            setCreateAccess(false);
        } catch (err) {
            console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} vendor user:`, err.response?.data || err);
            alert(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
        }
    };
    const getTerminals = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/terminals`, getAxiosConfig());

            console.log("Fetched terminals:", res.data);

            // ✅ Works for both cases: direct array or wrapped in `data`
            const terminalsArray = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

            setTerminal(terminalsArray);
        } catch (err) {
            console.error("Error fetching terminals:", err);
            setTerminal([]);
        } finally {
            setLoading(false);
        }
    };
    const getRoles = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/roles`, getAxiosConfig());

            console.log("Fetched Roles:", res.data);

            const RolesArray = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

            setRoles(RolesArray);
        } catch (err) {
            console.error("Error fetching terminals:", err);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (token) {
            getRoles()
            getTerminals()
        }
    }, [token]);

    // Populate form when editUser is provided
    useEffect(() => {
        if (editUser) {
            console.log("📝 Populating form with user data:", editUser);
            
            // Map user data to form fields
            // Note: You may need to fetch full user details via API if editUser doesn't have all fields
            setFormData({
                username: editUser.Username || editUser.username || "",
                password: "", // Don't populate password for security
                email: editUser.Email || editUser.email || "",
                phoneNumber: editUser.PhoneNumber || editUser.phoneNumber || editUser.Phone || editUser.phone || "",
                roleCode: editUser.RoleCode || editUser.roleCode || editUser.Role?.code || "",
                control: editUser.Control || editUser.control || "READ_ONLY",
                modules: Array.isArray(editUser.Modules) 
                    ? editUser.Modules 
                    : Array.isArray(editUser.modules) 
                        ? editUser.modules 
                        : editUser.Modules?.split?.(",") || editUser.modules?.split?.(",") || [],
                terminalCodes: Array.isArray(editUser.TerminalCodes) 
                    ? editUser.TerminalCodes 
                    : Array.isArray(editUser.terminalCodes) 
                        ? editUser.terminalCodes 
                        : editUser.TerminalCodes?.split?.(",") || editUser.terminalCodes?.split?.(",") || [],
                department: "",
                permission: editUser.Control === "READ_WRITE" ? "Read & Write" : "Read Only"
            });
        } else {
            // Reset form for create mode
            setFormData({
                username: "",
                password: "",
                email: "",
                phoneNumber: "",
                roleCode: "",
                control: "READ_ONLY",
                modules: [],
                terminalCodes: [],
                department: "",
                permission: ""
            });
        }
    }, [editUser]);

    console.log("department", formData.department)

    console.log(formData.permission);


    console.log(formData.roleCode);

    const handleAddForm = () => {
        setForms((prev) => [...prev, Date.now()]);
    };
    return (
        <>
            <h2 className="text=[#202224] text-[32px] font-bold mt-4 mb-4 font-[Nunito Sans]">
                {isEditMode ? "Edit Access" : "Create Access"}
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 w-full h-full max-h-[700px] overflow-y-auto">
                {/* Form Header */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                        <div className="relative">
                            <select
                                name="roleCode"
                                value={formData.roleCode}
                                onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                                className="rounded-md p-3 w-full outline-none appearance-none text-gray border border-[#D5D5D5] bg-[#F5F6FA]"
                            >
                                <option value="">Select Role</option>
                                {loading ? (
                                    <option>Loading...</option>
                                ) : roles.length > 0 ? (
                                    roles.slice(1).map((role) => (
                                        <option key={role.id[1]} value={role.code}>
                                            {role.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No roles found</option>
                                )}
                            </select>


                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                            {isEditMode && <span className="text-gray-500 text-xs ml-2">(Leave blank to keep current)</span>}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={isEditMode ? "Leave blank to keep current password" : ""}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                            type="number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                </div>

                {forms.map((formId) => (
                    <div key={formId} className="bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg p-6 mb-6">
                        {/* Department Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-black mb-3">Select Department</label>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    "Vehicle",
                                    "Employee",
                                    "School",
                                    "Route",
                                    "Tracking",
                                    "Scheduling",
                                    "Chats",
                                    "Accounting",
                                ].map((dept) => (
                                    <div key={dept} className="flex items-center">
                                        <input
                                            type="checkbox" // ✅ changed to checkbox (so you can select multiple)
                                            id={`dept-${formId}-${dept}`}
                                            name={`department-${formId}`}
                                            value={dept.toUpperCase()} // ✅ API expects uppercase like SCHOOL, ROUTE
                                            checked={formData.modules.includes(dept.toUpperCase())}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData((prev) => {
                                                    const modules = prev.modules.includes(value)
                                                        ? prev.modules.filter((mod) => mod !== value) // uncheck → remove
                                                        : [...prev.modules, value]; // check → add
                                                    return { ...prev, modules };
                                                });
                                            }}
                                            className="w-4 h-4 accent-red-600 border-gray-300"
                                        />
                                        <label
                                            htmlFor={`dept-${formId}-${dept}`}
                                            className="ml-2 text-sm text-black"
                                        >
                                            {dept}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Terminal Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-black mb-3">Select Terminal</label>
                            <div className="grid grid-cols-4 gap-4">
                                {terminal.length > 0 ? (
                                    terminal.map((t) => (
                                        <div key={t.id} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`terminal-${formId}-${t.code}`}
                                                name={`terminal-${formId}`}
                                                value={t.code}
                                                checked={formData.terminalCodes?.includes(t.code)}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        terminalCodes: [e.target.value], // ✅ Single terminal (radio)
                                                    }))
                                                }
                                                className="w-4 h-4 accent-red-600 border-gray-300"
                                            />
                                            <label
                                                htmlFor={`terminal-${formId}-${t.code}`}
                                                className="ml-2 text-sm text-black"
                                            >
                                                {t.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No terminals found</p>
                                )}
                            </div>
                        </div>


                        {/* Control Selection */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-3">Control</label>
                            <div className="flex gap-6">
                                {["Read Only", "Read & Write"].map((control) => (
                                    <div key={control} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`control-${formId}-${control}`}
                                            name={`control-${formId}`}
                                            value={control}
                                            checked={formData.permission === control}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    permission: e.target.value, // ✅ store permission
                                                }))
                                            }
                                            className="w-4 h-4 accent-red-600 border-gray-300"
                                        />
                                        <label
                                            htmlFor={`control-${formId}-${control}`}
                                            className="ml-2 text-sm text-black"
                                        >
                                            {control}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}

                {/* Add Button - Right Aligned */}
                <div className="flex justify-end mb-6">
                    <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                        variant='filled' size='lg' onClick={handleAddForm}>
                        Add
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                        onClick={() => setCreateAccess(false)}
                    >
                        Cancel
                    </button>
                    <Button
                        className='bg-[#C01824] px-12 py-2 capitalize text-sm md:text-[16px] font-normal flex items-center'
                        variant='filled'
                        onClick={handleSave}
                    >
                        {isEditMode ? "Update" : "Save"}
                    </Button>

                </div>
            </div>
        </>
    );
};

export default CreateAccessCard;