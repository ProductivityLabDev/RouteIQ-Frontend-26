import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Typography } from '@material-tailwind/react'
import { FaBars,  FaPen } from 'react-icons/fa'
import { LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo } from '@/assets'
import { SchoolManagementModal } from './SchoolManagementModal'
import { DropdownItem } from '@/components/DropDown'
import SchoolManagementUserTable from '@/components/SchoolManagementUserTable';
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SchoolManagement = () => {
  const [openSchoolManagementModal, setOpenSchoolManagementModal] = useState(false)
  const [editInstitute, setEditInstitute] = useState(false)
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openAreas, setOpenAreas] = useState([false, false])
  const [openSchools, setOpenSchools] = useState([false, false, false, false])
  const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
  const navigate = useNavigate();


const handleNavigate = () => {
 navigate('/StudentManagement')
}

  const handleOpenPopUp = () => {
    setOpenSchoolManagementModal(!openSchoolManagementModal)
    setEditInstitute(false)
  }

  const handleEditInstitutePopUp = () => {
    setOpenSchoolManagementModal(!openSchoolManagementModal)
    setEditInstitute(true)
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

const schools = [
  {
    name: 'Skyline High School',
    logo: SkylineSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '123 Skyline Ave, City Center'
  },
  {
    name: 'Lakeview High School',
    logo: LakeviewSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '456 Lakeview Rd, Riverside'
  },
  {
    name: 'Springdale Elementary School',
    logo: SpringdaleSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '789 Spring St, Downtown'
  },
  {
    name: 'Rosewood Elementary School',
    logo: RosewoodSchoolLogo,
    totalStudents: 459,
    totalBuses: 10,
    address: '321 Rosewood Blvd, Suburbia'
  },
]

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
        <DropdownItem title="District" isOpen={openDistrict} onToggle={toggleDistrict}>
          {openAreas.map((isOpen, index) => (
            <DropdownItem key={index} title="Terminal 1" isOpen={isOpen} onToggle={() => toggleArea(index)}>
             {schools.map((school, schoolIndex) => (
            <div key={schoolIndex} className="flex flex-col">
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
                          setEditingSchoolIndex(editingSchoolIndex === schoolIndex ? null : schoolIndex)
                        }
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
                        {editingSchoolIndex === schoolIndex ? (
                    <FaChevronUp
                        className="text-gray-600 cursor-pointer"
                        onClick={() =>
                        setEditingSchoolIndex(editingSchoolIndex === schoolIndex ? null : schoolIndex)
                        }
                    />
                    ) : (
                    <FaChevronDown
                        className="text-gray-600 cursor-pointer"
                        onClick={() =>
                        setEditingSchoolIndex(editingSchoolIndex === schoolIndex ? null : schoolIndex)
                        }
                    />
                    )}
                    </div>
                    </div>

                    {/* Conditionally render user table for this school */}
                    {editingSchoolIndex === schoolIndex && (
                    <SchoolManagementUserTable />
                    )}
                </div>
                
                ))}
            </DropdownItem>
            ))}
        </DropdownItem>

    

        {/* Extra collapsed districts for later use */}
        <DropdownItem title="District" isOpen={false} onToggle={() => { }} />
        <DropdownItem title="District" isOpen={false} onToggle={() => { }} />
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