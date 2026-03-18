import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createUser, updateUser } from "@/redux/slices/usersSlice";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { BASE_URL, getAxiosConfig } from "@/configs/api";

const DEPARTMENTS = ["Vehicle", "Employee", "School", "Route", "Tracking", "Scheduling", "Chats", "Accounting"];

const INITIAL_FORM = {
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    roleCode: "",
    control: "READ_ONLY",
    modules: [],
    terminalIds: [],
    department: "",
    permission: "",
};

/**
 * @type {React.FC<import('@/pages/accessManagement/AccessManagement').CreateAccessCardProps>}
 */
const CreateAccessCard = ({ setCreateAccess, editUser }) => {
    const dispatch = useAppDispatch();
    const { creating, updating } = useAppSelector((state) => state.users);
    const isEditMode = !!editUser;

    const [roles, setRoles] = useState([]);
    const [terminal, setTerminal] = useState([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);
    const [formData, setFormData] = useState(INITIAL_FORM);

    const token = localStorage.getItem("token");

    // ── Fetch dropdowns ──────────────────────────────────────────────────────
    const getTerminals = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/terminals`, getAxiosConfig());
            const arr = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
            setTerminal(
                arr.map((item) => ({
                    id: item.id ?? item.Id ?? item.TerminalId ?? item.terminalId,
                    name: item.name ?? item.Name ?? item.TerminalName ?? item.terminalName ?? item.TerminalCode ?? item.terminalCode ?? "--",
                }))
            );
        } catch {
            setTerminal([]);
        }
    };

    const getRoles = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/roles`, getAxiosConfig());
            const arr = Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
            setRoles(arr);
        } catch {
            setRoles([]);
        } finally {
            setLoadingDropdowns(false);
        }
    };

    useEffect(() => {
        if (token) {
            getRoles();
            getTerminals();
        }
    }, [token]);

    // ── Populate form in edit mode ───────────────────────────────────────────
    useEffect(() => {
        if (editUser) {
            setFormData({
                username:    editUser.Username    || editUser.username    || "",
                password:    "",
                email:       editUser.Email       || editUser.email       || "",
                phoneNumber: editUser.PhoneNumber || editUser.phoneNumber || editUser.Phone || editUser.phone || "",
                roleCode:    editUser.RoleCode    || editUser.roleCode    || editUser.Role?.code || "",
                control:     editUser.Control     || editUser.control     || "READ_ONLY",
                modules: Array.isArray(editUser.Modules)
                    ? editUser.Modules
                    : Array.isArray(editUser.modules)
                        ? editUser.modules
                        : [],
                terminalIds: Array.isArray(editUser.TerminalIds)
                    ? editUser.TerminalIds.map(Number)
                    : Array.isArray(editUser.terminalIds)
                        ? editUser.terminalIds.map(Number)
                        : [],
                department:  "",
                permission:  editUser.Control === "READ_WRITE" ? "Read & Write" : "Read Only",
            });
        } else {
            setFormData(INITIAL_FORM);
        }
    }, [editUser]);

    // ── Validation ───────────────────────────────────────────────────────────
    const validateForm = () => {
        if (!formData.roleCode.trim())              return "Select Role is required";
        if (!formData.username.trim())              return "Username is required";
        if (formData.username.trim().length < 3)    return "Username must be at least 3 characters";
        if (!isEditMode && !formData.password.trim()) return "Password is required";
        if (!isEditMode && formData.password.length < 6) return "Password must be at least 6 characters";
        if (!formData.phoneNumber.trim())           return "Contact Number is required";
        if (!formData.email.trim())                 return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return "Please enter a valid email address";
        if (formData.modules.length === 0)          return "Please select at least one Department";
        if (formData.terminalIds.length === 0)      return "Please select a Terminal";
        if (!formData.permission.trim())            return "Please select Control (Read Only or Read & Write)";
        return null;
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSave = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            if (isEditMode) {
                const userId = editUser.Id || editUser.id || editUser.UserId || editUser.userId || editUser.ID || editUser._id;
                const result = await dispatch(updateUser({ userId, userData: formData }));
                if (updateUser.fulfilled.match(result)) {
                    toast.success("User updated successfully!");
                    setCreateAccess(false);
                } else {
                    toast.error(result.payload || "Failed to update user");
                }
            } else {
                const result = await dispatch(createUser(formData));
                if (createUser.fulfilled.match(result)) {
                    toast.success("User created successfully!");
                    setCreateAccess(false);
                } else {
                    toast.error(result.payload || "Failed to create user");
                }
            }
        } catch (err) {
            toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleModule = (value) => {
        setFormData((prev) => ({
            ...prev,
            modules: prev.modules.includes(value)
                ? prev.modules.filter((m) => m !== value)
                : [...prev.modules, value],
        }));
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            <h2 className="text-[#202224] text-[32px] font-bold mt-4 mb-4">
                {isEditMode ? "Edit Access" : "Create Access"}
            </h2>

            <div className="bg-white rounded-lg shadow-sm p-6 w-full h-full max-h-[700px] overflow-y-auto">

                {/* Basic Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Role <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="roleCode"
                                value={formData.roleCode}
                                onChange={handleChange}
                                className="rounded-md p-3 w-full outline-none appearance-none text-gray border border-[#D5D5D5] bg-[#F5F6FA]"
                            >
                                <option value="">Select Role</option>
                                {loadingDropdowns ? (
                                    <option disabled>Loading...</option>
                                ) : roles.filter((r) => r.code !== "VENDOR").map((role) => (
                                    <option key={role.id} value={role.code}>{role.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {!isEditMode && <span className="text-red-500">*</span>}
                            {isEditMode && <span className="text-gray-400 text-xs ml-1">(leave blank to keep current)</span>}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={isEditMode ? "Leave blank to keep current" : ""}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="outline-none border w-full border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                        />
                    </div>
                </div>

                {/* Permissions Section */}
                <div className="bg-[#F5F6FA] border border-[#D5D5D5] rounded-lg p-6 mb-6">

                    {/* Department */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-3">
                            Select Department <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {DEPARTMENTS.map((dept) => (
                                <div key={dept} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`dept-${dept}`}
                                        value={dept.toUpperCase()}
                                        checked={formData.modules.includes(dept.toUpperCase())}
                                        onChange={() => toggleModule(dept.toUpperCase())}
                                        className="w-4 h-4 accent-red-600 border-gray-300"
                                    />
                                    <label htmlFor={`dept-${dept}`} className="ml-2 text-sm text-black">{dept}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-black mb-3">
                            Select Terminal <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            {loadingDropdowns && terminal.length === 0 ? (
                                <p className="text-sm text-gray-500">Loading terminals...</p>
                            ) : terminal.length === 0 ? (
                                <p className="text-sm text-gray-500">No terminals found</p>
                            ) : terminal.map((t) => (
                                <div key={t.id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`terminal-${t.id}`}
                                        name="terminal"
                                        value={t.id}
                                        checked={formData.terminalIds.includes(t.id)}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, terminalIds: [Number(e.target.value)] }))}
                                        className="w-4 h-4 accent-red-600 border-gray-300"
                                    />
                                    <label htmlFor={`terminal-${t.id}`} className="ml-2 text-sm text-black">{t.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Control */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-3">
                            Control <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-6">
                            {["Read Only", "Read & Write"].map((control) => (
                                <div key={control} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`control-${control}`}
                                        name="permission"
                                        value={control}
                                        checked={formData.permission === control}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-red-600 border-gray-300"
                                    />
                                    <label htmlFor={`control-${control}`} className="ml-2 text-sm text-black">{control}</label>
                                </div>
                            ))}
                        </div>
                    </div>
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
                        className="bg-[#C01824] px-12 py-2 capitalize text-sm md:text-[16px] font-normal flex items-center disabled:opacity-50"
                        variant="filled"
                        onClick={handleSave}
                        disabled={isEditMode ? updating : creating}
                    >
                        {isEditMode ? (updating ? "Updating..." : "Update") : (creating ? "Creating..." : "Save")}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CreateAccessCard;
