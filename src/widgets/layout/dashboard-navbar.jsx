import React, { useEffect, useMemo } from 'react';
import { useLocation, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Navbar,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { setAuthTokens } from "@/configs";
import { chevroncircleicon, GrNotification, PiChatCircleTextBold, profileavatar } from '@/assets';
import { FiSearch } from 'react-icons/fi'
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadCount } from "@/redux/slices/notificationsSlice";

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
    //navigate('/vendorChat');
    navigate('/vendorChat', { state: { activeTab: 'allUsers' } });

  };

  const dispatchUser = useDispatch();
  const { user: loggedInUser } = useSelector((state) => state.user);
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);
  const superAdminVendorContext = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("superAdminVendorContext") || "null");
    } catch (error) {
      return null;
    }
  }, [pathname]);


  useEffect(() => {
    // Vendor bell badge should stay live; light polling keeps UI in sync.
    if (!user) return;
    dispatchUser(fetchUnreadCount());
    const timer = setInterval(() => dispatchUser(fetchUnreadCount()), 30000);
    return () => clearInterval(timer);
  }, [dispatchUser, user]);

  const handleLogout = async () => {
    navigate("/logout")
  };

  const handleExitSuperAdminMode = () => {
    try {
      const originalAuth = JSON.parse(localStorage.getItem("superAdminOriginalAuth") || "null");
      if (originalAuth?.token) {
        setAuthTokens(originalAuth.token, originalAuth.refreshToken ?? null);
        Cookies.set("token", originalAuth.token, { expires: 7, secure: true });
      }
    } catch (error) {
      // Ignore malformed local storage payloads and continue exiting.
    }

    localStorage.removeItem("superAdminOriginalAuth");
    localStorage.removeItem("superAdminVendorContext");
    navigate("/super-admin/vendors");
  };

  return (
    <>
      {superAdminVendorContext?.active ? (
        <div className="mb-3 flex flex-col gap-3 rounded-2xl border border-[#f1c7cb] bg-[#fff2f3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c01824]">
              Super Admin Mode
            </p>
            <p className="truncate text-sm font-semibold text-[#171a2a] sm:pr-4">
              Viewing Vendor Workspace: {superAdminVendorContext.vendorName}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExitSuperAdminMode}
            className="shrink-0 self-start rounded-xl bg-[#c01824] px-4 py-2 text-sm font-semibold text-white sm:self-auto"
          >
            Back to Super Admin
          </button>
        </div>
      ) : null}
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
          <div className="flex w-full min-w-0 items-center gap-3 md:gap-5">
          {/* {shouldDisplaySearchBar || user === 'vendor' && (
              <div className="mr-auto w-72 flex flex-row md:max-w-screen-3xl md:w-full  bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
                <CiSearch size={25} color='#787878' />
                <input
                  type='search'
                  placeholder="Search"
                  className='p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px]'
                />
              </div>
            )} */}
          <div className="mr-auto w-72 min-w-0 flex-1 rounded-md bg-white">
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
          {user && (
            <div className="relative inline-block shrink-0">
              <button className="h-14 w-15 flex items-center justify-center focus:outline-none" onClick={handleVendorChatClick}>
                <PiChatCircleTextBold size={30} color="black" />
              </button>
              <span className="absolute top-3 right-0 inline-flex items-center justify-center w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
          )}
          {user && (
            <div className="relative inline-block shrink-0">
              <button className="h-14 w-16 flex items-center justify-center focus:outline-none" onClick={handleNotificationClick}>
                <GrNotification size={25} color="black" />
              </button>
              {Number(unreadCount) > 0 && (
                <span className="absolute -top-0.5 right-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-red-500 rounded-full">
                  {Number(unreadCount) > 99 ? "99+" : Number(unreadCount)}
                </span>
              )}
            </div>
          )}
          <Menu>
            <MenuHandler>
              <div className="flex shrink-0 items-center justify-end cursor-pointer">
                <Avatar
                  src={profileavatar}
                  alt={loggedInUser?.username || "User"}
                  variant="circular"
                  className="w-10 md:w-12 border h-10 md:h-12"
                />

                <div className="ml-3 min-w-0 text-left md:block hidden">
                  <Typography variant="h6" className="max-w-[160px] truncate font-bold text-[14px] text-black">
                    {loggedInUser?.username || "Guest User"}
                  </Typography>
                  <Typography
                    variant="small"
                    className="max-w-[160px] truncate text-[12px] font-semibold text-[#565656]"
                  >
                    {loggedInUser?.role || "No Role"}
                  </Typography>
                </div>

                <img
                  src={chevroncircleicon}
                  className="w-[24px] h-[24px] ml-3 md:block hidden"
                  alt="chevron"
                />
              </div>
            </MenuHandler>

            <MenuList>
              <Link to="#">
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
              <MenuItem className="flex items-center gap-2" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                <Typography
                  variant="small"
                  className="font-normal"
                >
                  Logout
                </Typography>
              </MenuItem>

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
                </Link> */}

              {/* <Link to="/account/sign-in">
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
    </>
  );
}

export default DashboardNavbar;
