import { useState } from 'react';

export default function BankAccountForm() {
    const [formData, setFormData] = useState({
        fullName: 'Jane Cooper',
        contactNumber: '6542334600456',
        role: '+42325643232',
        city: 'Evergreen Terrace 74',
        address: 'New York',
        zipCode: '10001',
        email: 'New York',
        bankAccountNo: '10001',
        accountType: 'Saving',
        routingNo: '10001'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'radio' ? e.target.id : value
        }));
    };

    return (
        <div className="bg-white p-6 h-[75vh] rounded-lg mx-auto">
            <form className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Contact Number */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Role */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Role
                    </label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* City */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Address */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Zip Code */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Bank Account No */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Bank Account No
                    </label>
                    <input
                        type="text"
                        name="bankAccountNo"
                        value={formData.bankAccountNo}
                        onChange={handleChange}
                        className="outline-none w-full border border-[#D5D5D5] rounded-[6px] py-3 px-3 bg-[#F5F6FA]"
                    />
                </div>

                {/* Account Type */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Account Type
                    </label>
                    <div className="flex space-x-4 items-center pt-2">
                        <div className="flex items-center">
                            <input
                                id="Saving"
                                name="accountType"
                                type="radio"
                                checked={formData.accountType === 'Saving'}
                                onChange={handleChange}
                                className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <label htmlFor="Saving" className="ml-2 text-sm text-gray-700">
                                Saving
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="Checking"
                                name="accountType"
                                type="radio"
                                checked={formData.accountType === 'Checking'}
                                onChange={handleChange}
                                className="h-4 w-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                            />
                            <label htmlFor="Checking" className="ml-2 text-sm text-gray-700">
                                Checking
                            </label>
                        </div>
                    </div>
                </div>

                {/* Routing No */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Routing No
                    </label>
                    <input
                        type="text"
                        name="routingNo"
                        value={formData.routingNo}
                        onChange={handleChange}
                        className="w-full p-2 bg-white border border-gray-200 rounded-md shadow-sm"
                    />
                </div>
            </form>
        </div>
    );
}