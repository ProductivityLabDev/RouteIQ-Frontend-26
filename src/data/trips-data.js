import { driver } from "@/assets";

export const tripsData = [
    {
      id: 1,
      busNumber: 'SDD 104',
      status: 'Approved',
      time: '8:30 AM 28/MAR/24',
      pickup: {
        location: 'Hoover Elementary School',
        address: '950 Hunt Ave Neenah, WI 54956',
      },
      dropoff: {
        location: 'Hoover Elementary School',
        address: '950 Hunt Ave Neenah, WI 54956',
      },
      driver: {
        name: 'Mark Tommay',
        image: driver,
      },
      noOfPersons: 35,
    },
    {
      id: 2,
      busNumber: 'SDD 105',
      status: 'Pending',
      time: '9:00 AM 28/MAR/24',
      pickup: {
        location: 'Lincoln Middle School',
        address: '234 Elm St Neenah, WI 54956',
      },
      dropoff: {
        location: 'Lincoln Middle School',
        address: '234 Elm St Neenah, WI 54956',
      },
      driver: {
        name: 'Jane Doe',
        image: driver,
      },
      noOfPersons: 40,
    },
    {
      id: 3,
      busNumber: 'SDD 106',
      status: 'Rejected',
      time: '10:00 AM 28/MAR/24',
      pickup: {
        location: 'Roosevelt High School',
        address: '456 Maple St Neenah, WI 54956',
      },
      dropoff: {
        location: 'Roosevelt High School',
        address: '456 Maple St Neenah, WI 54956',
      },
      driver: {
        name: 'John Smith',
        image: driver,
      },
      noOfPersons: 30,
    },
  ];