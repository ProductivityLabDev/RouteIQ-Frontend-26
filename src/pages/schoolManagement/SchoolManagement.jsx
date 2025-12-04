import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Typography, Spinner } from '@material-tailwind/react'
import { FaBars,  FaPen } from 'react-icons/fa'
import { LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo } from '@/assets'
import { SchoolManagementModal } from './SchoolManagementModal'
import { DropdownItem } from '@/components/DropDown'
import SchoolManagementUserTable from '@/components/SchoolManagementUserTable';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchoolManagementSummary } from '@/redux/slices/schoolSlice'

const SchoolManagement = () => {
  const dispatch = useDispatch();
  const [openSchoolManagementModal, setOpenSchoolManagementModal] = useState(false);
  const [editInstitute, setEditInstitute] = useState(false);
  const [editingSchoolKey, setEditingSchoolKey] = useState(null);
  const [openDistricts, setOpenDistricts] = useState({});
  const [openTerminals, setOpenTerminals] = useState({});
  const navigate = useNavigate();
  const { schoolManagementSummary, loading } = useSelector((state) => state.schools);

  // Fetch real schools data on mount
  useEffect(() => {
    console.log("📡 [SchoolManagement] Mounting, dispatching fetchSchoolManagementSummary...");
    dispatch(fetchSchoolManagementSummary());
  }, [dispatch]);

  const handleOpenPopUp = () => {
    setOpenSchoolManagementModal(!openSchoolManagementModal);
    setEditInstitute(false);
  };

  const handleEditInstitutePopUp = () => {
    setOpenSchoolManagementModal(!openSchoolManagementModal);
    setEditInstitute(true);
  };

  // Build District -> Terminal -> Schools hierarchy from API
  const hierarchicalData = useMemo(() => {
    console.log("📊 [SchoolManagement] schoolManagementSummary from Redux:", schoolManagementSummary);

    if (!Array.isArray(schoolManagementSummary) || schoolManagementSummary.length === 0) {
      console.log("⚠️ [SchoolManagement] No summary data; hierarchy will be empty (static UI only).");
      return [];
    }

    const districtMap = {};

    schoolManagementSummary.forEach((item) => {
      const districtName = item.District || "District";
      const terminalId = item.TerminalId || 1;
      const terminalName = item.TerminalName || `Terminal ${terminalId}`;

      if (!districtMap[districtName]) {
        districtMap[districtName] = {};
      }

      if (!districtMap[districtName][terminalId]) {
        districtMap[districtName][terminalId] = {
          terminalId,
          terminalName,
          schools: [],
        };
      }

      // Normalise InstituteId (can sometimes come as array or comma-separated string)
      let normalizedInstituteId = item.InstituteId;
      if (Array.isArray(normalizedInstituteId)) {
        normalizedInstituteId = normalizedInstituteId[0];
      } else if (typeof normalizedInstituteId === "string") {
        const parts = normalizedInstituteId.split(",").map((p) => p.trim());
        normalizedInstituteId = parts[0] ? Number(parts[0]) : null;
      }

      districtMap[districtName][terminalId].schools.push({
        instituteId: normalizedInstituteId,
        name: item.InstituteName,
        logo: SkylineSchoolLogo,
        totalStudents: item.TotalStudents || 0,
        totalBuses: item.TotalBuses || 0,
        address: item.Address,
        raw: item,
      });
    });

    const result = Object.entries(districtMap).map(([districtName, terminals]) => ({
      districtName,
      terminals: Object.values(terminals),
    }));

    console.log("📊 [SchoolManagement] Built hierarchicalData:", result);
    return result;
  }, [schoolManagementSummary]);

// Fallback static schools (only used if there's no API data; not grouped)
const fallbackSchools = [
  {
    name: 'Skyline High School',
    logo: SkylineSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '123 Skyline Ave, City Center',
    instituteId: null,
  },
  {
    name: 'Lakeview High School',
    logo: LakeviewSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '456 Lakeview Rd, Riverside',
    instituteId: null,
  },
  {
    name: 'Springdale Elementary School',
    logo: SpringdaleSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '789 Spring St, Downtown',
    instituteId: null,
  },
  {
    name: 'Rosewood Elementary School',
    logo: RosewoodSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '321 Rosewood Blvd, Suburbia',
    instituteId: null,
  },
];

// If we have API hierarchy, use that; otherwise we'll show one static district/terminal list
const useApiHierarchy = hierarchicalData.length > 0;

  return (
    <MainLayout>
      <section className="w-full min-h-[80vh] pb-6">
        <div className="flex w-full justify-between flex-row mt-5 mb-8 items-center">
          <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2">
            School Management
          </Typography>
          <Button
            className="mt-5 px-8 py-2.5 bg-[#C01824] text-[14px] font-semibold capitalize rounded-[6px]"
            variant='filled'
            size='lg'
            onClick={handleOpenPopUp}
          >
            Add School
          </Button>
        </div>

        {/* ------------ Dropdown Structure ------------ */}
        {loading.summary ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner className="h-8 w-8 text-[#C01824]" />
            <Typography className="mt-3 text-sm text-gray-500">
              Loading schools...
            </Typography>
          </div>
        ) : useApiHierarchy ? (
          hierarchicalData.map((district) => (
            <DropdownItem
              key={district.districtName}
              // title={district.districtName}
              title={'District'}
              isOpen={openDistricts[district.districtName] || false}
              onToggle={() =>
                setOpenDistricts((prev) => ({
                  ...prev,
                  [district.districtName]: !prev[district.districtName],
                }))
              }
            >
              {district.terminals.map((terminal) => {
                const terminalKey = `${district.districtName}-${terminal.terminalId}`;
                return (
                  <DropdownItem
                    key={terminalKey}
                    title={terminal.terminalName}
                    isOpen={openTerminals[terminalKey] || false}
                    onToggle={() =>
                      setOpenTerminals((prev) => ({
                        ...prev,
                        [terminalKey]: !prev[terminalKey],
                      }))
                    }
                  >
                    {terminal.schools.map((school, schoolIndex) => {
                      const schoolKey = `${district.districtName}-${terminal.terminalId}-${school.instituteId || schoolIndex}`;
                      const isOpen = editingSchoolKey === schoolKey;
                      return (
                        <div key={schoolKey} className="flex flex-col">
                          <div className="flex items-center justify-between bg-white border rounded-lg shadow-sm py-3 px-4 my-2">
                            {/* Left: Drag, Logo, Name, Edit */}
                            <div className="flex items-center gap-3 flex-1">
                              <FaBars className="text-gray-600 cursor-move" />
                              <img src={school.logo} alt={school.name} className="w-10 h-10 rounded" />
                              <div className="flex flex-col">
                                <p className="text-black font-semibold whitespace-nowrap">{school.name}</p>
                                <p className="text-gray-500 text-xs whitespace-nowrap">{school.address}</p>
                              </div>
                              <FaPen
                                className="text-gray-600 cursor-pointer ml-2"
                                onClick={() =>
                                  setEditingSchoolKey(isOpen ? null : schoolKey)
                                }
                              />
                            </div>

                            {/* Middle - navigate to Student Management with instituteId */}
                            <div className="flex justify-center flex-1">
                              <button
                                className="bg-[#C01824] text-white font-semibold text-sm px-4 py-2 rounded"
                                onClick={() =>
                                  navigate('/StudentManagement', {
                                    state: {
                                      instituteId: school.instituteId,
                                      schoolName: school.name,
                                    },
                                  })
                                }
                              >
                                Student Management
                              </button>
                            </div>

                            {/* Right: Stats + Chevron */}
                            <div className="flex items-center gap-6">
                              <p className="text-[18] text-black whitespace-nowrap">
                                Total Students: <strong>{school.totalStudents}</strong>
                              </p>
                              <p className="text-[18] text-black whitespace-nowrap">
                                Total Buses: <strong>{school.totalBuses}</strong>
                              </p>
                              {isOpen ? (
                                <FaChevronUp
                                  className="text-gray-600 cursor-pointer"
                                  onClick={() => setEditingSchoolKey(null)}
                                />
                              ) : (
                                <FaChevronDown
                                  className="text-gray-600 cursor-pointer"
                                  onClick={() => setEditingSchoolKey(schoolKey)}
                                />
                              )}
                            </div>
                          </div>

                          {/* Conditionally render user table for this school */}
                          {isOpen && (
                            school.instituteId ? (
                              <SchoolManagementUserTable instituteId={school.instituteId} />
                            ) : (
                              <div className="mt-3 mb-3 w-[95%] mx-auto text-center py-8">
                                <p className="text-red-500">No Institute ID configured for this school.</p>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </DropdownItem>
                );
              })}
            </DropdownItem>
          ))
        ) : (
          // Static fallback if no API hierarchy is available
          <DropdownItem title="District" isOpen={true} onToggle={() => {}}>
            <DropdownItem title="Terminal 1" isOpen={true} onToggle={() => {}}>
              {fallbackSchools.map((school, schoolIndex) => (
                <div key={schoolIndex} className="flex flex-col">
                  <div className="flex items-center justify-between bg-white border rounded-lg shadow-sm py-3 px-4 my-2">
                    <div className="flex items-center gap-3 flex-1">
                      <FaBars className="text-gray-600 cursor-move" />
                      <img src={school.logo} alt={school.name} className="w-10 h-10 rounded" />
                      <div className="flex flex-col">
                        <p className="text-black font-semibold whitespace-nowrap">{school.name}</p>
                        <p className="text-gray-500 text-xs whitespace-nowrap">{school.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-[18] text-black whitespace-nowrap">
                        Total Students: <strong>{school.totalStudents}</strong>
                      </p>
                      <p className="text-[18] text-black whitespace-nowrap">
                        Total Buses: <strong>{school.totalBuses}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </DropdownItem>
          </DropdownItem>
        )}
      </section>

      <SchoolManagementModal
        open={openSchoolManagementModal}
        handleOpen={handleOpenPopUp}
        editInstitute={editInstitute}
      />
    </MainLayout>
  )
}

export default SchoolManagement