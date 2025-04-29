import {
  HomeIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Profile,
  Schedule,
  Manage,
  Communication,
  Announcements,
  TripPlanner,
  CreateAnnouncement,
  Settings,
  FeedbackSupport,
} from "@/pages/dashboard";
import { ForgotPassword, SignIn, SignUp } from "@/pages/auth";
import NotFound from "@/components/NotFound";
import { announcementicon, communicationicon, dashboardicon, logouticon, manageicon, routescheduleicon, settingsicon, tripplannericon } from "./assets";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const sidenavRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <img src={dashboardicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <img src={manageicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "manage",
        path: "/manage",
        element: <Manage />,
      },
      {
        icon: <img src={routescheduleicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "route schedules",
        path: "/route-schedules",
        element: <Schedule />,
      },
      {
        icon: <img src={communicationicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "communication",
        path: "/communication",
        element: <Communication />,
      },
      {
        icon: <img src={announcementicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "announcements",
        path: "/announcements",
        element: <Announcements />,
      },
      {
        icon: <img src={tripplannericon} alt="Route Schedules" className="w-5 h-5" />,
        name: "trip planner",
        path: "/trip-planner",
        element: <TripPlanner />,
      },
    ],
  },
];

export const bottomRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <img src={settingsicon} alt="Route Schedules" className="w-5 h-5" />,
        name: "settings",
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    layout: "account",
    pages: [
      {
        icon: <img src={logouticon} alt="Route Schedules" className="w-5 h-5" />,
        name: "logout",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export const routes = [
  ...sidenavRoutes,
  ...bottomRoutes,
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "create announcements",
        path: "/create-announcement",
        element: <CreateAnnouncement />,
      },

      {
        icon: <HomeIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "feedback and support",
        path: "/feedback-and-support",
        element: <FeedbackSupport />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "account",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
];

export default routes;
