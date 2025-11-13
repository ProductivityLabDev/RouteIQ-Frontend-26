import React, { useState } from "react";
import { RiDeleteBin6Line, RiEditBoxFill } from "react-icons/ri";
import axios from "axios";

const UserCard = ({ username, password, handleOpenDeleteModal }) => {

    const [userDetail,getUserDetail] = useState();

     const get = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/terminals`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched terminals:", res.data);

            // ✅ Works for both cases: direct array or wrapped in `data`
            const terminalsArray = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

            setTerminals(terminalsArray);
        } catch (err) {
            console.error("Error fetching terminals:", err);
            setTerminals([]);
        } finally {
            setLoading(false);
        }
    };

return(

  <div className="bg-white rounded border border-[#e7e4db] w-full flex items-center justify-between px-5 py-4 shadow-sm mb-4">
    <div>
      <div className="flex items-center mb-1">
        <span className="text-[18px] font-semibold text-[#202224] mr-2">Username:</span>
        <span className="text-[18px] font-semibold text-[#202224]">{username}</span>
      </div>
      <div className="flex items-center">
        <span className="text-[18px] font-semibold text-[#202224] mr-3">Password:</span>
        <span className="text-[18px] font-semibold text-[#202224] tracking-widest">{password}</span>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <button
        type="button"
        className="flex items-center gap-1 text-[#171717] hover:text-[#333] text-sm font-normal"
        aria-label="Edit user"
      >
        <RiEditBoxFill size={24} className="inline-block" />
        <span className="ml-1 text-[18px] font-semibold">Edit</span>
      </button>

      <button
        type="button"
        className="flex items-center gap-1 text-[#171717] hover:text-[#ea384c] text-sm font-normal"
        onClick={handleOpenDeleteModal}
        aria-label="Delete user"
      >
        <RiDeleteBin6Line size={24} className="inline-block" />
        <span className="ml-1 text-[18px] font-semibold">Delete</span>
      </button>
    </div>
  </div>
  )
};

export default UserCard;
