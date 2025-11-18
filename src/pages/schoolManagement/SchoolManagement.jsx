import React, { useState, useEffect } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Typography } from '@material-tailwind/react'
import { FaBars, FaPen } from 'react-icons/fa'
import { LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo } from '@/assets'
import { SchoolManagementModal } from './SchoolManagementModal'
import { DropdownItem } from '@/components/DropDown'
import SchoolManagementUserTable from '@/components/SchoolManagementUserTable';
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const SchoolManagement = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const [openSchoolManagementModal, setOpenSchoolManagementModal] = useState(false)
  const [editInstitute, setEditInstitute] = useState(false)
  const [editSchoolData, setEditSchoolData] = useState(null)
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openAreas, setOpenAreas] = useState([false])
  const [groupedSchools, setGroupedSchools] = useState(new Map())
  const [openSchools, setOpenSchools] = useState([])
  const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const handleNavigate = () => {
    navigate('/StudentManagement')
  }

  const handleOpenPopUp = () => {
    setOpenSchoolManagementModal(!openSchoolManagementModal)
    setEditInstitute(false)
    setEditSchoolData(null)
  }

  const handleEditInstitutePopUp = (school) => {
    setOpenSchoolManagementModal(!openSchoolManagementModal)
    setEditInstitute(true)
    setEditSchoolData(school)
  }

  const handleSchoolAdded = () => {
    getSchools(); // Refresh schools list after adding
  }


  const toggleDistrict = () => {
    if (openSchools.some(isOpen => isOpen)) {
      setOpenSchools([false, false, false, false])
    } else if (openAreas.some(isOpen => isOpen)) {
      setOpenAreas([false, false])
    } else {
      setOpenDistrict(!openDistrict)
    }
  }

  const toggleArea = (index) => {
    if (openSchools.some(isOpen => isOpen)) {
      setOpenSchools([false, false, false, false])
    } else {
      const newOpenAreas = openAreas.map((_, i) => i === index ? !openAreas[i] : false)
      setOpenAreas(newOpenAreas)

      if (!newOpenAreas[index]) {
        setOpenDistrict(false)
      }
    }
  }

  const toggleSchool = (index) => {
    setOpenSchools(openSchools.map((_, i) => i === index ? !openSchools[i] : false))
  }

  // Default logos array for fallback
  const defaultLogos = [SkylineSchoolLogo, LakeviewSchoolLogo, SpringdaleSchoolLogo, RosewoodSchoolLogo];

  const getSchools = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/institute/GetAllInstitutes`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Schools fetched:", res.data);

      // Handle different response formats
      let schoolsArray = [];
      if (Array.isArray(res.data)) {
        schoolsArray = res.data;
      } else if (Array.isArray(res.data.data)) {
        schoolsArray = res.data.data;
      } else if (res.data && typeof res.data === 'object') {
        // Single school object
        schoolsArray = [res.data];
      }

      console.log("📊 Schools array:", schoolsArray);
      if (schoolsArray.length > 0) {
        console.log("🔍 First school object:", schoolsArray[0]);
        console.log("🔍 First school keys:", Object.keys(schoolsArray[0]));
      }

      // Map API response to display format using exact field names
      const mappedSchools = schoolsArray.map((school, index) => {
        const mapped = {
          id: school.Id || school.id || index + 1,
          name: school.School || school.school || "",
          logo: school.logo || school.logoUrl || school.Logo || defaultLogos[index % defaultLogos.length],
          totalStudents: school.TotalStudent || school.totalStudent || school.TotalStudents || 0,
          totalBuses: school.TotalBuses || school.totalBuses || 0,
          address: school.Address || school.address || "",
          district: school.District || school.district || "",
          terminal: school.Terminal || school.terminal || "",
          president: school.President || school.president || "",
          principle: school.Principle || school.principle || "",
          email: school.Email || school.email || "",
          phoneNo: school.PhoneNo || school.phoneNo || "",
          contact: school.Contact || school.contact || "",
        };
        console.log(`📋 Mapped school ${index + 1}:`, mapped);
        return mapped;
      });

      console.log("✅ Total mapped schools:", mappedSchools.length);
      console.log("✅ All mapped schools:", mappedSchools);

      setSchools(mappedSchools);
      
      // Group schools by terminal (for future use)
      // For now, display all schools in one terminal
      const terminalsMap = new Map();
      mappedSchools.forEach(school => {
        const terminalKey = school.terminal || '1'; // Default to terminal 1
        if (!terminalsMap.has(terminalKey)) {
          terminalsMap.set(terminalKey, []);
        }
        terminalsMap.get(terminalKey).push(school);
      });
      
      // For now, combine all schools into one terminal for display
      // This will be changed later when schools are properly assigned to terminals
      const displayTerminalsMap = new Map();
      if (mappedSchools.length > 0) {
        displayTerminalsMap.set('1', mappedSchools); // Show all schools in Terminal 1
      }
      
      const uniqueTerminals = Array.from(displayTerminalsMap.keys());
      setGroupedSchools(displayTerminalsMap);
      setOpenAreas(Array(uniqueTerminals.length || 1).fill(false));
      setOpenSchools(mappedSchools.map(() => false));
    } catch (err) {
      console.error("❌ Error fetching schools:", err);
      console.error("❌ Error details:", err.response?.data || err.message);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getSchools();
    }
  }, [token]);

  // Refresh schools when modal closes (after adding/editing)
  useEffect(() => {
    if (!openSchoolManagementModal && token) {
      // Small delay to ensure API has processed the request
      const timer = setTimeout(() => {
        getSchools();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [openSchoolManagementModal, token]);

  return (
    <MainLayout>
      <section className='w-full h-full'>
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
        {loading ? (
          <div className="text-center py-8">
            <Typography className="text-gray-500">Loading schools...</Typography>
          </div>
        ) : schools.length === 0 ? (
          <div className="text-center py-8">
            <Typography className="text-gray-500">No schools found. Click "Add School" to create one.</Typography>
          </div>
        ) : (
          <DropdownItem title="District" isOpen={openDistrict} onToggle={toggleDistrict}>
            {groupedSchools.size > 0 ? Array.from(groupedSchools.entries()).map(([terminalKey, terminalSchools], terminalIndex) => (
              <DropdownItem 
                key={terminalKey} 
                title={`Terminal ${terminalKey}`} 
                isOpen={openAreas[terminalIndex] || false} 
                onToggle={() => toggleArea(terminalIndex)}
              >
                {terminalSchools.map((school, schoolIndex) => {
                  // Calculate unique index for this school across all terminals
                  const globalSchoolIndex = schools.findIndex(s => s.id === school.id);
                  return (
                    <div key={school.id || schoolIndex} className="flex flex-col">
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
                            onClick={() => {
                              handleEditInstitutePopUp(school);
                              setEditingSchoolIndex(editingSchoolIndex === globalSchoolIndex ? null : globalSchoolIndex);
                            }}
                          />
                        </div>

                        {/* Middle */}
                        <div className="flex justify-center flex-1">
                          <button
                            className="bg-[#C01824] text-white font-semibold text-sm px-4 py-2 rounded"
                            onClick={handleNavigate}
                          >
                            Student Management
                          </button>
                        </div>

                        {/* <div className="flex justify-center flex-1">
                        <button
                          className="bg-[#C01824] text-white font-semibold text-sm px-4 py-2 rounded"
                          onClick={handleNavigate}
                        >
                          Add Contact
                        </button>
                      </div> */}

                        {/* <div className="flex justify-center flex-1">
                        <button
                          className="bg-[#C01824] text-white font-semibold text-sm px-4 py-2 rounded"
                          onClick={handleNavigate}
                        >
                          Cancel Contact
                        </button>
                      </div> */}

                        {/* Right: Stats + Chevron */}
                        <div className="flex items-center gap-6">
                          <p className="text-[18] text-black whitespace-nowrap">
                            Total Students: <strong>{school.totalStudents}</strong>
                          </p>
                          <p className="text-[18] text-black whitespace-nowrap">
                            Total Buses: <strong>{school.totalBuses}</strong>
                          </p>
                          {editingSchoolIndex === globalSchoolIndex ? (
                            <FaChevronUp
                              className="text-gray-600 cursor-pointer"
                              onClick={() =>
                                setEditingSchoolIndex(editingSchoolIndex === globalSchoolIndex ? null : globalSchoolIndex)
                              }
                            />
                          ) : (
                            <FaChevronDown
                              className="text-gray-600 cursor-pointer"
                              onClick={() =>
                                setEditingSchoolIndex(editingSchoolIndex === globalSchoolIndex ? null : globalSchoolIndex)
                              }
                            />
                          )}
                        </div>
                      </div>

                      {/* Conditionally render user table for this school */}
                      {editingSchoolIndex === globalSchoolIndex && (
                        <SchoolManagementUserTable />
                      )}
                    </div>
                  );
                })}
              </DropdownItem>
            )) : (
              <div className="text-center py-4">
                <Typography className="text-gray-500">No terminals found</Typography>
              </div>
            )}
          </DropdownItem>
        )}


      </section>

      <SchoolManagementModal
        open={openSchoolManagementModal}
        handleOpen={handleOpenPopUp}
        editInstitute={editInstitute}
        editSchoolData={editSchoolData}
        refreshSchools={handleSchoolAdded}
      />
    </MainLayout>
  )
}

export default SchoolManagement
