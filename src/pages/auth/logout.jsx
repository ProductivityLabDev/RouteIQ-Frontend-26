import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice";
import { persistor } from "@/redux/store";
import Cookies from "js-cookie";

export default function Logout() {
    const dispatch = useDispatch();
    console.log("we are here log outttttttttttttttt")
    useEffect(() => {
        (async () => {
            try {
                dispatch(logoutUser());
                await persistor.purge();
                localStorage.removeItem("token");
                localStorage.removeItem("vendor");
                sessionStorage.clear();
                Cookies.remove("token");

                if ("caches" in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map((k) => caches.delete(k)));
                }
            } finally {
                // Prevent browser back button after logout
                window.history.pushState(null, "", window.location.href);
                
                // Redirect to sign-in page
                window.location.replace("/account/sign-in");
            }
        })();
    }, [dispatch]);

    // Prevent back navigation after logout
    useEffect(() => {
        const handlePopState = (event) => {
            // Prevent going back to previous page
            window.history.pushState(null, "", window.location.href);
            // Redirect to sign-in if they try to go back
            window.location.replace("/account/sign-in");
        };

        // Push a new state to prevent back navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    return null;
}
