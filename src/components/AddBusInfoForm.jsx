import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers, fetchFuelTypes, fetchTerminals, createBus, updateBus } from '@/redux/slices/busesSlice';
import { toast } from 'react-hot-toast';

// ── Reusable field wrapper ─────────────────────────────────────────────────
const Field = ({ label, required, error, touched, children }) => (
	<div className="flex flex-col gap-1">
		<label className="text-sm font-bold text-black">
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		{children}
		{error && touched && <p className="text-red-500 text-xs">{error}</p>}
	</div>
);

const inputClass = (err, touch) =>
	`outline-none border rounded-md py-2.5 px-4 bg-[#F5F6FA] w-full text-sm ${
		err && touch ? 'border-red-500' : 'border-[#D5D5D5]'
	}`;

// ── Validation ─────────────────────────────────────────────────────────────
const validate = (name, value) => {
	const str = value == null ? '' : String(value).trim();
	const currentYear = new Date().getFullYear();

	switch (name) {
		case 'vehicleName':
			if (!str) return 'Vehicle name/number is required';
			if (str.length < 2) return 'Minimum 2 characters';
			break;
		case 'busType':
			if (!str) return 'Bus type is required';
			break;
		case 'numberPlate':
			if (!str) return 'Number plate is required';
			if (str.length < 3) return 'Minimum 3 characters';
			break;
		case 'modelYear': {
			if (!str) return 'Year is required';
			const y = parseInt(str);
			if (isNaN(y) || y < 1900 || y > currentYear + 1)
				return `Year must be between 1900 and ${currentYear + 1}`;
			break;
		}
		case 'serviceInterval':
			if (!value) return 'Service interval date is required';
			if (new Date(value) < new Date()) return 'Cannot be in the past';
			break;
		case 'fuelTankSize': {
			if (!str) return 'Fuel tank size is required';
			const s = parseFloat(str);
			if (isNaN(s) || s <= 0 || s > 1000) return 'Must be between 1–1000 liters';
			break;
		}
		case 'vehicleMake':
			if (!str) return 'Vehicle make is required';
			break;
		case 'noOfPassenger': {
			if (!str) return 'Number of passengers is required';
			const p = parseInt(str);
			if (isNaN(p) || p < 1 || p > 100) return 'Must be between 1–100';
			break;
		}
		case 'vinNo':
			if (!str) return 'VIN number is required';
			if (str.length !== 17) return 'Must be exactly 17 characters';
			if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(str)) return 'Invalid VIN format';
			break;
		case 'mileage':
			if (str && (isNaN(parseFloat(str)) || parseFloat(str) < 0))
				return 'Must be a positive number';
			break;
		case 'driver':
			if (!value) return 'Please select a driver';
			break;
		case 'fuelType':
			if (!value) return 'Please select a fuel type';
			break;
		case 'assignedTerminal':
			if (!value) return 'Please select a terminal';
			break;
		case 'expiredDate':
			if (!value) return 'Expiration date is required';
			if (new Date(value) <= new Date()) return 'Must be in the future';
			break;
		case 'insuranceExpiration':
			if (value && isNaN(new Date(value).getTime())) return 'Invalid date';
			break;
		default:
			break;
	}
	return '';
};

// ── Component ──────────────────────────────────────────────────────────────
const REQUIRED_FIELDS = [
	'vehicleName', 'busType', 'numberPlate', 'modelYear',
	'serviceInterval', 'fuelTankSize', 'vehicleMake', 'noOfPassenger',
	'vinNo', 'driver', 'fuelType', 'assignedTerminal', 'expiredDate',
];

const INITIAL_FORM = {
	vehicleName: '', busType: '', numberPlate: '', modelYear: '',
	serviceInterval: '', fuelTankSize: '', assignedTerminal: '', expiredDate: '',
	vehicleMake: '', noOfPassenger: '', vinNo: '', mileage: '',
	driver: '', fuelType: '', insuranceExpiration: '', undercarriageStorage: '',
};

