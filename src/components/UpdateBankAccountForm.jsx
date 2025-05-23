import { Button } from '@material-tailwind/react';
import { useState } from 'react';

export default function UpdateBankAccountForm({ closeModal }) {
    const [formData, setFormData] = useState({
        fullName: 'Jane Cooper',
        contactNumber: '6542334600456',
        role: '+42325643232',
        city: 'Evergreen Terrace 74',
        address: 'New York',
        zipCode: '10001',
        email: 'New York',
        bankAccountNo: '10001',
        accountType: '',
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
        <div className="bg-white p-6 rounded-lg h-[75vh] mx-auto">
            <form className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                {/* <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#2C2F32]">
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
                            <label htmlFor="Saving" className="ml-2 text-sm font-bold text-[#2C2F32]">
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
                            <label htmlFor="Checking" className="ml-2 text-sm font-bold text-[#2C2F32]">
                                Checking
                            </label>
                        </div>
                    </div>
                </div> */}

                   <div className="flex items-center space-x-10">
                        {['Saving', 'Checking'].map((type) => (
                            <label key={type} className="flex items-center cursor-pointer space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                id={type}
                                checked={formData.accountType === type}
                                onChange={handleChange}
                                className="peer hidden"
                            />
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center 
                                border-2 transition-colors duration-200
                                ${formData.accountType === type ? 'border-[#C01824]' : 'border-gray-400'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-200
                                ${formData.accountType === type ? 'bg-[#C01824]' : 'bg-[#EDEAE4]'}`}>
                                </div>
                            </div>
                            <span className="text-sm text-[#2C2F32]">{type}</span>
                            </label>
                        ))}
                        </div>

                {/* Routing No */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[#2C2F32]">
                        Routing No
                    </label>
                    <input
                        type="text"
                        name="routingNo"
                        value={formData.routingNo}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#F5F6FA] border border-gray-200 rounded-md shadow-sm"
                    />
                </div>
                <div className="flex gap-3 mt-4">
                    <Button
                        className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    <Button className='bg-[#C01824] px-12 py-2 capitalize text-sm md:text-[16px] font-normal flex items-center'
                        variant='filled' onClick={closeModal}>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}