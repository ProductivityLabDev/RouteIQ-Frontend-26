import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { darksearchicon } from '@/assets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolRoutes, fetchSchoolStudents } from '@/redux/slices/schoolDashboardSlice';
import MapComponent from '@/components/MapComponent';
import { apiClient } from '@/configs/api';

const tabsData = [
  { label: "All Students", value: "allstudents" },
  { label: "On Board",     value: "onboard"     },
];

export function Schedule() {
  const dispatch = useDispatch();
  const { routes, students, loading } = useSelector((s) => s.schoolDashboard);

  const [selectedRoute,   setSelectedRoute]   = useState(null);
  const [activeTab,       setActiveTab]       = useState("allstudents");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [routeStudents,   setRouteStudents]   = useState([]);
  const [routeStudentsLoading, setRouteStudentsLoading] = useState(false);
  const [searchQuery,     setSearchQuery]     = useState('');

  // Map
  const [mapMarkers,  setMapMarkers]  = useState([]);
  const [mapCenter,   setMapCenter]   = useState(undefined);
  const [mapCardInfo, setMapCardInfo] = useState({});
  const [showCard,    setShowCard]    = useState(false);
  const [isRouteMap,  setIsRouteMap]  = useState(false);

  useEffect(() => {
    dispatch(fetchSchoolRoutes());
    dispatch(fetchSchoolStudents());
  }, [dispatch]);

  // Auto-select first route once both routes & students are loaded
  useEffect(() => {
    if (routes.length > 0 && !loading.routes && !loading.students && !selectedRoute) {
      handleSelectRoute(routes[0], students);
    }
  }, [routes, students, loading.routes, loading.students]);

  const getRouteId = (route) =>
    route?.RouteId ??
    route?.routeId ??
    route?.routeID ??
    route?.RouteID ??
    route?.id ??
    null;

  const getRouteIdCandidates = (route) => {
    const candidates = [
      route?.RouteId,
      route?.routeId,
      route?.routeID,
      route?.RouteID,
      route?.id,
    ]
      .map((v) => (v == null || v === "" ? null : Number(v)))
      .filter((v) => Number.isFinite(v));
    return [...new Set(candidates)];
  };

  // ── Select route → filter from Redux students ─────────────────────────────
  const handleSelectRoute = async (route, allStudents) => {
    const pool = allStudents ?? students;
    const routeId = getRouteId(route);
    const routeIdCandidates = getRouteIdCandidates(route);
    setSelectedRoute(route);
    setSelectedStudent(null);
    setSearchQuery('');
    setShowCard(false);
    setIsRouteMap(false);
    setMapMarkers([]);
    setRouteStudentsLoading(true);

    let displayList = [];
    try {
      // Prefer route-specific endpoint to avoid client-side mismatches.
      if (routeIdCandidates.length > 0) {
        for (const candidateId of routeIdCandidates) {
          const response = await apiClient.get(`/route-scheduling/routes/${candidateId}/students`);
          const apiList = Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response?.data)
            ? response.data
            : [];
          if (Array.isArray(apiList) && apiList.length > 0) {
            displayList = apiList;
            break;
          }
          // If no records for this candidate, keep probing next id variant.
          if (!displayList.length) displayList = apiList;
        }
      }
    } catch (error) {
      console.error("Failed to fetch selected route students:", error);
    }

    // Fallback: local filter if endpoint fails/empty.
    if (!Array.isArray(displayList) || displayList.length === 0) {
      const routeBusCandidates = [
        route?.busNo,
        route?.BusNo,
        route?.busName,
        route?.BusName,
        route?.busNumber,
        route?.BusNumber,
      ]
        .filter(Boolean)
        .map((v) => String(v).trim().toLowerCase());

      const list = (pool || []).filter((s) => {
        const sRouteId = s?.routeId ?? s?.RouteId ?? s?.routeID ?? null;
        if (routeId != null && sRouteId != null && Number(sRouteId) === Number(routeId)) return true;

        const sBus = String(
          s?.busNo ?? s?.BusNo ?? s?.busNumberAM ?? s?.busNumberPM ?? s?.busNumber ?? ""
        )
          .trim()
          .toLowerCase();
        if (sBus && routeBusCandidates.includes(sBus)) return true;

        return false;
      });
      displayList = list;
    }

    setRouteStudents(displayList);

    // Build markers from the SAME list that is displayed
    const markers = displayList.flatMap((s, idx) => {
      // Try all possible lat/lng field name variations from the backend
      const lat = Number(
        s?.pickupLat ?? s?.pickupLatitude ?? s?.PickupLatitude ?? s?.PickupLat ??
        s?.latitude ?? s?.lat ?? s?.Latitude ?? s?.Lat
      );
      const lng = Number(
        s?.pickupLng ?? s?.pickupLongitude ?? s?.PickupLongitude ?? s?.PickupLng ??
        s?.longitude ?? s?.lng ?? s?.Longitude ?? s?.Lng
      );
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
      const name = `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.trim() || `Student ${idx + 1}`;
      return [{ id: `s-${s.id ?? idx}`, type: 'student', title: name, position: { lat, lng } }];
    });
    setMapMarkers(markers);
    if (markers.length > 0) {
      const sum = markers.reduce((a, m) => ({ lat: a.lat + m.position.lat, lng: a.lng + m.position.lng }), { lat: 0, lng: 0 });
      setMapCenter({ lat: sum.lat / markers.length, lng: sum.lng / markers.length });
    }
    setRouteStudentsLoading(false);
  };

  // ── Click student → detail panel ──────────────────────────────────────────
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    const name     = `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || 'Student';
    const routeDropoff =
      selectedRoute?.dropoffLocation ??
      selectedRoute?.DropoffLocation ??
      selectedRoute?.dropLocation ??
      '';
    const pickupAddress =
      student?.pickupAddress ??
      student?.PickupAddress ??
      student?.pickupLocation ??
      student?.PickupLocation ??
      student?.address ??
      '';
    const dropAddress =
      student?.dropoffAddress ??
      student?.DropoffAddress ??
      student?.dropoffLocation ??
      student?.DropoffLocation ??
      student?.dropLocation ??
      student?.DropLocation ??
      routeDropoff ??
      '';
    const emergency = student?.emergencyContact ?? '';
    const scheduleText = [
      student?.grade ? `Grade ${student.grade}` : "",
      student?.busNumberAM ? `AM ${student.busNumberAM}` : "",
      student?.busNumberPM ? `PM ${student.busNumberPM}` : "",
    ].filter(Boolean).join(" • ");

    setMapCardInfo({
      cardTitle:          name,
      scheduleText:       scheduleText || pickupAddress || "Student schedule",
      contactText:        emergency,
      destinationName:    dropAddress ? 'Drop-off' : '',
      destinationAddress: dropAddress || '',
      destinationLatLng:  null,
    });
    setShowCard(true);

    const pickupLat = Number(student?.pickupLatitude ?? student?.PickupLatitude ?? student?.pickupLat);
    const pickupLng = Number(student?.pickupLongitude ?? student?.PickupLongitude ?? student?.pickupLng);
    const dropLat = Number(student?.dropLatitude ?? student?.DropLatitude ?? student?.dropLat);
    const dropLng = Number(student?.dropLongitude ?? student?.DropLongitude ?? student?.dropLng);

    const markers = [];
    if (Number.isFinite(pickupLat) && Number.isFinite(pickupLng)) {
      markers.push({
        id: `pickup-${student?.id ?? "student"}`,
        type: "pickup",
        stopRole: "start",
        order: 1,
        title: `${name} (Pickup)`,
        position: { lat: pickupLat, lng: pickupLng },
      });
    }
    if (Number.isFinite(dropLat) && Number.isFinite(dropLng)) {
      markers.push({
        id: `dropoff-${student?.id ?? "student"}`,
        type: "dropoff",
        stopRole: "end",
        order: 2,
        title: `${name} (Drop-off)`,
        position: { lat: dropLat, lng: dropLng },
      });
      setMapCardInfo((prev) => ({
        ...prev,
        destinationLatLng: { lat: dropLat, lng: dropLng },
      }));
    }

    setMapMarkers(markers);
    setIsRouteMap(markers.length >= 2);

    if (markers.length > 0) {
      const sum = markers.reduce(
        (acc, m) => ({ lat: acc.lat + m.position.lat, lng: acc.lng + m.position.lng }),
        { lat: 0, lng: 0 }
      );
      setMapCenter({ lat: sum.lat / markers.length, lng: sum.lng / markers.length });
    }
  };

  const busNum = selectedRoute?.busName ?? selectedRoute?.busNumber ?? '--';

  const filtered = routeStudents.filter(s =>
    `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = activeTab === 'onboard'
    ? filtered.filter((s) => {
        const status = String(s?.attendanceStatus ?? s?.status ?? '').toLowerCase();
        return status === 'present' || status === 'onboard' || status === 'on board';
      })
    : filtered;

  const selectedRouteId = getRouteId(selectedRoute);

  return (
    <div className='mt-7' style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Route / Bus Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 mb-3">
        {loading.routes ? (
          <span className="text-sm text-gray-400 px-2">Loading routes...</span>
        ) : routes.length === 0 ? (
          <span className="text-sm text-gray-400 px-2">No routes found</span>
        ) : (
          routes.map((route, idx) => (
            <Button
              key={getRouteId(route) ?? idx}
              className={
                selectedRouteId === getRouteId(route)
                  ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium'
                  : 'bg-white text-xs md:text-[14px] text-[#141516] capitalize font-medium border border-gray-200'
              }
              onClick={() => handleSelectRoute(route)}
            >
              {route.routeNumber || route.routeName || `Route ${getRouteId(route) ?? idx + 1}`}
            </Button>
          ))
        )}
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0, border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>

        {/* Left — Student List */}
        <div style={{ width: '280px', flexShrink: 0, background: '#fff', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Tabs value={activeTab}>
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
              indicatorProps={{ className: "bg-transparent border-b-2 border-[#C01824] shadow-none rounded-none" }}
            >
              {tabsData.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "font-bold text-[#C01824]" : ""}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>

            <div className="relative flex items-center">
              <img src={darksearchicon} alt='' className="absolute left-3 h-4 w-4" />
              <input
                className="bg-[#D2D2D2]/30 w-full pl-10 p-3 outline-none border-0"
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <TabsBody className='pt-2'>
              {(loading.students || routeStudentsLoading) ? (
                <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
              ) : displayed.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">
                  {selectedRoute ? 'No students on this route' : 'Select a route'}
                </p>
              ) : (
                displayed.map((student, index) => {
                  const name = `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || `Student ${index + 1}`;
                  const isSelected = selectedStudent?.id === student?.id;
                  return (
                    <div key={student?.id ?? index}>
                      <Button
                        variant='gradient'
                        className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${
                          isSelected ? 'bg-black text-white' : 'bg-none hover:bg-black group'
                        }`}
                        onClick={() => handleStudentClick(student)}
                      >
                        <div className={`rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold text-[18px] text-white flex-shrink-0 ${
                          isSelected ? 'bg-gray-600' : 'bg-[#C01824]'
                        }`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`text-start ${isSelected ? 'text-white' : 'text-[#2C2F32] group-hover:text-white'}`}>
                          <h6 className="font-bold text-[16px] capitalize">{name}</h6>
                          <p className="font-light text-[14px]">Bus NO. <span className='font-bold'>{busNum}</span></p>
                        </div>
                      </Button>
                      <hr className="h-px bg-gray-200" />
                    </div>
                  );
                })
              )}
            </TabsBody>
          </Tabs>
        </div>

        {/* Middle — Student Detail Panel (absolute overlay) */}
        {selectedStudent && (
          <div style={{ position: 'absolute', left: '292px', top: 12, width: '390px', zIndex: 500 }}>
            <div className="relative max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl">
            {(() => {
              const sName     = `${selectedStudent?.firstName ?? ''} ${selectedStudent?.lastName ?? ''}`.trim() || '--';
              const sEmergency = selectedStudent?.emergencyContact ?? '--';
              const sPickup   =
                selectedStudent?.pickupAddress ??
                selectedStudent?.PickupAddress ??
                selectedStudent?.pickupLocation ??
                selectedStudent?.PickupLocation ??
                selectedStudent?.address ??
                '--';
              const sDrop     =
                selectedStudent?.dropoffAddress ??
                selectedStudent?.DropoffAddress ??
                selectedStudent?.dropoffLocation ??
                selectedStudent?.DropoffLocation ??
                selectedStudent?.dropLocation ??
                selectedStudent?.DropLocation ??
                selectedRoute?.dropoffLocation ??
                selectedRoute?.DropoffLocation ??
                '--';
              const sGrade    = selectedStudent?.grade ?? '';
              const sBusNo    = selectedStudent?.busNo ?? busNum;
              const sEnroll   = selectedStudent?.enrollmentNo ?? selectedStudent?.enrollmentNumber ?? '--';
              const sAttendance = selectedStudent?.attendanceStatus ?? '--';
              const sDriver   = selectedStudent?.driverName ?? '--';
              const sBusAm    = selectedStudent?.busNumberAM ?? '--';
              const sBusPm    = selectedStudent?.busNumberPM ?? '--';
              const sNotes    = selectedStudent?.notes ?? '--';
              return (
                <>
                  <div className='flex items-start justify-between gap-3 border-b border-gray-100 px-4 pt-4 pb-3'>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className='rounded-full w-[56px] h-[56px] bg-[#C01824] flex items-center justify-center text-white font-bold text-[22px] flex-shrink-0'>
                        {sName.charAt(0).toUpperCase()}
                      </div>
                      <div className='leading-tight text-[#141516] min-w-0'>
                        <h6 className="font-bold text-[24px] truncate">{sName}</h6>
                        <p className="font-medium text-[14px] text-gray-600">Student</p>
                      </div>
                    </div>
                    <div className='bg-[#F3F4F6] text-[#141516] leading-tight rounded-md px-3 py-1.5 text-center flex-shrink-0'>
                      <p className='text-[11px] font-semibold text-gray-500 uppercase tracking-wide'>Bus No</p>
                      <p className='text-[14px] font-bold'>{sBusNo}</p>
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-2 px-4 pt-3'>
                    <div className='rounded-lg bg-[#F9FAFB] border border-gray-100 px-2 py-2'>
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>Emergency</p>
                      <p className='text-[13px] font-bold text-[#141516] break-words'>{sEmergency}</p>
                    </div>
                    <div className='rounded-lg bg-[#F9FAFB] border border-gray-100 px-2 py-2'>
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>Enrollment</p>
                      <p className='text-[13px] font-bold text-[#141516] break-words'>{sEnroll}</p>
                    </div>
                    <div className='rounded-lg bg-[#F9FAFB] border border-gray-100 px-2 py-2'>
                      <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>Attendance</p>
                      <p className='text-[13px] font-bold text-[#141516]'>{sAttendance}</p>
                    </div>
                  </div>

                  <div className="px-4 pt-3 pb-4">
                  {[
                    { label: 'Pickup Address', val: sPickup },
                    { label: 'Drop-off',       val: sDrop   },
                    { label: 'Grade',          val: sGrade  },
                    { label: 'Driver Name',    val: sDriver },
                    { label: 'Bus # AM',       val: sBusAm  },
                    { label: 'Bus # PM',       val: sBusPm  },
                    { label: 'Notes',          val: sNotes  },
                  ].map(({ label, val }) =>
                    val ? (
                      <div key={label} className='pt-2'>
                        <p className='text-[11px] font-semibold uppercase tracking-wide text-gray-500'>{label}</p>
                        <p className='text-[14px] font-bold text-[#141516] break-words'>{val}</p>
                      </div>
                    ) : null
                  )}
                  </div>
                </>
              );
            })()}

            <button
              className='absolute top-3 right-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200'
              onClick={() => {
                setSelectedStudent(null);
                setShowCard(false);
                setIsRouteMap(false);
                if (selectedRoute) handleSelectRoute(selectedRoute);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          </div>
        )}

        {/* Right — Google Map */}
        <div style={{ flex: 1, minWidth: 0, minHeight: '400px', position: 'relative' }}>
          <MapComponent
            isRouteMap={isRouteMap}
            showCard={showCard}
            closeCard={() => setShowCard(false)}
            markers={mapMarkers}
            center={mapCenter}
            cardTitle={mapCardInfo.cardTitle}
            scheduleText={mapCardInfo.scheduleText}
            contactText={mapCardInfo.contactText}
            destinationName={mapCardInfo.destinationName}
            destinationAddress={mapCardInfo.destinationAddress}
            destinationLatLng={mapCardInfo.destinationLatLng}
          />
        </div>
      </div>
    </div>
  );
}

export default Schedule;
