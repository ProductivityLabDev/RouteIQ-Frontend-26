import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import routes from "@/routes";
import SubscriptionPage from "../pages/dashboard/SubscriptionPage";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess";
import DashboardSubscription from '../pages/dashboard/DashboardSubcription'
import Merchant from '../pages/dashboard/merchant'

export function Auth() {
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/account/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign in",
      path: "/account/sign-in",
      icon: UserIcon,
    },
  ];

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "account" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
        <Route path="/dashboard_subscription" element={<DashboardSubscription />} />
        <Route path="/subscription_page" element={<SubscriptionPage />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/payment_success" element={<PaymentSuccess />} />

      </Routes>
    </div>
  );
}

export default Auth;
