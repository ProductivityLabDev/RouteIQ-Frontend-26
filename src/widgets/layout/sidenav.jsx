import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { sidenavRoutes, bottomRoutes } from "@/routes";
import { logo } from "@/assets";

export function Sidenav() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 h-screen w-[240px] flex flex-col transition-transform duration-300 xl:translate-x-0`}
    >
      <div className={`relative`}>
        <Link to={`/`}>
          <img src={logo} className="w-full max-w-[180px] mx-auto py-14" alt="not found" />
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="flex-grow">
        {sidenavRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <div className={`flex items-center mb-1`}>
                      <span className={`${isActive ? "border-[2px] py-[24px] rounded-r-[8px] border-[#C01824]" : "border-l-4 border-transparent"}`}><hr className="border-0 hidden" />
                      </span>
                      <Button
                        variant="text"
                        color="white"
                        className={`flex items-center gap-2 mx-4 p-4 rounded-[6px] capitalize ${isActive ? "bg-[#C01824] text-white hover:bg-[#C01824] hover:text-white" : sidenavType === "dark" ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-200"}`}
                        fullWidth
                      >
                        <div className={`w-[23px] ${isActive ? "text-white invert" : sidenavType === "dark" ? "text-white invert" : "text-[#141516]"}`}>
                          {icon}
                        </div>
                        <Typography
                          color="inherit"
                          className="font-medium nunito-sans text-[14px] capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="mt-auto border-t border-gray-300 pt-4">
        {bottomRoutes.map(({ layout, pages }, key) => (
          <ul key={key} className="flex flex-col">
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <div className={`flex items-center mb-2`}>
                      <span className={`${isActive ? "border-[2px] py-[24px] rounded-r-[8px] border-[#C01824]" : "border-l-4 border-transparent"}`}><hr className="border-0 hidden" />
                      </span>
                      <Button
                        variant="text"
                        color="white"
                        className={`flex items-center gap-2 p-4 mx-4 rounded-[6px] capitalize ${isActive ? "bg-[#C01824] text-white hover:bg-[#C01824] hover:text-white" : sidenavType === "dark" ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-200"}`}
                        fullWidth
                      >
                        <div className={`w-[23px] ${isActive ? "text-white invert" : sidenavType === "dark" ? "text-white invert" : "text-black"}`}>
                          {icon}
                        </div>
                        <Typography
                          color="inherit"
                          className="font-medium text-[14px] capitalize"
                        >
                          {name}
                        </Typography>
                      </Button>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

export default Sidenav;
