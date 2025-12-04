import React, { useEffect, useMemo } from "react";
import { RiDeleteBin6Line, RiEditBoxFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "@/redux/slices/usersSlice";
import { Spinner } from "@material-tailwind/react";
import { getAuthToken } from "@/configs/api";

// Validation function to check if user data is valid
const validateUser = (user) => {
    if (!user || typeof user !== 'object') {
        return { isValid: false, error: "Invalid user data structure" };
    }

    // Check for required fields - at least username or some identifier
    const hasUsername = user.Username || user.username;
    const hasId = user.Id || user.id || user.UserId || user.userId || user.ID || user._id;
    
    if (!hasUsername && !hasId) {
        return { isValid: false, error: "User missing required identifier" };
    }

    // Validate username if present
    if (hasUsername) {
        const username = user.Username || user.username;
        if (typeof username !== 'string' || username.trim().length === 0) {
            return { isValid: false, error: "Invalid username" };
        }
        if (username.length < 3 || username.length > 50) {
            return { isValid: false, error: "Username must be between 3 and 50 characters" };
        }
    }

    // Validate email if present
    if (user.Email || user.email) {
        const email = user.Email || user.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Invalid email format" };
        }
    }

    // Validate phone number if present
    if (user.PhoneNumber || user.phoneNumber || user.Phone || user.phone) {
        const phone = user.PhoneNumber || user.phoneNumber || user.Phone || user.phone;
        if (phone && typeof phone === 'string') {
            // Remove spaces, dashes, parentheses for validation
            const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 15) {
                return { isValid: false, error: "Invalid phone number format" };
            }
        }
    }

    return { isValid: true, error: null };
};

// Get user ID from various possible field names
const getUserId = (user) => {
    return user.Id || user.id || user.UserId || user.userId || user.ID || user._id || null;
};

const UserCard = ({ handleOpenDeleteModal, handleEditUser, refreshTrigger }) => {
    const dispatch = useDispatch();
    const token = getAuthToken();
    
    // Get users data from Redux store
    const { users: userDetail, loading, error } = useSelector((state) => state.users);

    // Validate and filter users
    const validUsers = useMemo(() => {
        if (!Array.isArray(userDetail)) return [];
        
        return userDetail.filter((user) => {
            const validation = validateUser(user);
            if (!validation.isValid) {
                console.warn("⚠️ Invalid user data:", user, "Error:", validation.error);
            }
            return validation.isValid;
        });
    }, [userDetail]);

    // Fetch users when component mounts or refreshTrigger changes
    useEffect(() => {
    if (token) {
      console.log("🔄 [UserCard] Dispatching fetchUsers action...");
      dispatch(fetchUsers());
    }
    }, [token, refreshTrigger, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Spinner className="h-8 w-8 text-[#C01824]" />
        <p className="mt-3 text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }
    
    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                <p>Error: {error}</p>
                <button 
                    onClick={() => dispatch(fetchUsers())}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Handle edit with validation
    const handleEdit = (user) => {
        const validation = validateUser(user);
        if (!validation.isValid) {
            console.error("❌ Cannot edit invalid user:", validation.error);
            alert(`Cannot edit user: ${validation.error}`);
            return;
        }

        const userId = getUserId(user);
        if (!userId) {
            console.error("❌ Cannot edit user: Missing user ID");
            alert("Cannot edit user: Missing user ID");
            return;
        }

        console.log("✏️ Edit button clicked. User data:", user);
        if (handleEditUser) {
            handleEditUser(user);
        }
    };

    // Handle delete with validation
    const handleDelete = (user) => {
        const validation = validateUser(user);
        if (!validation.isValid) {
            console.error("❌ Cannot delete invalid user:", validation.error);
            alert(`Cannot delete user: ${validation.error}`);
            return;
        }

        const userId = getUserId(user);
        if (!userId) {
            console.error("❌ Cannot delete user: Missing user ID");
            alert("Cannot delete user: Missing user ID");
            return;
        }

        console.log("🗑️ Delete button clicked. User ID:", userId, "Full item:", user);
        if (handleOpenDeleteModal) {
            handleOpenDeleteModal(userId);
        }
    };

    return (
        <div className="w-full h-full">
            {validUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    {userDetail.length === 0 
                        ? "No users found" 
                        : `No valid users found (${userDetail.length - validUsers.length} invalid entries filtered)`}
                </p>
            ) : (
                <div className="space-y-4">
                    {validUsers.map((item, index) => {
                        const userId = getUserId(item);
                        const username = item.Username || item.username || "N/A";
                        const password = item.Password || item.password || "";
                        
                        return (
                            <div
                                key={userId || item.Username || index}
                                className="bg-white rounded border border-[#e7e4db] w-full flex items-center justify-between px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <div className="flex items-center mb-1">
                                        <span className="text-[18px] font-semibold text-[#202224] mr-2">
                                            Username:
                                        </span>
                                        <span className="text-[18px] font-semibold text-[#202224]">
                                            {username}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-[18px] font-semibold text-[#202224] mr-3">
                                            Password: 
                                        </span>
                                        <span className="text-[18px] font-semibold text-[#202224] tracking-widest">
                                            {password ? `${password.substring(0, 2)}********` : "********"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-[#171717] hover:text-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Edit user"
                                        onClick={() => handleEdit(item)}
                                        disabled={!userId}
                                    >
                                        <RiEditBoxFill size={24} className="inline-block" />
                                        <span className="ml-1 text-[18px] font-semibold">Edit</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-[#171717] hover:text-[#ea384c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleDelete(item)}
                                        aria-label="Delete user"
                                        disabled={!userId}
                                    >
                                        <RiDeleteBin6Line size={24} className="inline-block" />
                                        <span className="ml-1 text-[18px] font-semibold">Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserCard;
