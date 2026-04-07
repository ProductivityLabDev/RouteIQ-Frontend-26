import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { schoolDashboardService } from '@/services/schoolDashboardService';
import { routeSchedulingService } from '@/services/routeSchedulingService';
import { Toaster, toast } from 'react-hot-toast';

const TripBookingForm = ({ handleCancel, mode = "create", initialData = null, tripId = null, onSaved }) => {
  const [submitting, setSubmitting] = useState(false);
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    companyGroupName: '',
    phoneNumber: '',
    emailAddress: '',
    tripType: '',
    noOfBuses: '',
    noOfPassengers: '',
    wheelchairRequired: '',
    vehicleId: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    typeOfGroup: '',
    pickupLocation: '',
    name: '',
    pickupAddress: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    destinationLocation: '',
    destinationAddress: '',
    destinationCity: '',
    destinationState: '',
    destinationZip: '',
    instructions: '',
    howReferred: '',
    termsAccepted: false
  });

  useEffect(() => {
    schoolDashboardService.getBuses().then((res) => {
      setBuses(Array.isArray(res?.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !initialData) return;
    const start = initialData?.startTime || initialData?.StartTime || "";
    const end = initialData?.endTime || initialData?.EndTime || "";
    const toDate = (v) => {
      if (!v) return "";
      const raw = String(v).trim();
      if (!raw || raw === "-" || raw.toLowerCase() === "invalid date") return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    };
    const toTime = (v) => {
      if (!v) return "";
      const raw = String(v).trim();
      if (!raw || raw === "-" || raw.toLowerCase() === "invalid date") return "";
      if (/^\d{1,2}:\d{2}$/.test(raw)) {
        const [h, m] = raw.split(":");
        return `${String(Number(h)).padStart(2, "0")}:${m}`;
      }
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(11, 16);
    };

    setFormData((prev) => ({
      ...prev,
      companyGroupName:
        initialData?.companyName ||
        initialData?.CompanyName ||
        initialData?.tripName ||
        initialData?.TripName ||
        prev.companyGroupName,
      phoneNumber: initialData?.phoneNumber || initialData?.PhoneNumber || prev.phoneNumber,
      emailAddress: initialData?.emailAddress || initialData?.EmailAddress || prev.emailAddress,
      tripType: initialData?.tripType || initialData?.TripType || prev.tripType,
      noOfBuses: initialData?.noOfBuses ?? initialData?.NoOfBuses ?? prev.noOfBuses,
      noOfPassengers:
        initialData?.noOfPersons ??
        initialData?.NoOfPersons ??
        initialData?.numberOfPersons ??
        prev.noOfPassengers,
      wheelchairRequired: initialData?.wheelchairLiftRequired ?? initialData?.WheelchairLiftRequired ?? prev.wheelchairRequired,
      vehicleId: initialData?.vehicleId ?? initialData?.VehicleId ?? prev.vehicleId,
      pickupDate: toDate(start),
      pickupTime: toTime(start),
      returnDate: toDate(end),
      returnTime: toTime(end),
      typeOfGroup: initialData?.groupType || initialData?.GroupType || prev.typeOfGroup,
      pickupLocation:
        initialData?.pickupLocation ||
        initialData?.PickupLocation ||
        initialData?.pickup ||
        initialData?.Pickup ||
        prev.pickupLocation,
      name:
        initialData?.busName ||
        initialData?.BusName ||
        initialData?.busNo ||
        initialData?.BusNumber ||
        prev.name,
      pickupAddress:
        initialData?.pickupAddress ||
        initialData?.PickupAddress ||
        initialData?.pickup ||
        initialData?.Pickup ||
        prev.pickupAddress,
      pickupCity: initialData?.pickupCity || initialData?.PickupCity || prev.pickupCity,
      pickupState: initialData?.pickupState || initialData?.PickupState || prev.pickupState,
      pickupZip: initialData?.pickupZip || initialData?.PickupZip || prev.pickupZip,
      destinationLocation:
        initialData?.dropoffLocation ||
        initialData?.DropoffLocation ||
        initialData?.dropoff ||
        initialData?.Dropoff ||
        prev.destinationLocation,
      destinationAddress:
        initialData?.dropoffAddress ||
        initialData?.DropoffAddress ||
        initialData?.dropoff ||
        initialData?.Dropoff ||
        prev.destinationAddress,
      destinationCity: initialData?.destinationCity || initialData?.DestinationCity || prev.destinationCity,
      destinationState: initialData?.destinationState || initialData?.DestinationState || prev.destinationState,
      destinationZip: initialData?.destinationZip || initialData?.DestinationZip || prev.destinationZip,
      instructions: initialData?.specialInstructions || initialData?.SpecialInstructions || prev.instructions,
      howReferred: initialData?.referralSource || initialData?.ReferralSource || prev.howReferred,
    }));
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toISO = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const date = dateStr;
    const time = timeStr || '00:00';
    return new Date(`${date}T${time}:00.000Z`).toISOString();
  };

  const num = (v) => {
    if (v === '' || v == null) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const str = (v) => (v != null && String(v).trim() !== '' ? String(v).trim() : undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = toISO(formData.pickupDate, formData.pickupTime);
    const pickupLocation = str(formData.pickupLocation);
    const dropoffLocation = str(formData.destinationLocation);
    if (!startTime || !pickupLocation || !dropoffLocation) {
      toast.error('Pickup date/time, Pickup Location and Destination Location are required.');
      return;
    }
    const dto = {
      tripName: str(formData.companyGroupName) || str(formData.name) || 'School Trip',
      startTime,
      pickupLocation,
      dropoffLocation,
      ...(str(formData.pickupAddress) && { pickupAddress: formData.pickupAddress }),
      ...(str(formData.destinationAddress) && { dropoffAddress: formData.destinationAddress }),
      ...(num(formData.noOfPassengers) != null && { noOfPersons: num(formData.noOfPassengers) }),
      ...(str(formData.instructions) && { specialInstructions: formData.instructions }),
    };
    setSubmitting(true);
    try {
      if (mode === "edit" && tripId) {
        const updateDto = {
          companyName: str(formData.companyGroupName),
          phoneNumber: str(formData.phoneNumber),
          emailAddress: str(formData.emailAddress),
          tripType: str(formData.tripType),
          noOfBuses: num(formData.noOfBuses),
          noOfPersons: num(formData.noOfPassengers),
          wheelchairLiftRequired: num(formData.wheelchairRequired),
          busType: undefined,
          startTime,
          endTime: toISO(formData.returnDate, formData.returnTime) || undefined,
          groupType: str(formData.typeOfGroup),
          busName: str(formData.name),
          pickupLocation,
          pickupAddress: str(formData.pickupAddress),
          pickupCity: str(formData.pickupCity),
          pickupState: str(formData.pickupState),
          pickupZip: str(formData.pickupZip),
          dropoffLocation,
          dropoffAddress: str(formData.destinationAddress),
          destinationCity: str(formData.destinationCity),
          destinationState: str(formData.destinationState),
          destinationZip: str(formData.destinationZip),
          specialInstructions: str(formData.instructions),
          referralSource: str(formData.howReferred),
          vehicleId: num(formData.vehicleId),
        };
        await routeSchedulingService.updateTrip(tripId, updateDto);
        toast.success("Trip updated successfully.");
      } else {
        const res = await schoolDashboardService.createTrip(dto);
        const tripNumber = res?.data?.data?.tripNumber ?? res?.data?.tripNumber;
        toast.success(tripNumber ? `Trip created: ${tripNumber}` : 'Trip created successfully.');
      }
      if (typeof onSaved === "function") onSaved();
      handleCancel();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      const msgStr = Array.isArray(msg) ? msg.join(', ') : msg;
      if (status === 403) {
        toast.error(msgStr || 'No terminal access.');
      } else if (status === 400) {
        toast.error(msgStr || 'Invalid data. Check required fields.');
      } else {
        toast.error(msgStr || 'Failed to create trip.');
      }
    } finally {
      setSubmitting(false);
    }
  };

 

  return (
    <>
    <div className="p-6 w-[100%]">
        {/* Header */}
        <div className="flex justify-between items-center  border-b border-gray-200">
              <h1 className="text-[32px] font-bold text-[#202224]">{mode === "edit" ? "Edit Trip" : "Create Trip"}</h1>
          <select className="bg-[#F5F6FA] w-[25%] border border-[#ABABAB] rounded px-3 py-3 text-sm">
            <option>Copy Trip #</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow-sm mt-8">
        <form onSubmit={handleSubmit} className="p-6 w-[100%]">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Company/Group Name
              </label>
              <input
                type="text"
                name="companyGroupName"
                value={formData.companyGroupName}
                onChange={handleInputChange}
                placeholder="Enter pickup location"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Trip Type
              </label>
              <select
                name="tripType"
                value={formData.tripType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select trip type</option>
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
                <option value="multi-day">Multi Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                No. Of Buses
              </label>
              <input
                type="number"
                name="noOfBuses"
                value={formData.noOfBuses}
                onChange={handleInputChange}
                placeholder="Enter number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                No. of Passenger
              </label>
              <input
                type="number"
                name="noOfPassengers"
                value={formData.noOfPassengers}
                onChange={handleInputChange}
                placeholder="Enter no of peoples"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Is a Wheelchair lift required?
              </label>
              <input
                type="text"
                name="wheelchairRequired"
                value={formData.wheelchairRequired}
                onChange={handleInputChange}
                placeholder="Enter no of persons"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Select Bus <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a bus</option>
                {buses.map((bus, idx) => (
                  <option
                    key={`${bus.id ?? "bus"}-${bus.numberPlate ?? bus.name ?? "unknown"}-${idx}`}
                    value={bus.id}
                  >
                    {bus.numberPlate ?? bus.name} {bus.name && bus.numberPlate ? `(${bus.name})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                placeholder="Enter no of persons"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Time
              </label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                placeholder="Enter time"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                placeholder="Enter date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Return Time
              </label>
              <input
                type="time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleInputChange}
                placeholder="Enter bus no"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Type of Group
              </label>
              <select
                name="typeOfGroup"
                value={formData.typeOfGroup}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="corporate">Corporate</option>
                <option value="school">School</option>
                <option value="tour">Tour Group</option>
                <option value="wedding">Wedding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Select location"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MapPin className="absolute right-2 top-2.5 h-4 w-4 text-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter bus no"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Address
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup City
              </label>
              <input
                type="text"
                name="pickupCity"
                value={formData.pickupCity}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup State
              </label>
              <input
                type="text"
                name="pickupState"
                value={formData.pickupState}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pickup Zip
              </label>
              <input
                type="text"
                name="pickupZip"
                value={formData.pickupZip}
                onChange={handleInputChange}
                placeholder="Enter zip"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Destination Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="destinationLocation"
                  value={formData.destinationLocation}
                  onChange={handleInputChange}
                  placeholder="Select location"
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MapPin className="absolute right-2 top-2.5 h-4 w-4 text-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Destination Address
              </label>
              <input
                type="text"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleInputChange}
                placeholder="Enter address"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 8 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Destination City
              </label>
              <input
                type="text"
                name="destinationCity"
                value={formData.destinationCity}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Destination State
              </label>
              <input
                type="text"
                name="destinationState"
                value={formData.destinationState}
                onChange={handleInputChange}
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Destination Zip
              </label>
              <input
                type="text"
                name="destinationZip"
                value={formData.destinationZip}
                onChange={handleInputChange}
                placeholder="Enter zip"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 9 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Note/Special instruction
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Enter instruction"
                rows="3"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                How were you referred to us?
              </label>
              <select
                name="howReferred"
                value={formData.howReferred}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="google">Google Search</option>
                <option value="referral">Referral</option>
                <option value="advertisement">Advertisement</option>
                <option value="social-media">Social Media</option>
                <option value="other">Other</option>
              </select>
              <div className="mt-2">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Terms and Condition
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? (mode === "edit" ? "Updating..." : "Creating...") : (mode === "edit" ? "Update" : "Submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 4000 }} />
    </>
  );
}

export default TripBookingForm;