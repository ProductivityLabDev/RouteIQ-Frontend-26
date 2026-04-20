import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
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
import { fetchBuses, fetchTerminals as fetchBusTerminals } from "@/redux/slices/busesSlice";
import { fetchSchoolInvoices } from "@/redux/slices/schoolInvoicesSlice";
import { fetchTripInvoices } from "@/redux/slices/tripInvoicesSlice";
import { SEARCH_COMMAND_LINKS, SEARCH_PAGE_LINKS, createFocusPath, scoreSearchItem } from "@/utils/globalSearch";
import { vendorService } from "@/services/vendorService";

export function DashboardNavbar({ user }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("vendorGlobalSearchRecent") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (error) {
      return [];
    }
  });
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
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
  const buses = useSelector((state) => state.buses?.buses || []);
  const busTerminals = useSelector((state) => state.buses?.terminals || []);
  const busesLoading = useSelector((state) => state.buses?.loading || {});
  const schoolInvoiceState = useSelector((state) => state.schoolInvoices?.invoices || { data: [] });
  const schoolInvoices = useMemo(() => (
    Array.isArray(schoolInvoiceState?.data)
      ? schoolInvoiceState.data
      : Array.isArray(schoolInvoiceState)
        ? schoolInvoiceState
        : []
  ), [schoolInvoiceState]);
  const schoolInvoiceLoading = useSelector((state) => state.schoolInvoices?.loading || {});
  const tripInvoiceState = useSelector((state) => state.tripInvoices?.invoices || { data: [] });
  const tripInvoices = useMemo(() => (
    Array.isArray(tripInvoiceState?.data)
      ? tripInvoiceState.data
      : Array.isArray(tripInvoiceState)
        ? tripInvoiceState
        : []
  ), [tripInvoiceState]);
  const tripInvoiceLoading = useSelector((state) => state.tripInvoices?.loading || {});
  const superAdminVendorContext = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("superAdminVendorContext") || "null");
    } catch (error) {
      return null;
    }
  }, [pathname]);
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();
  const [vendorSearchResults, setVendorSearchResults] = useState([]);
  const [vendorSearchLoading, setVendorSearchLoading] = useState(false);
  const normalizeSearchType = (value) => String(value || "").trim().toLowerCase().replace(/[_\s-]+/g, " ");
  const mapVendorSearchResult = (item, index) => {
    const resultType = normalizeSearchType(item?.type);
    const resultId = item?.id ?? item?.Id ?? `${resultType || "record"}-${index}`;
    const label = item?.label || item?.name || `${item?.type || "Record"} ${resultId}`;
    const description = item?.subLabel || item?.description || item?.email || item?.routeCode || item?.numberPlate || "Record";

    if (["driver", "employee", "staff", "dispatcher"].includes(resultType)) {
      return {
        id: `vendor-search-${resultType}-${resultId}`,
        label,
        description,
        meta: resultType === "driver" ? "Driver" : "Employee",
        path: createFocusPath("/EmployeeManagement", { type: "employee", id: resultId, label }),
        keywords: [item?.type, item?.subLabel],
      };
    }

    if (["vehicle", "bus"].includes(resultType)) {
      return {
        id: `vendor-search-vehicle-${resultId}`,
        label,
        description,
        meta: "Vehicle",
        path: createFocusPath("/vehicleManagement", { type: "vehicle", id: resultId, label }),
        keywords: [item?.type, item?.subLabel],
      };
    }

    if (["school", "schools"].includes(resultType)) {
      return {
        id: `vendor-search-school-${resultId}`,
        label,
        description,
        meta: "School",
        path: createFocusPath("/SchoolManagement", { type: "school", id: resultId, label }),
        keywords: [item?.type, item?.subLabel],
      };
    }

    if (["route", "routes"].includes(resultType)) {
      return {
        id: `vendor-search-route-${resultId}`,
        label,
        description,
        meta: "Route",
        path: "/RouteManagement",
        keywords: [item?.type, item?.subLabel],
      };
    }

    return {
      id: `vendor-search-record-${resultId}`,
      label,
      description,
      meta: item?.type || "Record",
      path: "/dashboard",
      keywords: [item?.type, item?.subLabel],
    };
  };
  const highlightMatch = (text, query) => {
    const source = String(text || "");
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return source;
    const lowerSource = source.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();
    const index = lowerSource.indexOf(lowerQuery);
    if (index === -1) return source;

    return (
      <>
        {source.slice(0, index)}
        <span className="rounded bg-[#FDECEF] px-0.5 text-[#C01824]">
          {source.slice(index, index + trimmedQuery.length)}
        </span>
        {source.slice(index + trimmedQuery.length)}
      </>
    );
  };
  const quickLinks = useMemo(() => SEARCH_PAGE_LINKS, []);
  const commandLinks = useMemo(() => SEARCH_COMMAND_LINKS, []);
  const searchablePages = useMemo(() => [...quickLinks, ...commandLinks], [quickLinks, commandLinks]);
  const filteredQuickLinks = useMemo(() => {
    const query = normalizedSearchValue;
    if (!query) return searchablePages.slice(0, 6);
    return searchablePages
      .map((item) => ({
        ...item,
        searchScore: scoreSearchItem(query, [item.label, item.description, ...(item.keywords || [])], { kind: "page" }),
      }))
      .filter((item) => item.searchScore >= 28)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 10);
  }, [normalizedSearchValue, searchablePages]);
  const dataSearchItems = useMemo(() => {
    const vehicleItems = (Array.isArray(buses) ? buses : []).map((bus, index) => {
      const vehicleId = bus.vehicleId ?? bus.VehicleId ?? bus.BusId ?? bus.id ?? index;
      const vehicleLabel =
        bus.vehicleName ||
        bus.VehicleName ||
        bus.numberPlate ||
        bus.NumberPlate ||
        `Vehicle ${vehicleId}`;
      const terminalName =
        bus.assignedTerminalName ||
        bus.AssignedTerminalName ||
        bus.terminalName ||
        bus.TerminalName ||
        "Vehicle";
      return {
        id: `vehicle-${vehicleId}`,
        label: vehicleLabel,
        description: `${bus.numberPlate || bus.NumberPlate || "No plate"} | ${terminalName}`,
        meta: "Vehicle",
        path: createFocusPath("/vehicleManagement", { type: "vehicle", id: vehicleId, label: vehicleLabel }),
        keywords: [
          bus.numberPlate,
          bus.NumberPlate,
          bus.vehicleMake,
          bus.VehicleMake,
          bus.busType,
          terminalName,
        ],
      };
    });
    const terminalItems = (Array.isArray(busTerminals) ? busTerminals : []).map((terminal, index) => {
      const terminalId = terminal.TerminalId ?? terminal.terminalId ?? terminal.id ?? index;
      const terminalName =
        terminal.TerminalName ||
        terminal.terminalName ||
        terminal.name ||
        terminal.TerminalCode ||
        `Terminal ${terminalId}`;
      return {
        id: `terminal-${terminalId}`,
        label: terminalName,
        description: terminal.address || terminal.city || terminal.TerminalCode || "Terminal",
        meta: "Terminal",
        path: createFocusPath("/accounting", { type: "terminal", id: terminalId, label: terminalName }, { tab: "Terminal" }),
        keywords: [
          terminal.TerminalCode,
          terminal.terminalCode,
          terminal.city,
          terminal.state,
          terminal.address,
        ],
      };
    });
    const schoolInvoiceItems = (Array.isArray(schoolInvoices) ? schoolInvoices : []).map((invoice, index) => {
      const invoiceId = invoice.invoiceId ?? invoice.InvoiceId ?? invoice.id ?? index;
      const invoiceNumber =
        invoice.invoiceNumber ||
        invoice.InvoiceNumber ||
        invoice.invoiceNo ||
        `School Invoice ${invoiceId}`;
      const schoolName =
        invoice.schoolName ||
        invoice.instituteName ||
        invoice.BillTo ||
        invoice.billTo ||
        "School invoice";
      const amount = invoice.totalAmount ?? invoice.TotalAmount ?? invoice.invoiceTotal ?? invoice.amount;
      return {
        id: `school-invoice-${invoiceId}`,
        label: invoiceNumber,
        description: `${schoolName}${amount ? ` | ${amount}` : ""}`,
        meta: "School Invoice",
        path: createFocusPath("/accounting", { type: "school-invoice", id: invoiceId, label: invoiceNumber }, { tab: "School Invoices" }),
        keywords: [schoolName, invoice.status, invoice.type, invoice.InvoiceType, amount],
      };
    });
    const tripInvoiceItems = (Array.isArray(tripInvoices) ? tripInvoices : []).map((invoice, index) => {
      const invoiceId = invoice.invoiceId ?? invoice.InvoiceId ?? invoice.id ?? index;
      const invoiceNumber =
        invoice.invoiceNumber ||
        invoice.InvoiceNumber ||
        invoice.invoiceNo ||
        `Trip Invoice ${invoiceId}`;
      const terminalName =
        invoice.terminalName ||
        invoice.TerminalName ||
        invoice.schoolName ||
        invoice.instituteName ||
        "Trip invoice";
      const amount = invoice.totalAmount ?? invoice.TotalAmount ?? invoice.invoiceTotal ?? invoice.amount;
      return {
        id: `trip-invoice-${invoiceId}`,
        label: invoiceNumber,
        description: `${terminalName}${amount ? ` | ${amount}` : ""}`,
        meta: "Trip Invoice",
        path: createFocusPath("/accounting", { type: "trip-invoice", id: invoiceId, label: invoiceNumber }, { tab: "Trip invoices" }),
        keywords: [terminalName, invoice.status, invoice.type, invoice.InvoiceType, amount],
      };
    });
    const profileItem = loggedInUser ? [{
      id: "record-my-profile",
      label: loggedInUser?.name || loggedInUser?.username || "My Profile",
      description: loggedInUser?.email || "Vendor profile",
      meta: "Profile",
      path: "/vendor-profile",
      keywords: [loggedInUser?.role, "account", "company profile"],
    }] : [];
    return [
      ...profileItem,
      ...vendorSearchResults,
      ...(vendorSearchResults.length === 0 && normalizedSearchValue ? vehicleItems : []),
      ...terminalItems,
      ...schoolInvoiceItems,
      ...tripInvoiceItems,
    ];
  }, [buses, busTerminals, loggedInUser, normalizedSearchValue, schoolInvoices, tripInvoices, vendorSearchResults]);
  const filteredDataItems = useMemo(() => {
    const query = normalizedSearchValue;
    if (!query) return [];
    const rankedItems = dataSearchItems
      .map((item) => ({
        ...item,
        searchScore: scoreSearchItem(query, [item.label, item.description, item.meta, ...(item.keywords || [])], { kind: "record" }),
      }))
      .filter((item) => item.searchScore >= 24)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 20);

    const seen = new Set();
    return rankedItems.filter((item) => {
      const key = `${item.meta}-${item.label}-${item.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }, [dataSearchItems, normalizedSearchValue]);
  const recentSearchItems = useMemo(() => (
    recentSearches
      .map((item) => searchablePages.find((link) => link.path === item.path) || item)
      .slice(0, 5)
  ), [recentSearches, searchablePages]);
  const shortcutItems = useMemo(() => commandLinks.slice(0, 4), [commandLinks]);
  const browseItems = useMemo(() => quickLinks.slice(0, 5), [quickLinks]);
  const idleSections = useMemo(() => {
    const sections = [];
    if (recentSearchItems.length > 0) {
      sections.push({ key: "recent", title: "Recent", items: recentSearchItems });
    }
    sections.push({ key: "shortcuts", title: "Shortcuts", items: shortcutItems });
    sections.push({ key: "browse", title: "Browse", items: browseItems });
    return sections;
  }, [browseItems, recentSearchItems, shortcutItems]);
  const idleResults = useMemo(() => (
    idleSections.flatMap((section) => section.items)
  ), [idleSections]);
  const recordSections = useMemo(() => {
    const grouped = filteredDataItems.reduce((acc, item) => {
      const metaKey = item.meta || "Records";
      if (!acc[metaKey]) acc[metaKey] = [];
      acc[metaKey].push(item);
      return acc;
    }, {});
    const metaOrder = ["Profile", "School Invoice", "Trip Invoice", "Vehicle", "Terminal", "School", "Driver", "Employee", "Route"];
    return Object.entries(grouped)
      .sort((a, b) => {
        const aIndex = metaOrder.indexOf(a[0]);
        const bIndex = metaOrder.indexOf(b[0]);
        const safeA = aIndex === -1 ? metaOrder.length + 1 : aIndex;
        const safeB = bIndex === -1 ? metaOrder.length + 1 : bIndex;
        return safeA - safeB;
      })
      .map(([title, items]) => ({ key: title, title, items }));
  }, [filteredDataItems]);
  const combinedResults = useMemo(() => {
    const pageResults = filteredQuickLinks.map((item) => ({ ...item, resultType: "page" }));
    const recordResults = filteredDataItems.map((item) => ({ ...item, resultType: "record" }));
    return [...pageResults, ...recordResults];
  }, [filteredDataItems, filteredQuickLinks]);


  useEffect(() => {
    // Vendor bell badge should stay live; light polling keeps UI in sync.
    if (!user) return;
    dispatchUser(fetchUnreadCount());
    const timer = setInterval(() => dispatchUser(fetchUnreadCount()), 30000);
    return () => clearInterval(timer);
  }, [dispatchUser, user]);

  useEffect(() => {
    if (!searchOpen) return;

    const query = normalizedSearchValue;
    if (query.length < 2) {
      setVendorSearchResults([]);
      setVendorSearchLoading(false);
      return;
    }

    let ignore = false;
    setVendorSearchLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await vendorService.search(query);
        if (ignore) return;
        const rows = Array.isArray(response?.data) ? response.data : [];
        setVendorSearchResults(rows.map((item, index) => mapVendorSearchResult(item, index)));
      } catch (error) {
        if (!ignore) {
          setVendorSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setVendorSearchLoading(false);
        }
      }
    }, 180);

    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [normalizedSearchValue, searchOpen]);

  useEffect(() => {
    const handleOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  useEffect(() => {
    if (!searchOpen) return;

    const query = normalizedSearchValue;
    if (!query) return;

    const wantsVehicles = ["bus", "vehicle", "fleet", "plate", "garage", "repair", "defect"].some((term) => query.includes(term));
    const wantsTerminals = ["terminal", "route", "stop", "schedule"].some((term) => query.includes(term));
    const wantsInvoices = ["invoice", "billing", "account", "payable", "receivable", "kpi", "balance", "income", "report", "trip"].some((term) => query.includes(term));

    if (query.length >= 2 && (!Array.isArray(buses) || buses.length === 0) && !busesLoading.buses && wantsVehicles) {
      dispatchUser(fetchBuses());
    }
    if (query.length >= 2 && (!Array.isArray(busTerminals) || busTerminals.length === 0) && !busesLoading.terminals && wantsTerminals) {
      dispatchUser(fetchBusTerminals());
    }
    if (query.length >= 2 && (!Array.isArray(schoolInvoices) || schoolInvoices.length === 0) && !schoolInvoiceLoading.invoices && wantsInvoices) {
      dispatchUser(fetchSchoolInvoices({ limit: 8, offset: 0, search: query }));
    }
    if (query.length >= 2 && (!Array.isArray(tripInvoices) || tripInvoices.length === 0) && !tripInvoiceLoading.invoices && wantsInvoices) {
      dispatchUser(fetchTripInvoices({ limit: 8, offset: 0, search: query }));
    }
  }, [
    buses,
    busTerminals,
    busesLoading.buses,
    busesLoading.terminals,
    dispatchUser,
    normalizedSearchValue,
    schoolInvoiceLoading.invoices,
    schoolInvoices,
    searchOpen,
    tripInvoiceLoading.invoices,
    tripInvoices,
  ]);
  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchValue, searchOpen]);
  useEffect(() => {
    const handleQuickOpen = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    document.addEventListener("keydown", handleQuickOpen);
    return () => document.removeEventListener("keydown", handleQuickOpen);
  }, []);

  const handleLogout = async () => {
    navigate("/logout")
  };
  const rememberSearch = (item) => {
    const nextItem = {
      label: item.label,
      description: item.description,
      path: item.path,
    };
    setRecentSearches((prev) => {
      const next = [nextItem, ...prev.filter((entry) => entry.path !== item.path)].slice(0, 5);
      localStorage.setItem("vendorGlobalSearchRecent", JSON.stringify(next));
      return next;
    });
  };
  const clearRecentSearches = () => {
    localStorage.removeItem("vendorGlobalSearchRecent");
    setRecentSearches([]);
    setSelectedSearchIndex(0);
  };
  const handleQuickSearchNavigate = (path) => {
    setSearchOpen(false);
    setSearchValue("");
    navigate(path);
  };
  const handleSearchSelect = (item) => {
    rememberSearch(item);
    handleQuickSearchNavigate(item.path);
  };
  const handleSearchKeyDown = (event) => {
    const activeResults = searchValue.trim() ? combinedResults : idleResults;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedSearchIndex((prev) => Math.min(prev + 1, Math.max(activeResults.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedSearchIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selectedItem = activeResults[selectedSearchIndex] || activeResults[0];
      if (selectedItem?.path) {
        handleSearchSelect(selectedItem);
      }
    }
    if (event.key === "Escape") {
      setSearchOpen(false);
    }
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
        className={`rounded-xl overflow-visible transition-all ${fixedNavbar
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
          <div ref={searchRef} className="mr-auto w-72 min-w-0 flex-1 rounded-md bg-white">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiSearch />
              </span>
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search pages, records, invoices... (Ctrl/Cmd + K)"
                className="pl-10 pr-24 py-3 w-full text-[#090909] font-light outline-none border border-[#DCDCDC] rounded-[6px]"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 hidden items-center md:flex">
                <span className="rounded-md border border-[#E4E7EC] bg-[#F8FAFC] px-2 py-1 text-[11px] font-semibold text-[#667085]">
                  Ctrl/Cmd + K
                </span>
              </div>
              {searchOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#F0F2F5] px-4 py-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                        Quick Search
                      </div>
                      <div className="mt-1 text-xs text-[#667085]">
                        Jump to screens or open matching vendor records instantly.
                      </div>
                    </div>
                    <div className="hidden rounded-full bg-[#F8FAFC] px-3 py-1 text-[11px] font-medium text-[#667085] md:block">
                      {searchValue.trim() ? `${combinedResults.length} results` : "Global app search"}
                    </div>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto py-2">
                    {!searchValue.trim() ? (
                      <>
                        {idleSections.map((section) => (
                          <div key={section.key}>
                            <div className="flex items-center justify-between px-4 py-2">
                              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                                {section.title}
                              </div>
                              {section.key === "recent" && section.items.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={clearRecentSearches}
                                  className="text-[11px] font-semibold text-[#C01824] hover:text-[#9f1520]"
                                >
                                  Clear
                                </button>
                              ) : null}
                            </div>
                            {section.items.map((item) => {
                              const itemIndex = idleResults.findIndex((entry) => entry.path === item.path && entry.label === item.label);
                              return (
                                <button
                                  key={`${section.key}-${item.path}-${item.label}`}
                                  type="button"
                                  onClick={() => handleSearchSelect(item)}
                                  className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left ${selectedSearchIndex === itemIndex ? "bg-[#F9FAFB]" : "hover:bg-[#F9FAFB]"}`}
                                >
                                  <div>
                                    <div className="text-sm font-semibold text-[#141516]">{item.label}</div>
                                    <div className="mt-1 text-xs text-[#667085]">{item.description}</div>
                                  </div>
                                  <div className="shrink-0 rounded-full bg-[#F8FAFC] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                                    {section.title === "Browse" ? "Page" : section.title === "Shortcuts" ? "Quick" : "Recent"}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </>
                    ) : filteredQuickLinks.length === 0 && filteredDataItems.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-[#667085]">
                        No matching result found. Try invoice number, school name, driver, vehicle, or terminal.
                      </div>
                    ) : (
                      <>
                        {filteredQuickLinks.length > 0 && (
                          <>
                            <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                              Pages
                            </div>
                            {filteredQuickLinks.map((item, index) => (
                              <button
                                key={item.id || item.path}
                                type="button"
                                onClick={() => handleSearchSelect(item)}
                                className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left ${selectedSearchIndex === index ? "bg-[#F9FAFB]" : "hover:bg-[#F9FAFB]"}`}
                              >
                                <div>
                                  <div className="text-sm font-semibold text-[#141516]">{highlightMatch(item.label, searchValue)}</div>
                                  <div className="mt-1 text-xs text-[#667085]">{highlightMatch(item.description, searchValue)}</div>
                                </div>
                                <div className="shrink-0 text-[11px] font-medium text-[#98A2B3]">
                                  {item.path}
                                </div>
                              </button>
                            ))}
                          </>
                        )}
                        {(recordSections.length > 0 || vendorSearchLoading || busesLoading.buses || busesLoading.terminals || schoolInvoiceLoading.invoices || tripInvoiceLoading.invoices) && (
                          <>
                            {recordSections.map((section) => (
                              <div key={section.key}>
                                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98A2B3]">
                                  {section.title}
                                </div>
                                {section.items.map((item) => {
                                  const itemIndex = combinedResults.findIndex((entry) => entry.id === item.id);
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => handleSearchSelect(item)}
                                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left ${selectedSearchIndex === itemIndex ? "bg-[#F9FAFB]" : "hover:bg-[#F9FAFB]"}`}
                                    >
                                      <div>
                                        <div className="text-sm font-semibold text-[#141516]">{highlightMatch(item.label, searchValue)}</div>
                                        <div className="mt-1 text-xs text-[#667085]">{highlightMatch(item.description, searchValue)}</div>
                                      </div>
                                      <div className="shrink-0 rounded-full bg-[#F2F4F7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#667085]">
                                        {item.meta}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                            {filteredDataItems.length === 0 && searchValue.trim() && (vendorSearchLoading || busesLoading.buses || busesLoading.terminals || schoolInvoiceLoading.invoices || tripInvoiceLoading.invoices) ? (
                              <div className="px-4 py-3 text-sm text-[#667085]">
                                Searching vendor records...
                              </div>
                            ) : null}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#F0F2F5] px-4 py-2 text-[11px] text-[#98A2B3]">
                    <span>Use arrows to move, Enter to open, Esc to close.</span>
                    <span>{searchValue.trim() ? "Search across pages and vendor data" : "Start typing to narrow results"}</span>
                  </div>
                </div>
              )}
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
              <Link to="/vendor-profile">
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
