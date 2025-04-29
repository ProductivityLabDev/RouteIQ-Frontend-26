import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  ButtonGroup,

} from "@material-tailwind/react";
import { AddStudent, Delete, Note } from '@/components/TripPlanner';
import { deleteicon, guardianicon, licenseimg, nexticon, previcon, readnoticon } from '@/assets';
import { EditStudent } from '@/components/Modals/EditStudent';

export function Manage() {
  const [selectedTab, setSelectedTab] = useState('Students');
  const [selectedOption, setSelectedOption] = useState('');
  const [openNote, setOpenNote] = useState(false);
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [openEditStudent, setOpenEditStudent] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [active, setActive] = useState(1);
  const [openLicense, setOpenLicense] = useState(false);

  const handleOpenNote = () => setOpenNote(!openNote);
  const handleOpenAddStudent = () => setOpenAddStudent(!openAddStudent);
  const handleOpenEditStudent = () => setOpenEditStudent(!openEditStudent);
  const handleOpenDelete = () => setOpenDelete(!openDelete);
  const handleOpenLicense = () => setOpenLicense(!openLicense);

  const prev = () => setActive((prev) => Math.max(prev - 1, 1));
  const next = () => setActive((prev) => Math.min(prev + 1, 10));

  const STUDENTS_TABLE_HEAD = ["First Name", "Last Name", "Grade", "Emergency Contact", "Enrollment", "Address", "Note", "Attendance Status"];

  const STUDENTS_TABLE_ROWS = [
    {
      name: "John Michael",
      lastname: "Lane",
      job: "Manager",
      org: "Organization",
      present: true,
      address: "Orchard Road 44",
      enrollment: "600375",
      contact: "(907) 555-0101",
      grade: "11th Grade"
    },
    {
      name: "Alexa Liras",
      lastname: "Lane",
      job: "Programator",
      org: "Developer",
      present: false,
      address: "Royal Mile 8",
      enrollment: "600842",
      contact: "(907) 555-0101",
      grade: "9th Grade"
    },
    {
      name: "Laurent Perrier",
      lastname: "Lane",
      job: "Executive",
      org: "Projects",
      present: false,
      address: "Jump Street 21",
      enrollment: "600693",
      contact: "(907) 555-0101",
      grade: "2nd Grade"
    },
    {
      name: "Michael Levi",
      lastname: "Warren",
      job: "Programator",
      org: "Developer",
      present: true,
      address: "Royal Mile 8",
      enrollment: "600375",
      contact: "(907) 555-0101",
      grade: "4th Grade"
    },
    {
      name: "Richard Gran",
      lastname: "Richards",
      job: "Manager",
      org: "Executive",
      present: false,
      address: "Orchard Road 44",
      enrollment: "600842",
      contact: "(907) 555-0101",
      grade: "3rd Grade"
    },
    {
      name: "John Michael",
      lastname: "Edwards",
      job: "Manager",
      org: "Organization",
      present: true,
      address: "Royal Mile 8",
      enrollment: "600693",
      contact: "(907) 555-0101",
      grade: "11th Grade"
    },
    {
      name: "Alexa Liras",
      lastname: "Fox",
      job: "Programator",
      org: "Developer",
      present: false,
      address: "Jump Street 21",
      enrollment: "600693",
      contact: "(907) 555-0101",
      grade: "11th Grade"
    },
    {
      name: "Laurent Perrier",
      lastname: "Lane",
      job: "Executive",
      org: "Projects",
      present: false,
      address: "Royal Mile 8",
      enrollment: "600375",
      contact: "(907) 555-0101",
      grade: "11th Grade"
    },
    {
      name: "Michael Levi",
      lastname: "Edwards",
      job: "Programator",
      org: "Developer",
      present: true,
      address: "Jump Street 21",
      enrollment: "600842",
      contact: "(907) 555-0101",
      grade: "11th Grade"
    },
  ];

  const DRIVERS_TABLE_ROWS = [
    {
      name: "John Michael",
      lastname: "Lane",
      job: "Driver",
      org: "Transport",
      present: true,
      address: "Orchard Road 44",
      enrollment: "D600375",
      contact: "(907) 555-0101",
      grade: "A"
    },
    {
      name: "Alexa Liras",
      lastname: "Lane",
      job: "Driver",
      org: "Transport",
      present: false,
      address: "Royal Mile 8",
      enrollment: "D600842",
      contact: "(907) 555-0101",
      grade: "B"
    },
  ];


  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(STUDENTS_TABLE_ROWS.map(() => false));
  const [rowsToDelete, setRowsToDelete] = useState([]);

  const handleSelectAll = () => {
    const newSelectedAll = !selectedAll;
    setSelectedAll(newSelectedAll);
    const newSelectedRows = selectedRows.map(() => newSelectedAll);
    setSelectedRows(newSelectedRows);
    setRowsToDelete(newSelectedRows.map((selected, index) => selected ? STUDENTS_TABLE_ROWS[index] : null).filter(row => row !== null));
  };

  const handleSelectRow = (index) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);
    setSelectedAll(newSelectedRows.every(Boolean));
    setRowsToDelete(newSelectedRows.map((selected, idx) => selected ? STUDENTS_TABLE_ROWS[idx] : null).filter(row => row !== null));
  };

  const handleDelete = () => {
    setOpenDelete(false);
  };

  const openDeleteModal = () => {
    if (rowsToDelete.length > 0) {
      setOpenDelete(true);
    }
  };

  return (
    <section className='rounded-md mt-5 h-full bg-white p-3'>
      <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent">
        <div className="flex items-center flex-wrap justify-between gap-4">
          <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='lg'>
            {['Students', 'Drivers'].map(index => (
              <Button
                key={index}
                className={selectedTab === index ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                onClick={() => setSelectedTab(index)}
              >
                {index}
              </Button>
            ))}
          </ButtonGroup>

          <ButtonGroup onClick={openDeleteModal} className="border-2 border-[#DDDDE1]/50 flex rounded-[10px] outline-none p-0" variant="text" size='lg'>
            {['Delete', 'Guardian 1', 'Guardian 2'].map(index => (
              <Button
                key={index}
                className={selectedOption === index ? 'bg-[#C01824] hover:bg-[#C01824]/80 flex items-center justify-center md:px-5 px-3 md:py-3 text-white font-bold text-xs md:text-[14px] capitalize' : 'bg-white flex items-center justify-center px-3 md:px-5 md:py-3 text-[#808080] text-xs md:text-[14px] capitalize font-bold'}
                onClick={() => setSelectedOption(index)}
              >
                {index === 'Delete' && (
                  <img src={deleteicon} className="inline-block lg:h-5 lg:w-5 md:mr-2" alt="Delete Icon" />
                )}
                {index === 'Guardian 1' && (
                  <img src={guardianicon} className="inline-block lg:h-5 lg:w-5 md:mr-2" alt="Guardian 1 Icon" />
                )}
                {index === 'Guardian 2' && (
                  <img src={guardianicon} className="inline-block lg:h-5 lg:w-5 md:mr-2" alt="Guardian 2 Icon" />
                )}
                {index}
              </Button>
            ))}
          </ButtonGroup>

          <div className='flex gap-x-3'>
            <Button onClick={handleOpenAddStudent} className="flex items-center capitalize font-normal rounded-[6px] px-4 md:px-6 py-3 md:py-3.5 md:text-[14px] bg-[#C01824] gap-3" size="md">
              Add Student
            </Button>
            <Button className="flex items-center capitalize font-normal px-4 md:px-6 py-3 md:py-3.5 md:text-[14px] rounded-[6px] bg-[#C01824] gap-3" size="md">
              Download Attendance Report
            </Button>
          </div>
          <Button onClick={handleOpenLicense} variant="text" className='flex py-2 px-4 rounded-[6px] space-x-3 items-center border-[1px] border-[#DDDDE1]'>
            <img src={licenseimg} className='w-full max-w-[40px]' alt="" />
            <p className='text-[14px] text-[#141516] font-bold capitalize'>View Driving Licenses</p>
          </Button>
        </div>

      </CardHeader>
      <Card className="h-full w-full rounded-md shadow-md overflow-auto mt-5">
        <table className="w-full min-w-max table-auto text-left border rounded-[4px]">
          <thead>
            <tr>
              <th className="border bg-[#EEEEEE] px-4 py-2">
                <Checkbox
                  checked={selectedAll}
                  onChange={handleSelectAll}
                  color='red'
                  className='rounded-[4px] custom-checkbox'
                />
              </th>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border bg-[#EEEEEE] px-4">
                  <Typography
                    className="font-bold text-[14px] leading-none text-[#141516]"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENTS_TABLE_ROWS.map(({ grade, name, lastname, present, address, enrollment, contact }, index) => {
              const isLast = index === STUDENTS_TABLE_ROWS.length - 1;
              const classes = isLast ? "px-4 py-1" : "px-4 py-1 border-b border-[#D9D9D9]";
              return (
                <tr key={name} className=''>
                  <td className={classes}>
                    <Checkbox
                      checked={selectedRows[index]}
                      onChange={() => handleSelectRow(index)}
                      color='red'
                      className='rounded-[4px] custom-checkbox'
                    />
                  </td>
                  <td className={classes}>
                    <Typography
                      className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {lastname}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {grade}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography as="a" href="#" className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {contact}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {enrollment}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography className="font-semibold text-[14px] leading-none text-[#141516]"
                    >
                      {address}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Read Note">
                      <IconButton onClick={handleOpenNote} variant="text">
                        <img src={readnoticon} className="h-5 w-6" alt='' />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td className={classes}>
                    <div className='flex items-center space-x-3'>
                      <Chip className='w-[85px] rounded-[4px]' variant="ghost" size="lg" value={present ? "present" : "absent"} color={present ? "green" : "red"} />
                    
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className='flex justify-between items-center mt-6 mb-4 pl-1'>
        <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
          Page {active} - 06 of 20
        </Typography>
        <div className='!py-0 bg-[#FAFBFD] border border-[#D5D5D5] rounded-[14px] space-x-3'>
          <IconButton
            size="md"
            variant="text"
            onClick={prev}
            disabled={active === 1}
          >
            <img src={previcon} alt='' strokeWidth={2} className="h-[24px] w-[24px]" />
          </IconButton>
          <IconButton
            size="md"
            variant="text"
            onClick={next}
            disabled={active === 10}
          >
            <img src={nexticon} alt='' strokeWidth={2} className="h-[24px] w-[24px]" />
          </IconButton>
        </div>
      </div>

      <Note open={openNote} handleOpen={handleOpenNote} />
      <AddStudent open={openAddStudent} handleOpen={handleOpenAddStudent} />
      <EditStudent open={openEditStudent} handleOpen={handleOpenEditStudent} />
      <Delete open={openDelete} handleOpen={handleOpenDelete} onDelete={handleDelete} rowsToDelete={rowsToDelete} />
    </section>
  );
}

export default Manage;
