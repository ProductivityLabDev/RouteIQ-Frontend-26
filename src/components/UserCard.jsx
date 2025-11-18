import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line, RiEditBoxFill } from "react-icons/ri";
import axios from "axios";
import { BASE_URL, getAuthToken, getAxiosConfig } from "@/configs/api";

const UserCard = ({ handleOpenDeleteModal, handleEditUser, refreshTrigger }) => {
    const token = getAuthToken();

    const [userDetail, setUserDetail] = useState([]);
    const [loading, setLoading] = useState(true);

    const getUserDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/institute/GetUserCridentials`, getAxiosConfig());

            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.data)
                ? res.data.data
                : [];
            const hasSortableFields = list.some(item => 
                item.createdAt || item.id !== undefined || item.UserId
            );
            
            let sortedList;
            if (hasSortableFields) {
             
                sortedList = [...list].sort((a, b) => {
                   
                    if (a.createdAt && b.createdAt) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
          
                    if (a.id !== undefined && b.id !== undefined) {
                        return b.id - a.id;
                    }
                   
                    if (a.UserId && b.UserId) {
                        return b.UserId - a.UserId;
                    }
                    return 0;
                });
            } else {
                sortedList = [...list].reverse();
            }

            console.log("📋 Users sorted (newest first):", sortedList);
            setUserDetail(sortedList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setUserDetail([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getUserDetails();
        }
       
    }, [token, refreshTrigger]);

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="w-full h-full">
            {userDetail.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No users found</p>
            ) : (
                <div className="space-y-4">
                    {userDetail.map((item, index) => (
                        <div
                            key={item.Id || item.id || item.UserId || item.userId || item.ID || item._id || item.Username || index}
                            className="bg-white rounded border border-[#e7e4db] w-full flex items-center justify-between px-5 py-4 shadow-sm"
                        >
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-[18px] font-semibold text-[#202224] mr-2">
                                        Username:
                                    </span>
                                    <span className="text-[18px] font-semibold text-[#202224]">
                                        {item.Username}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <span className="text-[18px] font-semibold text-[#202224] mr-3">
                                        Password: 
                                    </span>
                                    <span className="text-[18px] font-semibold text-[#202224] tracking-widest">
                                        {item.Password ? `${item.Password.substring(0, 2)}********` : "********"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-[#171717] hover:text-[#333]"
                                    aria-label="Edit user"
                                    onClick={() => {
                                        console.log("✏️ Edit button clicked. User data:", item);
                                        if (handleEditUser) {
                                            handleEditUser(item);
                                        }
                                    }}
                                >
                                    <RiEditBoxFill size={24} className="inline-block" />
                                    <span className="ml-1 text-[18px] font-semibold">Edit</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-[#171717] hover:text-[#ea384c]"
                                    onClick={() => {
                                        // Try multiple ID field names
                                        const userId = item.Id || item.id || item.UserId || item.userId || item.ID || item._id;
                                        console.log("🗑️ Delete button clicked. User ID:", userId, "Full item:", item);
                                        handleOpenDeleteModal(userId);
                                    }}
                                    aria-label="Delete user"
                                >
                                    <RiDeleteBin6Line size={24} className="inline-block" />
                                    <span className="ml-1 text-[18px] font-semibold">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserCard;
