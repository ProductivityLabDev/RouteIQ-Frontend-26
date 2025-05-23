import React from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { Chat, chevroncircleicon, GrNotification, notificationicon, PiChatCircleTextBold, profileavatar } from '@/assets';
import { FiSearch } from 'react-icons/fi'

export function DashboardNavbar({ user }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const navigate = useNavigate()
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const location = useLocation();
  const activeRoutes = [
    '/dashboard/trip-planner',
    '/dashboard/announcements',
    '/dashboard/manage'
  ];
  const shouldDisplaySearchBar = activeRoutes.includes(location.pathname);
  const handleNotificationClick = (event) => {
    event.preventDefault();
    navigate('/notification');
  };
  const handleVendorChatClick = () => {
    // navigate('/vendorChat');
    navigate('/vendorChat', { state: { activeTab: 'allUsers' } });

  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center pt-2">
        <div className="flex w-full justify-end space-x-5 items-center">
          {shouldDisplaySearchBar || user === 'vendor' && (
            <div className="mr-auto w-72 flex flex-row md:max-w-screen-3xl md:w-full  bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
              <CiSearch size={25} color='#787878' />
              <input
                type='search'
                placeholder="Search"
                className='p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px]'
              />
            </div>
          )}
            <div className="mr-auto w-72 md:max-w-screen-3xl md:w-full rounded-md bg-white">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch />
              </span>
              <input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-3 w-full text-[#090909] font-light outline-none border border-[#DCDCDC] rounded-[6px]"
              />
            </div>
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-8 w-8 text-blue-gray-500" />
          </IconButton>
          <Menu>
            {user &&
              <div className="relative inline-block">
                <button className="h-14 w-15 flex items-center justify-center focus:outline-none" onClick={handleVendorChatClick}>
                  <PiChatCircleTextBold size={30} color="black" />
                </button>
                <span className="absolute top-3 right-0 inline-flex items-center justify-center w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            }
            {user ?
              <div className="relative inline-block">
                <button className="h-14 w-16 flex items-center justify-center focus:outline-none" onClick={handleNotificationClick}>
                  <GrNotification size={25} color="black" />
                </button>
                <span className="absolute top-3 right-4 inline-flex items-center justify-center w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              :
              <MenuHandler>
                <IconButton variant="text" className="h-14 w-16">
                  <img src={notificationicon} alt='' />
                </IconButton>
              </MenuHandler>
            }

            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">

                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">

                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuHandler>
              <div className="flex justify-end items-center w-full md:max-w-[170px] sm:max-w-[60px] max-w-[40px] cursor-pointer">
                <Avatar
                  src={profileavatar}
                  alt="Avatar"
                  variant="circular"
                  className='w-10 md:w-12 border h-10 md:h-12'
                />
                <div className="ml-4 text-left md:block hidden">
                  <Typography variant="h6" className="font-bold text-[14px] text-black">
                    Moni Roy
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex items-center gap-1 text-[12px] font-semibold text-[#565656]"
                  >
                    Admin
                  </Typography>
                </div>
                <img src={chevroncircleicon} className='w-[24px] h-[24px] ml-5 md:block hidden' alt="not found" />
              </div>
            </MenuHandler>
            <MenuList>
              <Link to="/dashboard/profile">
                <MenuItem className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography
                    variant="small"
                    className="font-normal"
                  >
                    Edit Profile
                  </Typography>
                </MenuItem>
              </Link>
              {/* <Link to="/dashboard/settings">
                <MenuItem className="flex items-center gap-2">
                  <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
                  <Typography
                    variant="small"
                    className="font-normal"
                  >
                    Settings
                  </Typography>
                </MenuItem>
              </Link>
              <Link to="/account/sign-in">
                <MenuItem className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <Typography
                    variant="small"
                    className="font-normal"
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              </Link> */}
            </MenuList>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
