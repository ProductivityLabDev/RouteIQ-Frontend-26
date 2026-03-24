import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice";
import { persistor } from "@/redux/store";
import Cookies from "js-cookie";
import { apiClient, clearAuthTokens, getRefreshToken } from "@/configs";

export default function Logout() {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                const refreshToken = getRefreshToken();

                try {
                    if (refreshToken) {
                        await apiClient.post("/auth/logout", { refreshToken });
                    } else {
                        await apiClient.post("/auth/logout", {});
                    }
                } catch (_) {
                    // Even if server logout fails, continue with local cleanup.
                }

                dispatch(logoutUser());
                await persistor.purge();
                clearAuthTokens();
                localStorage.removeItem("vendor");
                localStorage.removeItem("user");
                localStorage.removeItem("employeeUser");
                localStorage.removeItem("instituteId");
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
