import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/userSlice";
import { persistor } from "@/redux/store";
import Cookies from "js-cookie";

export default function Logout() {
    const dispatch = useDispatch();

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

                window.location.replace("/LoginAsVendor");
            }
        })();
    }, [dispatch]);

    return null;
}