const AddBusInfoForm = ({ handleCancel, refreshBuses, editBus }) => {
	const dispatch = useDispatch();
	const { drivers, fuelTypes, terminals, loading } = useSelector((s) => s.buses);
	const isEditMode = !!editBus;

	const [formData, setFormData]       = useState(INITIAL_FORM);
	const [storageOption, setStorage]   = useState('');
	const [errors, setErrors]           = useState({});
	const [touched, setTouched]         = useState({});

	// ── Load dropdowns ────────────────────────────────────────────────────
	useEffect(() => {
		dispatch(fetchDrivers());
		dispatch(fetchFuelTypes());
		dispatch(fetchTerminals());
	}, [dispatch]);

	// ── Populate form in edit mode ────────────────────────────────────────
	useEffect(() => {
		if (!editBus || !isEditMode) return;

		const fmt = (d) => {
			if (!d) return '';
			const dt = new Date(d);
			return isNaN(dt.getTime()) ? '' : dt.toISOString().split('T')[0];
		};

		const svcDays = editBus.ServiceInterval;
		let svcDate = '';
		if (svcDays) {
			const d = new Date();
			d.setDate(d.getDate() + parseInt(svcDays));
			svcDate = fmt(d);
		}

		const storage =
			editBus.UndercarriageStorage === 1 || editBus.undercarriageStorage === 1 ? 'yes' :
			editBus.UndercarriageStorage === 0 || editBus.undercarriageStorage === 0 ? 'no' : '';

		setFormData({
			vehicleName:          editBus.VehicleName          || editBus.vehicleName          || '',
			busType:              editBus.BusType               || editBus.busType               || '',
			numberPlate:          editBus.NumberPlate           || editBus.numberPlate           || '',
			modelYear:            editBus.ModelYear             || editBus.modelYear             || '',
			serviceInterval:      svcDate,
			fuelTankSize:         editBus.FuelTankSize          || editBus.fuelTankSize          || '',
			assignedTerminal:     editBus.AssignedTerminalId    || editBus.assignedTerminalId    || editBus.TerminalId || editBus.terminalId || '',
			expiredDate:          fmt(editBus.ExpiredDate       || editBus.expiredDate),
			vehicleMake:          editBus.VehicleMake           || editBus.vehicleMake           || '',
			noOfPassenger:        editBus.NoOfPassenger         || editBus.noOfPassenger         || '',
			vinNo:                editBus.VinNo                 || editBus.vinNo                 || '',
			mileage:              editBus.Mileage               || editBus.mileage               || '',
			driver:               editBus.DriverId              || editBus.driverId              || '',
			fuelType:             editBus.FuelTypeId            || editBus.fuelTypeId            || '',
			insuranceExpiration:  fmt(editBus.InsuranceExpiration || editBus.insuranceExpiration),
			undercarriageStorage: storage,
		});
		setStorage(storage);
	}, [editBus, isEditMode]);

	// ── Handlers ─────────────────────────────────────────────────────────
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((p) => ({ ...p, [name]: value }));
		if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
	};

	const handleBlur = (e) => {
		const { name, value } = e.target;
		setTouched((p) => ({ ...p, [name]: true }));
		setErrors((p) => ({ ...p, [name]: validate(name, value) }));
	};

	// ── Submit ────────────────────────────────────────────────────────────
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Touch & validate all required fields
		const newTouched = {};
		const newErrors  = {};
		REQUIRED_FIELDS.forEach((key) => {
			newTouched[key] = true;
			newErrors[key]  = validate(key, formData[key]);
		});
		if (!storageOption) newErrors.undercarriageStorage = 'Please select undercarriage storage option';

		// Optional fields
		['mileage', 'insuranceExpiration'].forEach((key) => {
			if (formData[key]) newErrors[key] = validate(key, formData[key]);
		});

		setTouched((p) => ({ ...p, ...newTouched }));
		setErrors((p)  => ({ ...p, ...newErrors }));

		const hasError = Object.values(newErrors).some(Boolean);
		if (hasError) {
			toast.error('Please fix all validation errors before submitting');
			return;
		}

		const busData = { ...formData, driver: formData.driver || '1', undercarriageStorage: storageOption };

		try {
			if (isEditMode) {
				const vehicleId =
					editBus.vehicleId || editBus.VehicleId || editBus.BusId ||
					editBus.busId     || editBus.id        || editBus.Id    || editBus.ID;

				if (!vehicleId) { toast.error('Vehicle ID not found. Cannot update.'); return; }

				const result = await dispatch(updateBus({ vehicleId, busData }));
				if (updateBus.fulfilled.match(result)) {
					toast.success('Bus updated successfully!');
					refreshBuses?.();
					handleCancel();
				} else {
					toast.error(result.payload || 'Failed to update bus');
				}
			} else {
				const result = await dispatch(createBus(busData));
				if (createBus.fulfilled.match(result)) {
					toast.success('Bus added successfully!');
					refreshBuses?.();
					handleCancel();
				} else {
					toast.error(result.payload || 'Failed to add bus');
				}
			}
		} catch (err) {
			toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'add'} bus`);
		}
	};

	const isSubmitting = isEditMode ? loading.updating : loading.creating;

	// ── Render ────────────────────────────────────────────────────────────
	return (
		<div className="bg-white w-full rounded-lg">
			<form onSubmit={handleSubmit} noValidate>
				{/* Header */}
				<div className="flex items-center gap-4 p-6 border-b">
					<button type="button" onClick={handleCancel} className="text-gray-500 hover:text-red-600">
						<FaArrowLeft />
					</button>
					<h2 className="text-lg font-bold text-black">
						{isEditMode ? 'Edit Bus Information' : 'Bus Information'}
					</h2>
				</div>

				{/* Fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 p-6">
					<Field label="Vehicle Name / Number" required error={errors.vehicleName} touched={touched.vehicleName}>
						<input
							type="text" name="vehicleName" value={formData.vehicleName}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="Vehicle name/number"
							className={inputClass(errors.vehicleName, touched.vehicleName)}
						/>
					</Field>

					<Field label="Vehicle Make" required error={errors.vehicleMake} touched={touched.vehicleMake}>
						<input
							type="text" name="vehicleMake" value={formData.vehicleMake}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. Ford, Toyota"
							className={inputClass(errors.vehicleMake, touched.vehicleMake)}
						/>
					</Field>

					<Field label="Bus Type" required error={errors.busType} touched={touched.busType}>
						<input
							type="text" name="busType" value={formData.busType}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. School Bus, Mini Bus"
							className={inputClass(errors.busType, touched.busType)}
						/>
					</Field>

					<Field label="No. of Passengers" required error={errors.noOfPassenger} touched={touched.noOfPassenger}>
						<input
							type="number" name="noOfPassenger" value={formData.noOfPassenger}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. 40" min={1} max={100}
							className={inputClass(errors.noOfPassenger, touched.noOfPassenger)}
						/>
					</Field>

					<Field label="Number Plate" required error={errors.numberPlate} touched={touched.numberPlate}>
						<input
							type="text" name="numberPlate" value={formData.numberPlate}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. ABC-1234"
							className={inputClass(errors.numberPlate, touched.numberPlate)}
						/>
					</Field>

					<Field label="VIN Number" required error={errors.vinNo} touched={touched.vinNo}>
						<input
							type="text" name="vinNo" value={formData.vinNo}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="17-character VIN" maxLength={17}
							className={`${inputClass(errors.vinNo, touched.vinNo)} uppercase`}
						/>
					</Field>

					<Field label="Model Year" required error={errors.modelYear} touched={touched.modelYear}>
						<input
							type="number" name="modelYear" value={formData.modelYear}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. 2022" min={1900} max={new Date().getFullYear() + 1}
							className={inputClass(errors.modelYear, touched.modelYear)}
						/>
					</Field>

					<Field label="Mileage" error={errors.mileage} touched={touched.mileage}>
						<input
							type="number" name="mileage" value={formData.mileage}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="Current mileage (optional)" min={0}
							className={inputClass(errors.mileage, touched.mileage)}
						/>
					</Field>

					<Field label="Service Interval" required error={errors.serviceInterval} touched={touched.serviceInterval}>
						<input
							type="date" name="serviceInterval" value={formData.serviceInterval}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.serviceInterval, touched.serviceInterval)}
						/>
					</Field>

					<Field label="Assigned Driver" required error={errors.driver} touched={touched.driver}>
						<select
							name="driver" value={formData.driver}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.driver, touched.driver)}
						>
							<option value="">Select driver</option>
							{loading.drivers ? (
								<option disabled>Loading...</option>
							) : drivers.length > 0 ? (
								drivers.map((d) => (
									<option key={d.DriverId} value={d.DriverId}>
										{d.Name || d.DriverName}
									</option>
								))
							) : (
								<option disabled>No drivers found</option>
							)}
						</select>
					</Field>

					<Field label="Fuel Tank Size (liters)" required error={errors.fuelTankSize} touched={touched.fuelTankSize}>
						<input
							type="number" name="fuelTankSize" value={formData.fuelTankSize}
							onChange={handleChange} onBlur={handleBlur}
							placeholder="e.g. 100" min={1} max={1000}
							className={inputClass(errors.fuelTankSize, touched.fuelTankSize)}
						/>
					</Field>

					<Field label="Fuel Type" required error={errors.fuelType} touched={touched.fuelType}>
						<select
							name="fuelType" value={formData.fuelType}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.fuelType, touched.fuelType)}
						>
							<option value="">Select fuel type</option>
							{loading.fuelTypes ? (
								<option disabled>Loading...</option>
							) : fuelTypes.length > 0 ? (
								fuelTypes.map((t) => (
									<option key={t.FuelTypeId} value={t.FuelTypeId}>{t.FuelTypeName}</option>
								))
							) : (
								<option disabled>No fuel types found</option>
							)}
						</select>
					</Field>

					<Field label="Assigned Terminal" required error={errors.assignedTerminal} touched={touched.assignedTerminal}>
						<select
							name="assignedTerminal" value={formData.assignedTerminal}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.assignedTerminal, touched.assignedTerminal)}
						>
							<option value="">Select terminal</option>
							{loading.terminals ? (
								<option disabled>Loading...</option>
							) : terminals.length > 0 ? (
								terminals.map((t) => (
									<option key={t.TerminalId || t.id} value={t.TerminalId || t.id}>
										{t.TerminalName || t.name || 'N/A'}
									</option>
								))
							) : (
								<option disabled>No terminals found</option>
							)}
						</select>
					</Field>

					<Field label="Expiration Date" required error={errors.expiredDate} touched={touched.expiredDate}>
						<input
							type="date" name="expiredDate" value={formData.expiredDate}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.expiredDate, touched.expiredDate)}
						/>
					</Field>

					<Field label="Insurance Expiration" error={errors.insuranceExpiration} touched={touched.insuranceExpiration}>
						<input
							type="date" name="insuranceExpiration" value={formData.insuranceExpiration}
							onChange={handleChange} onBlur={handleBlur}
							className={inputClass(errors.insuranceExpiration, touched.insuranceExpiration)}
						/>
					</Field>

					{/* Undercarriage Storage */}
					<div className="flex flex-col gap-2">
						<label className="text-sm font-bold text-black">
							Undercarriage Storage <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center gap-6 mt-1">
							{['yes', 'no'].map((opt) => (
								<label key={opt} className="flex items-center gap-2 cursor-pointer">
									<input
										type="radio" name="undercarriage" value={opt}
										checked={storageOption === opt}
										onChange={() => {
											setStorage(opt);
											setErrors((p) => ({ ...p, undercarriageStorage: '' }));
										}}
										className="h-4 w-4 accent-[#C01824]"
									/>
									<span className="text-sm capitalize">{opt}</span>
								</label>
							))}
						</div>
						{errors.undercarriageStorage && (
							<p className="text-red-500 text-xs">{errors.undercarriageStorage}</p>
						)}
					</div>
				</div>

				{/* Footer buttons */}
				<div className="flex items-center gap-3 px-6 pb-6">
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-10 py-2.5 bg-[#C01824] text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting
							? (isEditMode ? 'Updating...' : 'Submitting...')
							: (isEditMode ? 'Update Bus' : 'Submit')
						}
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

export default AddBusInfoForm;
