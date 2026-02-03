import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import { tripDetails, tripStages } from '@/data';
import { ButtonGroup, Tab, Tabs, TabsBody, TabsHeader, Button, Spinner } from '@material-tailwind/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchTerminals, fetchSchoolManagementSummary } from '@/redux/slices/schoolSlice';
import { fetchStudentsByInstitute, clearStudents } from '@/redux/slices/studentSlice';
import trackingService from '@/services/trackingService';
import { toast } from 'react-hot-toast';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const tabsData = [
  { label: 'All Students', value: 'allstudents' },
  { label: 'On Board', value: 'onboard' },
];

const RealTimeTracking = () => {
  const dispatch = useAppDispatch();
  const { terminals, schoolManagementSummary, loading } = useAppSelector((state) => state.schools);
  const { students, loading: studentsLoading } = useAppSelector((state) => state.students);

  const [selectedTab, setSelectedTab] = useState(null); // terminalId
  const [selectedInfo, setSelectedInfo] = useState('Track School');
  const [activeTab, setActiveTab] = useState('allstudents');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSchoolTab, setSelectedSchoolTab] = useState(true);

  // API data state
  const [terminalVehicles, setTerminalVehicles] = useState([]);
  const [schoolVehicles, setSchoolVehicles] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [studentsOnBoard, setStudentsOnBoard] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [map, setMap] = useState(null);

  // Google Maps API Loader
  const GOOGLE_LIBRARIES = ['places'];
  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_LIBRARIES,
  });

  const defaultCenter = { lat: 41.8781, lng: -87.6298 }; // Chicago default
  const defaultZoom = 12;

  // ---------- MARKERS ----------
  const mapMarkers = useMemo(() => {
    const markers = [];

    // Terminal vehicles markers
    if (selectedTab && terminalVehicles.length > 0) {
      terminalVehicles.forEach((vehicle) => {
        if (vehicle.currentLocation?.latitude && vehicle.currentLocation?.longitude) {
          markers.push({
            id: `vehicle-${vehicle.vehicleId}`,
            position: {
              lat: vehicle.currentLocation.latitude,
              lng: vehicle.currentLocation.longitude,
            },
            title: `${vehicle.vehicleName} - ${vehicle.numberPlate}`,
            type: 'vehicle',
          });
        }
      });
    }

    // School vehicles markers
    if (selectedSchool?.instituteId && schoolVehicles.length > 0) {
      schoolVehicles.forEach((vehicle) => {
        if (vehicle.currentLocation?.latitude && vehicle.currentLocation?.longitude) {
          markers.push({
            id: `school-vehicle-${vehicle.vehicleId}`,
            position: {
              lat: vehicle.currentLocation.latitude,
              lng: vehicle.currentLocation.longitude,
            },
            title: `${vehicle.vehicleName} - ${vehicle.numberPlate}`,
            type: 'vehicle',
          });
        }
      });
    }

    // Active drivers markers
    if (selectedInfo === 'Track Drivers' && activeDrivers.length > 0) {
      activeDrivers.forEach((driver) => {
        if (driver.currentLocation?.latitude && driver.currentLocation?.longitude) {
          markers.push({
            id: `driver-${driver.driverId}`,
            position: {
              lat: driver.currentLocation.latitude,
              lng: driver.currentLocation.longitude,
            },
            title: `${driver.name} - ${driver.busNo}`,
            type: 'driver',
          });
        }
      });
    }

    return markers;
  }, [terminalVehicles, schoolVehicles, activeDrivers, selectedTab, selectedSchool, selectedInfo]);

  const mapCenter = useMemo(() => {
    if (mapMarkers.length === 0) return defaultCenter;
    if (mapMarkers.length === 1) return mapMarkers[0].position;

    const avgLat = mapMarkers.reduce((sum, m) => sum + m.position.lat, 0) / mapMarkers.length;
    const avgLng = mapMarkers.reduce((sum, m) => sum + m.position.lng, 0) / mapMarkers.length;
    return { lat: avgLat, lng: avgLng };
  }, [mapMarkers]);

  const onMapLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      if (mapMarkers.length > 0 && window.google?.maps?.LatLngBounds) {
        const bounds = new window.google.maps.LatLngBounds();
        mapMarkers.forEach((m) => bounds.extend(m.position));
        mapInstance.fitBounds(bounds);
      }
    },
    [mapMarkers]
  );

  const onMapUnmount = useCallback(() => setMap(null), []);

  // ---------- MOUNT ----------
  useEffect(() => {
    dispatch(fetchTerminals());
    dispatch(fetchSchoolManagementSummary());
  }, [dispatch]);

  // ---------- FETCH TERMINAL VEHICLES ----------
  useEffect(() => {
    if (selectedInfo === 'Track School' && selectedTab) {
      fetchTerminalVehicles(selectedTab);
    }
  }, [selectedTab, selectedInfo]);

  // ---------- DRIVERS MODE ----------
  useEffect(() => {
    if (selectedInfo === 'Track Drivers') {
      fetchActiveDrivers();
    } else {
      // leave drivers mode => clear drivers data
      setActiveDrivers([]);
      setLoadingDrivers(false);
    }
  }, [selectedInfo]);

  // ---------- SCHOOL SELECTED ----------
  useEffect(() => {
    if (selectedInfo === 'Track School' && selectedSchool?.instituteId) {
      dispatch(clearStudents());
      fetchSchoolVehicles(selectedSchool.instituteId);
      dispatch(fetchStudentsByInstitute(selectedSchool.instituteId));
    }
  }, [selectedSchool, selectedInfo, dispatch]);

  // ---------- ROUTE SELECTED (ONBOARD) ----------
  useEffect(() => {
    if (selectedRouteId && activeTab === 'onboard') {
      fetchStudentsOnBoard(selectedRouteId);
    }
  }, [selectedRouteId, activeTab]);

  // ---------- FIT BOUNDS ----------
  useEffect(() => {
    if (map && mapMarkers.length > 0 && window.google?.maps?.LatLngBounds) {
      const bounds = new window.google.maps.LatLngBounds();
      mapMarkers.forEach((m) => bounds.extend(m.position));
      map.fitBounds(bounds);
    }
  }, [map, mapMarkers]);

  // ---------- API CALLS ----------
  const fetchTerminalVehicles = async (terminalId) => {
    try {
      setLoadingVehicles(true);
      const response = await trackingService.getTerminalVehicles(terminalId);
      if (response.ok && response.data) {
        setTerminalVehicles(response.data);
      } else {
        toast.error('Failed to fetch terminal vehicles');
      }
    } catch (error) {
      console.error('Error fetching terminal vehicles:', error);
      toast.error('Error loading terminal vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchSchoolVehicles = async (schoolId) => {
    try {
      setLoadingVehicles(true);
      const response = await trackingService.getSchoolVehicles(schoolId);
      if (response.ok && response.data) {
        setSchoolVehicles(response.data);
      } else {
        toast.error('Failed to fetch school vehicles');
      }
    } catch (error) {
      console.error('Error fetching school vehicles:', error);
      toast.error('Error loading school vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchActiveDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const response = await trackingService.getActiveVehicles();
      if (response.ok && response.data) {
        const driversList = response.data.map((vehicle) => ({
          name: vehicle.driverName || 'Unknown Driver',
          busNo: vehicle.numberPlate || vehicle.vehicleName,
          imgSrc: '',
          role: 'driver',
          driverId: vehicle.driverId,
          vehicleId: vehicle.vehicleId,
          vehicleName: vehicle.vehicleName,
          currentLocation: vehicle.currentLocation,
          routeId: vehicle.routeId,
          routeName: vehicle.routeName,
        }));
        setActiveDrivers(driversList);
      } else {
        toast.error('Failed to fetch active drivers');
      }
    } catch (error) {
      console.error('Error fetching active drivers:', error);
      toast.error('Error loading drivers');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const fetchStudentsOnBoard = async (routeId) => {
    try {
      setLoadingStudents(true);
      const response = await trackingService.getStudentsOnBoard(routeId, 'AM');
      if (response.ok && response.data) {
        setStudentsOnBoard(response.data.studentsOnBoard || []);
      } else {
        toast.error('Failed to fetch students on board');
      }
    } catch (error) {
      console.error('Error fetching students on board:', error);
      toast.error('Error loading students');
    } finally {
      setLoadingStudents(false);
    }
  };

  // ---------- UI ACTIONS ----------
  const toggleStudentPanel = (studentOrDriver) => {
    setSelectedStudent(studentOrDriver);
    if (studentOrDriver?.routeId) setSelectedRouteId(studentOrDriver.routeId);
  };

  // ✅ School select => terminal auto-select + (polish) terminal vehicles sync
  const toggleSchoolPanel = (school) => {
    setSelectedSchool(school);
    setSelectedSchoolTab(false);
    setActiveTab('allstudents');

    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);

    // Auto select terminal
    const tId = school?.terminalId ?? null;
    if (tId) {
      setSelectedTab(tId);

      // polish: keep terminal vehicles in sync
      if (selectedInfo === 'Track School') {
        fetchTerminalVehicles(tId);
      }
    }
  };

  const handleClosePanel = () => {
    setSelectedStudent(null);
    setSelectedRouteId(null);
  };

  // ---------- STUDENTS LIST ----------
  const filterStudents = () => {
    if (selectedInfo !== 'Track School') return [];

    if (activeTab === 'onboard') {
      return studentsOnBoard.map((student) => ({
        name: student.studentName,
        busNo: 'N/A',
        imgSrc: '',
        studentId: student.studentId,
        pickupLocation: student.pickupLocation,
        dropoffLocation: student.dropoffLocation,
        status: student.status,
      }));
    }

    if (activeTab === 'allstudents' && selectedSchool?.instituteId) {
      const allStudents = students || [];
      return allStudents
        .filter((item) => !!(item.id || item.StudentId || item.studentId))
        .map((student) => {
          const firstName = student.firstName || student.FirstName || student.first_name || '';
          const lastName = student.lastName || student.LastName || student.last_name || '';
          const fullName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : student.name ||
                student.Name ||
                student.studentName ||
                student.StudentName ||
                `Student ${student.id || student.StudentId || student.studentId || ''}`;

          return {
            name: fullName,
            busNo: student.busNo || student.BusNo || student.busNumber || 'N/A',
            imgSrc: '',
            studentId: student.id || student.StudentId || student.studentId,
            pickupLocation: student.pickupLocation || student.PickupLocation || '',
            dropoffLocation: student.dropLocation || student.DropLocation || student.dropoffLocation || '',
            status: student.status || 'Active',
          };
        });
    }

    return [];
  };

  // ✅ Main fix: tab switch pe hard reset (mix + stale list khatam)
  const handleSelectedTabInfo = (tab) => {
    setSelectedInfo(tab);

    // hard reset on every switch
    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);
    setTerminalVehicles([]);
    setSchoolVehicles([]);
    dispatch(clearStudents());
    setActiveTab('allstudents');

    if (tab === 'Track School') {
      // show ALL schools by default (no terminal selected)
      setSelectedTab(null);

      // clear drivers
      setActiveDrivers([]);
      setLoadingDrivers(false);

      // reset school selection so schools list show
      setSelectedSchool(null);
      setSelectedSchoolTab(true);
    } else {
      // drivers mode
      setSelectedSchool(null);
      setSelectedSchoolTab(false);
      setSelectedTab(null);
    }
  };

  const handleTerminalSelect = (terminalId) => {
    if (selectedInfo !== 'Track School') return;

    setSelectedTab(terminalId);
    setSelectedSchool(null);
    setSelectedSchoolTab(true);

    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);
    setSchoolVehicles([]);
    dispatch(clearStudents());
  };

  return (
    <MainLayout>
      <section className="w-full h-full">
        <div className="mt-7 md:h-[750px] h-full relative overflow-hidden">
          <ButtonGroup
            className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0 w-[30%]"
            variant="text"
            size="lg"
          >
            {['Track School', 'Track Drivers'].map((tab) => (
              <Button
                key={tab}
                className={
                  selectedInfo === tab
                    ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold'
                    : 'bg-white px-6 py-3 capitalize font-bold'
                }
                onClick={() => handleSelectedTabInfo(tab)}
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>

          {/* Terminal buttons only in Track School */}
          {selectedInfo === 'Track School' && (
            <div className="flex flex-row justify-between mt-4">
              {loading.terminals ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span className="text-sm">Loading terminals...</span>
                </div>
              ) : (
                <ButtonGroup className="border-0 rounded-[4px] outline-none p-0" variant="text">
                  {terminals && terminals.length > 0 ? (
                    terminals.map((terminal) => {
                      const terminalId = terminal.TerminalId || terminal.id;
                      const terminalName = terminal.TerminalName || terminal.name || `Terminal ${terminalId}`;
                      return (
                        <Button
                          key={terminalId}
                          className={
                            selectedTab === terminalId
                              ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium'
                              : 'bg-white text-xs md:text-[14px] text-[#141516] capitalize font-medium'
                          }
                          onClick={() => handleTerminalSelect(terminalId)}
                        >
                          {terminalName}
                        </Button>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">No terminals available</span>
                  )}
                </ButtonGroup>
              )}
            </div>
          )}

          {/* ✅ Scroll fix: fixed height + overflow hidden */}
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 mt-6 border shadow-sm rounded-md space-x-1 relative h-[calc(100vh-220px)] overflow-hidden">
            {/* ✅ Remount fix + scroll fix */}
            <div
              key={selectedInfo}
              className="bg-white w-full md:max-w-[280px] pt-2 h-full overflow-y-auto overscroll-contain"
            >
              <Tabs value={activeTab}>
                {/* Student tabs only when Track School + school selected */}
                {selectedInfo === 'Track School' && selectedSchool && (
                  <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                    indicatorProps={{
                      className: 'bg-transparent border-b-2 border-[#C01824] shadow-none rounded-none',
                    }}
                  >
                    {tabsData.map(({ label, value }) => (
                      <Tab
                        key={value}
                        value={value}
                        onClick={() => setActiveTab(value)}
                        className={activeTab === value ? 'font-bold text-[#C01824]' : ''}
                      >
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                )}

                <TabsBody className="pt-2">
                  {/* TRACK SCHOOL */}
                  {selectedInfo === 'Track School' ? (
                    !selectedSchool ? (
                      loading.schoolManagementSummary ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner className="h-6 w-6" />
                          <span className="ml-2 text-sm">Loading schools...</span>
                        </div>
                      ) : (() => {
                          const raw =
                            schoolManagementSummary && schoolManagementSummary.length > 0
                              ? schoolManagementSummary.filter((item) => {
                                  const schoolTerminalId = item.TerminalId || item.terminalId;
                                  // ✅ If terminal not selected => show ALL schools
                                  const matchTerminal = selectedTab ? schoolTerminalId === selectedTab : true;

                                  const hasInstitute = !!(item.InstituteId != null && item.InstituteName);
                                  const noDriverOrPerson = !(
                                    item.driverId ||
                                    item.role === 'driver' ||
                                    item.vehicleId ||
                                    item.numberPlate ||
                                    item.driverName ||
                                    item.DriverName ||
                                    item.busNo ||
                                    item.vehicleName ||
                                    (item.firstName && item.lastName)
                                  );

                                  return matchTerminal && hasInstitute && noDriverOrPerson;
                                })
                              : [];

                          return raw.length > 0 ? (
                            raw.map((school, index) => {
                              const instituteId = Array.isArray(school.InstituteId)
                                ? school.InstituteId[0]
                                : typeof school.InstituteId === 'string'
                                ? parseInt(school.InstituteId.split(',')[0])
                                : school.InstituteId;

                              const terminalIdForSchool = school.TerminalId || school.terminalId || null;

                              return (
                                <div key={`school-${instituteId}-${terminalIdForSchool ?? 'all'}-${index}`}>
                                  <Button
                                    className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none bg-[#fff] transition-all ${
                                      selectedSchool?.instituteId === instituteId ? 'bg-[#C01824] text-white' : ''
                                    }`}
                                    onClick={() =>
                                      toggleSchoolPanel({
                                        schoolName: school.InstituteName,
                                        instituteId,
                                        type: school.InstituteType || 'School',
                                        terminalId: terminalIdForSchool, // ✅ important
                                      })
                                    }
                                  >
                                    <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                                      <span className="text-lg font-bold text-gray-600">
                                        {school.InstituteName?.charAt(0)?.toUpperCase() || 'S'}
                                      </span>
                                    </div>
                                    <div
                                      className={`text-start text-base ${
                                        selectedSchool?.instituteId === instituteId ? 'text-white' : 'text-[#2C2F32]'
                                      }`}
                                    >
                                      <h6 className="font-bold text-[16px] capitalize">{school.InstituteName}</h6>
                                      <p className="font-bold text-[14px]">{school.InstituteType || 'School'}</p>
                                    </div>
                                  </Button>
                                  <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center justify-center py-8">
                              <span className="text-sm text-gray-500">
                                {selectedTab ? 'No schools found for this terminal' : 'No schools found'}
                              </span>
                            </div>
                          );
                        })()
                    ) : (activeTab === 'onboard' && loadingStudents) ||
                      (activeTab === 'allstudents' && studentsLoading.fetchStudentsByInstitute) ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner className="h-6 w-6" />
                        <span className="ml-2 text-sm">Loading students...</span>
                      </div>
                    ) : filterStudents().length > 0 ? (
                      filterStudents().map((student, index) => (
                        <div key={`student-${student.studentId}-${index}`}>
                          <Button
                            className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none bg-[#fff] transition-all ${
                              selectedStudent?.studentId === student.studentId
                                ? 'bg-[#C01824] text-white'
                                : 'bg-none hover:bg-[#C01824] group'
                            }`}
                            onClick={() => toggleStudentPanel(student)}
                          >
                            <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-600">
                                {student.name?.charAt(0)?.toUpperCase() || 'S'}
                              </span>
                            </div>
                            <div
                              className={`text-start text-base ${
                                selectedStudent?.studentId === student.studentId
                                  ? 'text-white'
                                  : 'text-[#2C2F32] group-hover:text-white'
                              }`}
                            >
                              <h6 className="font-bold text-[16px] capitalize">{student.name}</h6>
                              <p className="font-light text-[14px]">
                                Bus NO. <span className="font-bold">{student.busNo}</span>
                              </p>
                            </div>
                          </Button>
                          <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <span className="text-sm text-gray-500">
                          {activeTab === 'onboard' ? 'No students on board' : 'No students found'}
                        </span>
                      </div>
                    )
                  ) : (
                    // TRACK DRIVERS
                    <>
                      {loadingDrivers ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner className="h-6 w-6" />
                          <span className="ml-2 text-sm">Loading drivers...</span>
                        </div>
                      ) : activeDrivers.length > 0 ? (
                        activeDrivers.map((driver, index) => (
                          <div key={`driver-${driver.driverId}-${index}`}>
                            <Button
                              variant="gradient"
                              className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${
                                selectedStudent?.driverId === driver.driverId
                                  ? 'bg-black text-white'
                                  : 'bg-none hover:bg-black group'
                              }`}
                              onClick={() => toggleStudentPanel(driver)}
                            >
                              <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {driver.name?.charAt(0)?.toUpperCase() || 'D'}
                                </span>
                              </div>
                              <div
                                className={`text-start text-base ${
                                  selectedStudent?.driverId === driver.driverId
                                    ? 'text-white'
                                    : 'text-[#2C2F32] group-hover:text-white'
                                }`}
                              >
                                <h6 className="font-bold text-[16px] capitalize">{driver.name}</h6>
                                <p className="font-light text-[14px]">
                                  Bus NO. <span className="font-bold">{driver.busNo}</span>
                                </p>
                              </div>
                            </Button>
                            <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <span className="text-sm text-gray-500">No active drivers found</span>
                        </div>
                      )}
                    </>
                  )}
                </TabsBody>
              </Tabs>
            </div>

            {selectedStudent && (
              <div className="absolute md:left-[18rem] left-0 w-full top-0 md:w-full max-w-[370px] bg-white shadow-lg rounded-lg p-3 overflow-y-auto z-[500]">
                {selectedStudent?.role === 'driver' || selectedStudent?.driverId ? (
                  <div className="flex justify-between">
                    <div className="bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center h-[6vh]">
                      <p className="text-[13px] font-normal">EMPLOYEE ID</p>
                      <p className="text-[14px] font-bold">
                        {selectedStudent.driverId || selectedStudent.busNo}
                      </p>
                    </div>
                    <div className="flex items-center flex-col ps-3 gap-2 w-full bg-none">
                      <div className="rounded-full w-[89px] h-[90px] bg-gray-300 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600">
                          {selectedStudent.name?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                      </div>
                      <div className="text-center leading-tight text-[#141516] group-hover:text-white">
                        <h6 className="font-bold text-[18px]">{selectedStudent.name}</h6>
                        <p className="font-normal text-[14px]">Driver</p>
                      </div>
                    </div>
                    <div className="bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center h-[6vh]">
                      <p className="text-[14px] font-normal">BUS NO.</p>
                      <p className="text-[14px] font-bold">
                        {selectedStudent.busNo || selectedStudent.vehicleName || 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 w-full bg-none">
                      <img
                        src={selectedStudent.imgSrc}
                        alt={selectedStudent.name}
                        className="rounded-full w-[60px] h-[60px]"
                      />
                      <div className="text-center leading-tight text-[#141516] group-hover:text-white">
                        <h6 className="font-bold text-[18px]">{selectedStudent.name}</h6>
                        <p className="font-normal text-[14px]">Student</p>
                      </div>
                    </div>
                    <div className="bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center">
                      <p className="text-[14px] font-normal">BUS NO.</p>
                      <p className="text-[14px] font-bold">{selectedStudent.busNo}</p>
                    </div>
                  </div>
                )}

                {selectedStudent?.role === 'driver' || selectedStudent?.driverId ? (
                  selectedStudent.currentLocation && (
                    <div className="text-black pt-3">
                      <p className="text-[13.5px] font-medium">Current Location</p>
                      <p className="text-[14px] font-bold">
                        Lat: {selectedStudent.currentLocation.latitude?.toFixed(6)}, Lng:{' '}
                        {selectedStudent.currentLocation.longitude?.toFixed(6)}
                      </p>
                      {selectedStudent.currentLocation.speed && (
                        <p className="text-[13px] mt-1">
                          Speed: {selectedStudent.currentLocation.speed} km/h
                        </p>
                      )}
                      {selectedStudent.routeName && (
                        <p className="text-[13px] mt-1">Route: {selectedStudent.routeName}</p>
                      )}
                    </div>
                  )
                ) : (
                  <>
                    {selectedStudent?.pickupLocation && (
                      <div className="text-black pt-3">
                        <p className="text-[13.5px] font-medium">Pickup Location</p>
                        <p className="text-[14px] font-bold">{selectedStudent.pickupLocation}</p>
                      </div>
                    )}
                    {selectedStudent?.dropoffLocation && (
                      <div className="text-black pt-2">
                        <p className="text-[13.5px] font-medium">Dropoff Location</p>
                        <p className="text-[14px] font-bold">{selectedStudent.dropoffLocation}</p>
                      </div>
                    )}
                    {selectedStudent?.status && (
                      <div className="text-black pt-2">
                        <p className="text-[13.5px] font-medium">Status</p>
                        <p className="text-[14px] font-bold">{selectedStudent.status}</p>
                      </div>
                    )}
                  </>
                )}

                <div className="rounded-lg border border-black/25 mt-3 h-full max-h-[570px] overflow-y-auto">
                  {tripDetails.map((trip, index) => (
                    <div key={index} className="bg-black rounded-lg p-3 text-white leading-tight">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex pb-2 space-x-2 text-white font-semibold text-[11.5px]">
                            <p>{trip.time}</p>
                            <p>{trip.date}</p>
                          </div>
                          {trip.places.map((place, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <img src={trip.iconSrc} className="w-4 h-4" alt="not found" />
                              <p className="text-[13.5px] text-white font-semibold">{place}</p>
                            </div>
                          ))}
                        </div>
                        <div className="text-end text-white mt-5">
                          <p className="font-semibold text-[11.5px]">TRIP NO.</p>
                          <p className="font-extrabold text-[20px]">{trip.tripNo}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {tripStages.map((stage, index) => (
                    <div key={index} className="my-4 flex justify-center space-x-3 items-center">
                      <div className="flex flex-col items-center justify-center bg-[#DDDDE1] rounded-lg py-2.5 w-[75px]">
                        <img src={stage.iconSrc} className="w-[43px] h-[23px]" alt="not found" />
                        <p className="text-[13.5px] font-bold pt-2">{stage.label}</p>
                      </div>
                      <div className="flex flex-col items-start justify-start text-black">
                        <p className="text-[11.5px] font-semibold">{stage.time}</p>
                        <p className="text-[16px] font-bold">{stage.location}</p>
                        <p className="text-[13.5px] font-medium">{stage.address}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="absolute top-0 right-0 p-2 bg-gray-200 rounded-lg transition-all hover:bg-gray-300"
                  onClick={handleClosePanel}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="relative h-full md:h-full md:w-full w-auto overflow-hidden">
              {mapLoadError ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-6 text-center">
                  <p className="text-red-600 font-bold">Map Loading Error</p>
                  <p className="text-gray-600 mt-2">Please check your Google Maps API key</p>
                </div>
              ) : !isMapLoaded ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Spinner className="h-8 w-8" />
                  <span className="ml-3 text-sm">Loading map...</span>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={defaultZoom}
                  onLoad={onMapLoad}
                  onUnmount={onMapUnmount}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {mapMarkers.map((marker) => {
                    const iconConfig =
                      marker.type === 'driver'
                        ? {
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: window.google?.maps?.Size
                              ? new window.google.maps.Size(40, 40)
                              : undefined,
                          }
                        : {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                            scaledSize: window.google?.maps?.Size
                              ? new window.google.maps.Size(40, 40)
                              : undefined,
                          };

                    return <MarkerF key={marker.id} position={marker.position} title={marker.title} icon={iconConfig} />;
                  })}
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RealTimeTracking;
