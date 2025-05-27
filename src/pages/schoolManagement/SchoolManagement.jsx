import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Accordion, AccordionBody, AccordionHeader, Button, Card, CardBody, Typography } from '@material-tailwind/react'
import { SchoolManagementModal } from './SchoolManagementModal'
import { FaBars, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo } from '@/assets';
import { DropdownItem, SchoolDetails } from '@/components/DropDown';

const SchoolManagement = () => {
    const [openSchoolManagementModal, setOpenSchoolManagementModal] = useState(false);
    const [editInstitute, setEditInstitute] = useState(false)
    const [openAccordion, setOpenAccordion] = useState(null);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [openAreas, setOpenAreas] = useState([false, false]);
    const [openSchools, setOpenSchools] = useState([false, false, false, false]);

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
            setOpenSchools([false, false, false, false]);
        } else if (openAreas.some(isOpen => isOpen)) {
            setOpenAreas([false, false]);
        } else {
            setOpenDistrict(!openDistrict);
        }
    };
    const toggleArea = (index) => {
        if (openSchools.some(isOpen => isOpen)) {
            setOpenSchools([false, false, false, false]);
        } else {
            const newOpenAreas = openAreas.map((_, i) => i === index ? !openAreas[i] : false);
            setOpenAreas(newOpenAreas);

            if (!newOpenAreas[index]) {
                setOpenDistrict(false);
            }
        }
    };
    const toggleSchool = (index) => {
        setOpenSchools(openSchools.map((_, i) => i === index ? !openSchools[i] : false));
    };

    const schools = [
        { name: 'Skyline High School', logo: SkylineSchoolLogo, president: 'Robert Richard', principle: 'Sam Hawk', totalStudents: 459, totalBuses: 10, contact: '(907) 555-0101' },
        { name: 'Lakeview High School', logo: LakeviewSchoolLogo },
        { name: 'Springdale Elementary School', logo: SpringdaleSchoolLogo },
        { name: 'Rosewood Elementary School', logo: RosewoodSchoolLogo },
    ];
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className="flex w-[100%] justify-between flex-row mt-5 mb-8 items-center">
                    <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 700 }}>School Management</Typography>
                    <Button className="mt-5 px-8 py-2.5 bg-[#C01824] text-[14px] font-semibold capitalize rounded-[6px]" variant='filled' size='lg' onClick={handleOpenPopUp}>
                        Add School
                    </Button>
                </div>
                {/* ------------------------------------- Drop Down Arrow ---------------------------- */}
                <DropdownItem title="District" isOpen={openDistrict} onToggle={toggleDistrict}>
                    {openAreas.map((isOpen, index) => (
                        <DropdownItem key={index} title="Area" isOpen={isOpen} onToggle={() => toggleArea(index)}>
                            {schools.map((school, schoolIndex) => (
                                <DropdownItem
                                    key={schoolIndex}
                                    title={school.name}
                                    icon={school.logo}
                                    isOpen={openSchools[schoolIndex]}
                                    onToggle={() => toggleSchool(schoolIndex)}
                                    isSchool={true}
                                >
                                    <SchoolDetails school={school} handleEditInstitutePopUp={handleEditInstitutePopUp} />
                                </DropdownItem>
                            ))}
                        </DropdownItem>
                    ))}
                </DropdownItem>
                <DropdownItem title="District" isOpen={false} onToggle={() => { }} />
                <DropdownItem title="District" isOpen={false} onToggle={() => { }} />
            </section>
            <SchoolManagementModal open={openSchoolManagementModal} handleOpen={handleOpenPopUp} editInstitute={editInstitute} />
        </MainLayout>
    )
}

export default SchoolManagement