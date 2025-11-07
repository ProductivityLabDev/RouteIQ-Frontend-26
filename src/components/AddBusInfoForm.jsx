import { pickFileIcon } from '@/assets';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBusInfoForm = ({ handleCancel ,refreshBuses}) => {
	const [storageOption, setStorageOption] = useState('');
	const [loading, setLoading] = useState(true);
	const [Drivers, setDrivers] = useState([]);
	const [fuelTypes, setFuelTypes] = useState([]);
	const [terminals, setTerminals] = useState([]);
	const [formData, setFormData] = useState({
		vehicleName: "",
		busType: "",
		numberPlate: "",
		modelYear: "",
		serviceInterval: "",
		fuelTankSize: "",
		assignedTerminal: "",
		expiredDate: "",
		vehicleMake: "",
		noOfPassenger: "",
		vinNo: "",
		mileage: "",
		driver: "",
		fuelType: "",
		insuranceExpiration: "",
		undercarriageStorage: ""
	});

	const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
	const token = localStorage.getItem("token");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Include undercarriageStorage in the submission
			const submissionData = {
				...formData,
				undercarriageStorage: storageOption,
			};
			const res = await axios.post(`${BASE_URL}/institute/createbuses`, submissionData, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log("Bus Added:", res.data);
			alert("Bus added successfully!");
			if (refreshBuses) {
      await refreshBuses();
    }
			handleCancel();
		} catch (err) {
			console.error("Error adding Bus:", err);
			alert(err.response?.data?.message || "Failed to add bus");
		}
	};

	const getdriver = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/institute/drivers`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});

			console.log("Fetched pay Drivers:", res.data);
			// ✅ API gives { ok:true, data:[...] }
			if (res.data?.data && Array.isArray(res.data.data)) {
				setDrivers(res.data.data);
			} else {
				setDrivers([]);
			}
		} catch (err) {
			console.error("Error fetching Drivers:", err);
			setDrivers([]);
		} finally {
			setLoading(false);
		}
	};
	const getFuelTypes = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/institute/fueltypes`, {
				withCredentials: true,
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched Fuel Types:", res.data);
			if (res.data?.data && Array.isArray(res.data.data)) {
				setFuelTypes(res.data.data);
			} else {
				setFuelTypes([]);
			}
		} catch (err) {
			console.error("Error fetching Fuel Types:", err);
			setFuelTypes([]);
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
	useEffect(() => {
		getdriver();
		getFuelTypes();
		getTerminals();
		// getPaycycles();
	}, [token]);
	return (
		<div className="grid grid-cols-1 bg-white w-full rounded-lg">
			<form className="w-full" onSubmit={handleSubmit}>
				{/* Header */}
				<div className='flex items-center gap-4 p-9'>
					<button
						type="button"
						className="text-black hover:text-red-600"
						onClick={(e) => {
							e.preventDefault();
							handleCancel();
						}}>
						<FaArrowLeft className="cursor-pointer" />
					</button>
					<h2 className='text-[18px] text-[#000] font-bold'>Bus Information</h2>
				</div>

				{/* Form Grid: 2 Columns */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
					{/* Column 1 */}
					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mb-1">Vehicle name/number</label>
						<input
							type="text"
							name="vehicleName"
							value={formData.vehicleName}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Vehicle name/number'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Bus type</label>
						<input
							type="text"
							name="busType"
							value={formData.busType}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Bus type'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Number Plate</label>
						<input
							type="text"
							name="numberPlate"
							value={formData.numberPlate}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Number Plate'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Year</label>
						<input
							type="text"
							name="modelYear"
							value={formData.modelYear}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Year'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Service intervals</label>
						<input
							type="date"
							name="serviceInterval"
							value={formData.serviceInterval}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Service intervals'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Fuel tank size</label>
						<input
							type="text"
							name="fuelTankSize"
							value={formData.fuelTankSize}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Fuel tank size'
						/>
					</div>

					{/* Column 2 */}
					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mb-1">Vehicle Make</label>
						<input
							type="text"
							name="vehicleMake"
							value={formData.vehicleMake}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Vehicle Make'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">No of passengers</label>
						<input
							type="text"
							name="noOfPassenger"
							value={formData.noOfPassenger}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='No of passengers'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Vin No</label>
						<input
							type="text"
							name="vinNo"
							value={formData.vinNo}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Vin No'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Mileage</label>
						<input
							type="text"
							name="mileage"
							value={formData.mileage}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Mileage'
						/>

						<label className="block text-sm font-bold text-black mt-4 mb-1">Drivers</label>

						<select
							name="driver"
							value={formData.driver || ""}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
						>
							<option value="">Select</option>
							{loading ? (
								<option className="text-gray-500">Loading...</option>
							) : Drivers.length > 0 ? (
								Drivers.map((d) => (
									<option key={d.EmpId} value={d.EmpId} className="text-black">
										{d.Name} ({d.DesignationName})
									</option>
								))
							) : (
								<option>No drivers found</option>
							)}
						</select>



						<label className="block text-sm font-bold text-black mt-4 mb-1">Fuel type (gas, diesel)</label>

						<select
							name="fuelType"
							value={formData.fuelType || ""}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
						>
							<option value="">Select</option>
							{loading ? (
								<option className="text-gray-500">Loading...</option>
							) : fuelTypes.length > 0 ? (
								fuelTypes.map((type) => (
									<option key={type.Id} value={type.Id} className="text-black">
										{type.Name}
									</option>
								))
							) : (
								<option>No fuel types found</option>
							)}
						</select>

					</div>
				</div>

				{/* Additional Fields (Row below 2 columns) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mt-4 mb-1">Assigned Terminal</label>
						{/* <select
							name="assignedTerminal"
							value=""
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
						>
							<option value="">Select</option>
						</select> */}
						<select
							name="assignedTerminal"
							value={formData.assignedTerminal || ""}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
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


						<label className="block text-sm font-bold text-black mt-4 mb-1">Expiration Date</label>
						<input
							type="date"
							name="expiredDate"
							value={formData.expiredDate}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] w-[70%] rounded-[6px] py-3 px-6 bg-[#F5F6FA]"
							placeholder='Expiration Date'
						/>
					</div>

					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mt-4 mb-1">Insurance & Expiration</label>
						<input
							type="text"
							name="insuranceExpiration"
							value={formData.insuranceExpiration}
							onChange={handleChange}
							className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
							placeholder='Insurance & Expiration'
						/>

						<div className="mt-6">
							<label className="block text-lg font-bold text-gray-800 mb-2">
								Undercarriage Storage
							</label>
							<div className="flex items-center gap-6">
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										name="undercarriage"
										value="yes"
										checked={storageOption === 'yes'}
										onChange={() => setStorageOption('yes')}
										className="form-radio h-4 w-4 text-[#c01824]"
									/>
									<span>Yes</span>
								</label>
								<label className="flex items-center space-x-2">
									<input
										type="radio"
										name="undercarriage"
										value="no"
										checked={storageOption === 'no'}
										onChange={() => setStorageOption('no')}
										className="form-radio h-4 w-4 text-[#c01824]"
									/>
									<span>No</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				{/* Buttons */}
				<div className="mt-6 flex justify-start space-x-4 px-6 pb-6">
					<button
						type="submit"
						onClick={handleSubmit}
						className="px-8 py-4 bg-[#C01824] w-[30%] text-white rounded hover:bg-red-700"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default AddBusInfoForm;
