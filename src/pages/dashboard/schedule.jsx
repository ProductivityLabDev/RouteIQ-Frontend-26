import React, { useState, useEffect } from 'react';
import { Button, Tab, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { darksearchicon } from '@/assets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolRoutes, fetchSchoolStudents } from '@/redux/slices/schoolDashboardSlice';
import MapComponent from '@/components/MapComponent';

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
  const [searchQuery,     setSearchQuery]     = useState('');

  // Map
  const [mapMarkers,  setMapMarkers]  = useState([]);
  const [mapCenter,   setMapCenter]   = useState(undefined);
  const [mapCardInfo, setMapCardInfo] = useState({});
  const [showCard,    setShowCard]    = useState(false);

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

  // ── Select route → filter from Redux students ─────────────────────────────
  const handleSelectRoute = (route, allStudents) => {
    const pool = allStudents ?? students;
    setSelectedRoute(route);
    setSelectedStudent(null);
    setSearchQuery('');
    setShowCard(false);
    setMapMarkers([]);

    // Filter students linked to this route
    const list = pool.filter(s => {
      if (s.routeId != null && s.routeId === route.id) return true;
      if (s.busNo && (s.busNo === route.busName || s.busNo === route.busNumber)) return true;
      return false;
    });

    // Use filtered list, or fall back to all students
    const displayList = list.length > 0 ? list : pool;
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
  };

  // ── Click student → detail panel ──────────────────────────────────────────
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    const name     = `${student?.firstName ?? ''} ${student?.lastName ?? ''}`.trim() || 'Student';
    const pickup   = student?.pickupLocation ?? '';
    const emergency = student?.emergencyContact ?? '';

    setMapCardInfo({
      cardTitle:          name,
      scheduleText:       pickup,
      contactText:        emergency,
      destinationName:    '',
      destinationAddress: '',
      destinationLatLng:  null,
    });
    setShowCard(true);

    const lat = Number(student?.pickupLatitude ?? student?.PickupLatitude);
    const lng = Number(student?.pickupLongitude ?? student?.PickupLongitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) setMapCenter({ lat, lng });
  };

  const busNum = selectedRoute?.busName ?? selectedRoute?.busNumber ?? '--';

  const filtered = routeStudents.filter(s =>
    `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = activeTab === 'onboard'
    ? filtered.slice(0, Math.max(1, Math.ceil(filtered.length / 2)))
    : filtered;

  const selectedRouteId = selectedRoute?.id;

  return (
    <div className='mt-7' style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Route / Bus Tabs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 mb-3">
        {loading.routes ? (
          <span className="text-sm text-gray-400 px-2">Loading routes...</span>
        ) : routes.length === 0 ? (
          <span className="text-sm text-gray-400 px-2">No routes found</span>
        ) : (
          routes.map((route) => (
            <Button
              key={route.id}
              className={
                selectedRouteId === route.id
                  ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium'
                  : 'bg-white text-xs md:text-[14px] text-[#141516] capitalize font-medium border border-gray-200'
              }
              onClick={() => handleSelectRoute(route)}
            >
              {route.routeNumber || route.routeName || `Route ${route.id}`}
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
              {loading.students ? (
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
          <div style={{ position: 'absolute', left: '280px', top: 0, width: '370px', background: '#fff', boxShadow: '4px 0 12px rgba(0,0,0,0.15)', zIndex: 500, overflowY: 'auto', maxHeight: '100%', padding: '12px' }}>
            {(() => {
              const sName     = `${selectedStudent?.firstName ?? ''} ${selectedStudent?.lastName ?? ''}`.trim() || '--';
              const sEmergency = selectedStudent?.emergencyContact ?? '--';
              const sPickup   = selectedStudent?.pickupLocation ?? '--';
              const sDrop     = selectedStudent?.dropLocation ?? '';
              const sGrade    = selectedStudent?.grade ?? '';
              const sBusNo    = selectedStudent?.busNo ?? busNum;
              return (
                <>
                  <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-3 w-full">
                      <div className='rounded-full w-[60px] h-[60px] bg-[#C01824] flex items-center justify-center text-white font-bold text-[24px] flex-shrink-0'>
                        {sName.charAt(0).toUpperCase()}
                      </div>
                      <div className='leading-tight text-[#141516]'>
                        <h6 className="font-bold text-[18px]">{sName}</h6>
                        <p className="font-normal text-[14px]">Student</p>
                      </div>
                    </div>
                    <div className='bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center flex-shrink-0'>
                      <p className='text-[14px] font-normal'>BUS NO.</p>
                      <p className='text-[14px] font-bold'>{sBusNo}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-4 pt-3'>
                    <div className='text-[#141516]'>
                      <p className='text-[13px] font-medium'>Emergency Contact</p>
                      <p className='text-[14px] font-bold'>{sEmergency}</p>
                    </div>
                  </div>

                  {[
                    { label: 'Pickup Address', val: sPickup },
                    { label: 'Drop-off',       val: sDrop   },
                    { label: 'Grade',          val: sGrade  },
                  ].map(({ label, val }) =>
                    val ? (
                      <div key={label} className='text-black pt-2'>
                        <p className='text-[13px]'>{label}</p>
                        <p className='text-[14px] font-bold'>{val}</p>
                      </div>
                    ) : null
                  )}
                </>
              );
            })()}

            <button
              className='absolute top-2 right-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300'
              onClick={() => setSelectedStudent(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Right — Google Map */}
        <div style={{ flex: 1, minWidth: 0, minHeight: '400px', position: 'relative' }}>
          <MapComponent
            isRouteMap={false}
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
