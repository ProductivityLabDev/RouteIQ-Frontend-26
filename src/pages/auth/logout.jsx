import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("vendor");
            sessionStorage.clear();
            if ("caches" in window) {
                caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
            }
        } finally {

            window.location.replace("/LoginAsVendor");
        }
    }, []);

    return null;
}
