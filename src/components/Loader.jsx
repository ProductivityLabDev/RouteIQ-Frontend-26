import { Spinner } from "@material-tailwind/react";

export function Loader() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-sm z-50">
            <Spinner className="h-16 w-16" />
        </div>
    );
}

export default Loader;
