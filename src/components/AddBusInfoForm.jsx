import { pickFileIcon } from '@/assets';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, fetchFuelTypes, fetchTerminals, createBus, updateBus } from '@/redux/slices/busesSlice';
import { toast } from 'react-hot-toast';

const AddBusInfoForm = ({ handleCancel, refreshBuses, editBus }) => {
	const dispatch = useDispatch();
	const { drivers, fuelTypes, terminals, loading, error } = useSelector((state) => state.buses);
	const isEditMode = !!editBus;
	
	const [storageOption, setStorageOption] = useState('');
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
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleBlur = (e) => {
		const { name } = e.target;
		setTouched((prev) => ({ ...prev, [name]: true }));
		validateField(name, formData[name]);
	};

	const validateField = (name, value) => {
		let error = "";
		
		// Helper to safely convert value to string (handles null, undefined, numbers)
		const getStringValue = (val) => {
			if (val == null) return ""; // null or undefined
			if (typeof val === "string") return val.trim();
			return String(val).trim(); // Convert number/other types to string
		};
		
		const stringValue = getStringValue(value);

		switch (name) {
			case "vehicleName":
				if (!stringValue) {
					error = "Vehicle name/number is required";
				} else if (stringValue.length < 2) {
					error = "Vehicle name must be at least 2 characters";
				}
				break;

			case "busType":
				if (!stringValue) {
					error = "Bus type is required";
				}
				break;

			case "numberPlate":
				if (!stringValue) {
					error = "Number plate is required";
				} else if (stringValue.length < 3) {
					error = "Number plate must be at least 3 characters";
				}
				break;

			case "modelYear":
				if (!stringValue) {
					error = "Year is required";
				} else {
					const year = parseInt(stringValue);
					const currentYear = new Date().getFullYear();
					if (isNaN(year) || year < 1900 || year > currentYear + 1) {
						error = `Year must be between 1900 and ${currentYear + 1}`;
					}
				}
				break;

			case "serviceInterval":
				if (!value) {
					error = "Service interval date is required";
				} else {
					const selectedDate = new Date(value);
					if (selectedDate < new Date()) {
						error = "Service interval date cannot be in the past";
					}
				}
				break;

			case "fuelTankSize":
				if (!stringValue) {
					error = "Fuel tank size is required";
				} else {
					const size = parseFloat(stringValue);
					if (isNaN(size) || size <= 0 || size > 1000) {
						error = "Fuel tank size must be a number between 1 and 1000 liters";
					}
				}
				break;

			case "vehicleMake":
				if (!stringValue) {
					error = "Vehicle make is required";
				}
				break;

			case "noOfPassenger":
				if (!stringValue) {
					error = "Number of passengers is required";
				} else {
					const passengers = parseInt(stringValue);
					if (isNaN(passengers) || passengers < 1 || passengers > 100) {
						error = "Number of passengers must be between 1 and 100";
					}
				}
				break;

			case "vinNo":
				if (!stringValue) {
					error = "VIN number is required";
				} else if (stringValue.length !== 17) {
					error = "VIN number must be exactly 17 characters";
				} else if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(stringValue)) {
					error = "Invalid VIN format (must be 17 alphanumeric characters, excluding I, O, Q)";
				}
				break;

			case "mileage":
				if (stringValue && (isNaN(parseFloat(stringValue)) || parseFloat(stringValue) < 0)) {
					error = "Mileage must be a positive number";
				}
				break;

			case "driver":
				// Skip validation for now since drivers API is not working
				if (!value) {
					error = "Please select a driver";
				}
				break;

			case "fuelType":
				if (!value) {
					error = "Please select a fuel type";
				}
				break;

			case "assignedTerminal":
				if (!value) {
					error = "Please select an assigned terminal";
				}
				break;

			case "expiredDate":
				if (!value) {
					error = "Expiration date is required";
				} else {
					const expDate = new Date(value);
					if (expDate <= new Date()) {
						error = "Expiration date must be in the future";
					}
				}
				break;

			case "insuranceExpiration":
				// Optional field, but if provided should be valid date
				if (stringValue) {
					const insDate = new Date(value);
					if (isNaN(insDate.getTime())) {
						error = "Invalid date format";
					}
				}
				break;

			default:
				break;
		}

		setErrors((prev) => ({ ...prev, [name]: error }));
		return !error;
	};

	const validateForm = () => {
		let isValid = true;
		const newErrors = {};

		// Validate all fields (skip driver for now since API is not working)
		Object.keys(formData).forEach((key) => {
			if (key !== "insuranceExpiration" && key !== "mileage" && key !== "driver") {
				if (!validateField(key, formData[key])) {
					isValid = false;
				}
			}
		});

		// Validate undercarriage storage
		if (!storageOption) {
			newErrors.undercarriageStorage = "Please select undercarriage storage option";
			isValid = false;
		}

		// Validate optional fields
		if (formData.mileage && !validateField("mileage", formData.mileage)) {
			isValid = false;
		}
		if (formData.insuranceExpiration && !validateField("insuranceExpiration", formData.insuranceExpiration)) {
			isValid = false;
		}

		setErrors((prev) => ({ ...prev, ...newErrors }));
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Mark all fields as touched
		const allFields = Object.keys(formData);
		const touchedFields = {};
		allFields.forEach((field) => {
			touchedFields[field] = true;
		});
		setTouched(touchedFields);

		// Validate form
		if (!validateForm()) {
			alert("Please fix all validation errors before submitting");
			return;
		}

		try {
			// Prepare form data with undercarriageStorage
			const busData = {
				...formData,
				driver: formData.driver || "1", // Default to driver ID 1 if not selected
				undercarriageStorage: storageOption,
			};

			if (isEditMode && editBus) {
				// Update existing bus - try multiple possible property names
				const vehicleId = editBus.vehicleId 
					|| editBus.VehicleId
					|| editBus.BusId 
					|| editBus.busId 
					|| editBus.id 
					|| editBus.Id
					|| editBus.ID;
				
				console.log("🔄 [AddBusInfoForm] Updating bus with vehicleId:", vehicleId);
				console.log("🔄 [AddBusInfoForm] Edit bus data:", editBus);
				console.log("🔄 [AddBusInfoForm] Edit bus keys:", Object.keys(editBus));
				console.log("🔄 [AddBusInfoForm] Form data:", busData);
				
				if (!vehicleId) {
					toast.error("Vehicle ID not found. Cannot update.");
					console.error("❌ [AddBusInfoForm] Vehicle ID not found in editBus:", editBus);
					console.error("❌ [AddBusInfoForm] Available keys:", Object.keys(editBus));
					return;
				}

				const result = await dispatch(updateBus({ vehicleId, busData }));
				console.log("🔄 [AddBusInfoForm] Update result:", result);

				if (updateBus.fulfilled.match(result)) {
					toast.success("Bus updated successfully!");
					if (refreshBuses) {
						await refreshBuses();
					}
					handleCancel();
				} else {
					console.error("❌ [AddBusInfoForm] Update failed:", result.payload);
					toast.error(result.payload || "Failed to update bus");
				}
			} else {
				// Create new bus
				const result = await dispatch(createBus(busData));

				if (createBus.fulfilled.match(result)) {
					toast.success("Bus added successfully!");
					if (refreshBuses) {
						await refreshBuses();
					}
					handleCancel();
				} else {
					toast.error(result.payload || "Failed to add bus");
				}
			}
		} catch (err) {
			console.error(`Error ${isEditMode ? 'updating' : 'adding'} Bus:`, err);
			toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'add'} bus`);
		}
	};

	useEffect(() => {
		// Fetch all required data on component mount
		dispatch(fetchDrivers());
		dispatch(fetchFuelTypes());
		dispatch(fetchTerminals());
	}, [dispatch]);

	// Populate form when editing
	useEffect(() => {
		if (editBus && isEditMode) {
			// Convert date strings to YYYY-MM-DD format for date inputs
			const formatDate = (dateString) => {
				if (!dateString) return "";
				const date = new Date(dateString);
				if (isNaN(date.getTime())) return "";
				return date.toISOString().split('T')[0];
			};

			// Calculate service interval date from days
			const getServiceIntervalDate = (days) => {
				if (!days || days === 0) return "";
				const today = new Date();
				today.setDate(today.getDate() + parseInt(days));
				return formatDate(today);
			};

			setFormData({
				vehicleName: editBus.VehicleName || editBus.vehicleName || "",
				busType: editBus.BusType || editBus.busType || "",
				numberPlate: editBus.NumberPlate || editBus.numberPlate || "",
				modelYear: editBus.ModelYear || editBus.modelYear || "",
				serviceInterval: editBus.ServiceInterval ? getServiceIntervalDate(editBus.ServiceInterval) : "",
				fuelTankSize: editBus.FuelTankSize || editBus.fuelTankSize || "",
				assignedTerminal: editBus.AssignedTerminalId || editBus.assignedTerminalId || editBus.TerminalId || editBus.terminalId || "",
				expiredDate: formatDate(editBus.ExpiredDate || editBus.expiredDate),
				vehicleMake: editBus.VehicleMake || editBus.vehicleMake || "",
				noOfPassenger: editBus.NoOfPassenger || editBus.noOfPassenger || "",
				vinNo: editBus.VinNo || editBus.vinNo || "",
				mileage: editBus.Mileage || editBus.mileage || "",
				driver: editBus.DriverId || editBus.driverId || "",
				driverName: editBus.DriverName || editBus.driverName || "",
				fuelType: editBus.FuelTypeId || editBus.fuelTypeId || "",
				insuranceExpiration: formatDate(editBus.InsuranceExpiration || editBus.insuranceExpiration),
				undercarriageStorage: editBus.UndercarriageStorage === 1 || editBus.undercarriageStorage === 1 ? "yes" : 
					editBus.UndercarriageStorage === 0 || editBus.undercarriageStorage === 0 ? "no" : ""
			});

			setStorageOption(
				editBus.UndercarriageStorage === 1 || editBus.undercarriageStorage === 1 ? "yes" : 
				editBus.UndercarriageStorage === 0 || editBus.undercarriageStorage === 0 ? "no" : ""
			);
		}
	}, [editBus, isEditMode]);

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
					<label className="block text-sm font-bold text-black mb-1">Vehicle name/number <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="vehicleName"
						value={formData.vehicleName}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.vehicleName && touched.vehicleName ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Vehicle name/number'
					/>
					{errors.vehicleName && touched.vehicleName && (
						<p className="text-red-500 text-xs mt-1">{errors.vehicleName}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Bus type <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="busType"
						value={formData.busType}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.busType && touched.busType ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Bus type'
					/>
					{errors.busType && touched.busType && (
						<p className="text-red-500 text-xs mt-1">{errors.busType}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Number Plate <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="numberPlate"
						value={formData.numberPlate}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.numberPlate && touched.numberPlate ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Number Plate'
					/>
					{errors.numberPlate && touched.numberPlate && (
						<p className="text-red-500 text-xs mt-1">{errors.numberPlate}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Year <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="modelYear"
						value={formData.modelYear}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.modelYear && touched.modelYear ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Year'
					/>
					{errors.modelYear && touched.modelYear && (
						<p className="text-red-500 text-xs mt-1">{errors.modelYear}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Service intervals <span className="text-red-500">*</span></label>
					<input
						type="date"
						name="serviceInterval"
						value={formData.serviceInterval}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.serviceInterval && touched.serviceInterval ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Service intervals'
					/>
					{errors.serviceInterval && touched.serviceInterval && (
						<p className="text-red-500 text-xs mt-1">{errors.serviceInterval}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Fuel tank size <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="fuelTankSize"
						value={formData.fuelTankSize}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.fuelTankSize && touched.fuelTankSize ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Fuel tank size (liters)'
					/>
					{errors.fuelTankSize && touched.fuelTankSize && (
						<p className="text-red-500 text-xs mt-1">{errors.fuelTankSize}</p>
					)}
					</div>

					{/* Column 2 */}
					<div className="mb-4 w-full">
					<label className="block text-sm font-bold text-black mb-1">Vehicle Make <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="vehicleMake"
						value={formData.vehicleMake}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.vehicleMake && touched.vehicleMake ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Vehicle Make'
					/>
					{errors.vehicleMake && touched.vehicleMake && (
						<p className="text-red-500 text-xs mt-1">{errors.vehicleMake}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">No of passengers <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="noOfPassenger"
						value={formData.noOfPassenger}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.noOfPassenger && touched.noOfPassenger ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='No of passengers'
					/>
					{errors.noOfPassenger && touched.noOfPassenger && (
						<p className="text-red-500 text-xs mt-1">{errors.noOfPassenger}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Vin No <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="vinNo"
						value={formData.vinNo}
						onChange={handleChange}
						onBlur={handleBlur}
						maxLength={17}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] uppercase ${
							errors.vinNo && touched.vinNo ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='VIN No (17 characters)'
					/>
					{errors.vinNo && touched.vinNo && (
						<p className="text-red-500 text-xs mt-1">{errors.vinNo}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Mileage</label>
					<input
						type="text"
						name="mileage"
						value={formData.mileage}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.mileage && touched.mileage ? "border-red-500" : "border-[#D5D5D5]"
						}`}
						placeholder='Mileage (optional)'
					/>
					{errors.mileage && touched.mileage && (
						<p className="text-red-500 text-xs mt-1">{errors.mileage}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Drivers <span className="text-red-500">*</span></label>

					<select
						name="driver"
						value={formData.driver || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.driver && touched.driver ? "border-red-500" : "border-[#D5D5D5]"
						}`}
					>
							<option value="">Select</option>
							{loading.drivers ? (
								<option className="text-gray-500">Loading...</option>
							) : drivers.length > 0 ? (
								drivers.map((d) => (
									<option key={d.DriverId} value={d.DriverId} className="text-black">
										{d.Name} {d.DriverName}
									</option>
								))
							) : (
								<option>No drivers found</option>
						)}
					</select>
					{errors.driver && touched.driver && (
						<p className="text-red-500 text-xs mt-1">{errors.driver}</p>
					)}

					<label className="block text-sm font-bold text-black mt-4 mb-1">Fuel type (gas, diesel) <span className="text-red-500">*</span></label>

					<select
						name="fuelType"
						value={formData.fuelType || ""}
						onChange={handleChange}
						onBlur={handleBlur}
						className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
							errors.fuelType && touched.fuelType ? "border-red-500" : "border-[#D5D5D5]"
						}`}
					>
							<option value="">Select</option>
							{loading.fuelTypes ? (
								<option className="text-gray-500">Loading...</option>
							) : fuelTypes.length > 0 ? (
								fuelTypes.map((type) => (
									<option key={type.FuelTypeId} value={type.FuelTypeId} className="text-black">
										{type.FuelTypeName}
									</option>
								))
							) : (
								<option>No fuel types found</option>
							)}
						</select>
						{errors.fuelType && touched.fuelType && (
							<p className="text-red-500 text-xs mt-1">{errors.fuelType}</p>
						)}

					</div>
				</div>

				{/* Additional Fields (Row below 2 columns) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mt-4 mb-1">Assigned Terminal <span className="text-red-500">*</span></label>
						<select
							name="assignedTerminal"
							value={formData.assignedTerminal || ""}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
								errors.assignedTerminal && touched.assignedTerminal ? "border-red-500" : "border-[#D5D5D5]"
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
						{errors.assignedTerminal && touched.assignedTerminal && (
							<p className="text-red-500 text-xs mt-1">{errors.assignedTerminal}</p>
						)}

						<label className="block text-sm font-bold text-black mt-4 mb-1">Expiration Date <span className="text-red-500">*</span></label>
						<input
							type="date"
							name="expiredDate"
							value={formData.expiredDate}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`outline-none border w-[70%] rounded-[6px] py-3 px-6 bg-[#F5F6FA] ${
								errors.expiredDate && touched.expiredDate ? "border-red-500" : "border-[#D5D5D5]"
							}`}
							placeholder='Expiration Date'
						/>
						{errors.expiredDate && touched.expiredDate && (
							<p className="text-red-500 text-xs mt-1">{errors.expiredDate}</p>
						)}
					</div>

					<div className="mb-4 w-full">
						<label className="block text-sm font-bold text-black mt-4 mb-1">Insurance & Expiration</label>
						<input
							type="text"
							name="insuranceExpiration"
							value={formData.insuranceExpiration}
							onChange={handleChange}
							onBlur={handleBlur}
							className={`outline-none border rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%] ${
								errors.insuranceExpiration && touched.insuranceExpiration ? "border-red-500" : "border-[#D5D5D5]"
							}`}
							placeholder='Insurance & Expiration (optional)'
						/>
						{errors.insuranceExpiration && touched.insuranceExpiration && (
							<p className="text-red-500 text-xs mt-1">{errors.insuranceExpiration}</p>
						)}

						<div className="mt-6">
							<label className="block text-lg font-bold text-gray-800 mb-2">
								Undercarriage Storage <span className="text-red-500">*</span>
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
							{errors.undercarriageStorage && (
								<p className="text-red-500 text-xs mt-1">{errors.undercarriageStorage}</p>
							)}
						</div>
					</div>
				</div>

				{/* Buttons */}
				<div className="mt-6 flex justify-start space-x-4 px-6 pb-6">
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isEditMode ? loading.updating : loading.creating}
					className="px-8 py-4 bg-[#C01824] w-[30%] text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isEditMode 
						? (loading.updating ? "Updating..." : "Update Bus")
						: (loading.creating ? "Submitting..." : "Submit")
					}
				</button>
				</div>
			</form>
		</div>
	);
};

export default AddBusInfoForm;
