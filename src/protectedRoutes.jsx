import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute() {
  const { user, token } = useSelector((state) => state.user);
  const location = useLocation();

  // 🔒 Check authentication
  // if (!token || !user) {
  //   return <Navigate to="/LoginAsVendor" replace />;
  // }

  // 🔒 Validate token expiration
  // try {
  //   const decoded = jwtDecode(token);
  //   const currentTime = Date.now() / 1000;

  //   if (decoded.exp && decoded.exp < currentTime) {
  //     console.warn("Token expired");
  //     return <Navigate to="/LoginAsVendor" replace />;
  //   }
  // } catch (error) {
  //   console.error("Invalid token:", error);
  //   return <Navigate to="/LoginAsVendor" replace />;
  // }

  // Extract path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0]?.toUpperCase() || "";
  const fullPath = location.pathname.toLowerCase();

  // 🔹 Define route-to-module mapping (comprehensive)
  const routeToModuleMap = {
    // Vehicle Management
    VEHICLEMANAGEMENT: "VEHICLE",
    "VEHICLE-MANAGEMENT": "VEHICLE",
    "VEHICLE_INFO": "VEHICLE",
    "VEHICLE-INFO": "VEHICLE",
    "REPAIR-SCHEDULE": "VEHICLE",
    "REPAIRSCHEDULE": "VEHICLE",
    "EDIT-SCHEDULED-MAINTENANCE": "VEHICLE",
    "REPORTED-DEFECTS": "VEHICLE",
    NOTES: "VEHICLE", // vehicle notes

    // Driver Management
    DRIVERMANAGEMENT: "DRIVER",
    "DRIVER-MANAGEMENT": "DRIVER",

    // Employee Management
    EMPLOYEEMANAGEMENT: "EMPLOYEE",
    "EMPLOYEE-MANAGEMENT": "EMPLOYEE",
    EMPLOYEEDASHBOARD: "EMPLOYEE",
    "EMPLOYEE-DASHBOARD": "EMPLOYEE",

    // School Management
    SCHOOLMANAGEMENT: "SCHOOL",
    "SCHOOL-MANAGEMENT": "SCHOOL",

    // Student Management
    STUDENTMANAGEMENT: "STUDENT",
    "STUDENT-MANAGEMENT": "STUDENT",

    // Route Management
    ROUTEMANAGEMENT: "ROUTE",
    "ROUTE-MANAGEMENT": "ROUTE",

    // Real-time Tracking
    REALTIMETRACKING: "TRACKING",
    "REAL-TIME-TRACKING": "TRACKING",
    "REALTIME-TRACKING": "TRACKING",

    // Scheduling
    ROUTESCHEDULE: "SCHEDULING",
    "ROUTE-SCHEDULE": "SCHEDULING",
    SCHEDULEMANAGEMENT: "SCHEDULING",
    "SCHEDULE-MANAGEMENT": "SCHEDULING",

    // Accounting
    BILLINGINVOICE: "ACCOUNTING",
    "BILLING-INVOICE": "ACCOUNTING",
    GLCODES: "ACCOUNTING",
    "GL-CODES": "ACCOUNTING",
    ACCOUNTING: "ACCOUNTING",

    // Access Management
    ACCESSMANAGEMENT: "ACCESS",
    "ACCESS-MANAGEMENT": "ACCESS",

    // Communication
    VENDORCHAT: "CHATS",
    "VENDOR-CHAT": "CHATS",
    NOTIFICATION: "CHATS", // or create separate NOTIFICATION module

    // Feedback
    FEEDBACK: "FEEDBACK", // or map to existing module

    // Documents
    DOCUMENTS: "DOCUMENTS", // or map to existing module
  };

  // 🔹 Routes that don't require module permissions (safe routes)
  const safeRoutes = [
    "DASHBOARD",
    "DASHBOARD_SUBSCRIPTION",
    "SUBSCRIPTION_PAGE",
    "PAYMENT_SUCCESS",
    "PAYMENT-SUCCESS",
    "UNAUTHORIZED", // Allow access to unauthorized page for authenticated users
  ];

  // Check if route is safe (no permission check needed)
  if (safeRoutes.includes(firstSegment)) {
    return <Outlet />;
  }

  // Map route to module
  const moduleKey = routeToModuleMap[firstSegment] ||
    routeToModuleMap[location.pathname.replace(/\//g, "_").toUpperCase()] ||
    firstSegment;

  // Get module permissions - user.modules is an object like { "VEHICLE": { canRead: true, canWrite: false } }
  // Try to find module with case-insensitive matching
  const userModules = user?.modules || {};
  const moduleKeys = Object.keys(userModules);
  
  // Try exact match first
  let moduleAccess = userModules[moduleKey];
  
  // If not found, try case-insensitive match
  if (!moduleAccess) {
    const foundKey = moduleKeys.find(key => key.toUpperCase() === moduleKey.toUpperCase());
    if (foundKey) {
      moduleAccess = userModules[foundKey];
      if (import.meta.env.DEV) {
        console.log(`⚠️ Module key case mismatch: Looking for '${moduleKey}', found '${foundKey}'`);
      }
    }
  }

  // Debug logging (always show in dev, or if access is denied)
  if (import.meta.env.DEV || !moduleAccess) {
    console.log("🔍 Route Protection Debug:", {
      path: location.pathname,
      firstSegment,
      moduleKey,
      userModules: userModules,
      moduleKeys: moduleKeys,
      moduleAccess,
      userControl: user?.control,
      fullUser: user,
    });
  }

  // 🔒 Check read permission
  // ✅ Require explicit canRead: true to allow access
  // ✅ Block if module doesn't exist OR canRead is false/undefined
  // ✅ Exception: If user has global READ_WRITE and no modules defined, allow access (user has all rights)
  if (!moduleAccess || moduleAccess === null || moduleAccess === undefined) {
    // Check if user has global READ_WRITE control (has all rights)
    const hasGlobalWrite = user?.control === "READ_WRITE";
    const hasNoModules = moduleKeys.length === 0;
    
    if (hasGlobalWrite && hasNoModules) {
      // User has all rights and no specific modules defined - allow access
      if (import.meta.env.DEV) {
        console.log(`✅ Allowing access: User has global READ_WRITE control and no modules defined (all rights)`);
      }
      // Allow access - user has all rights
    } else {
      // Module doesn't exist and user doesn't have all rights - block access
      console.warn(`🚫 Access denied: Module '${moduleKey}' not found in user permissions at path '${location.pathname}'`);
      console.warn("Available module keys:", moduleKeys);
      console.warn("Looking for module key:", moduleKey);
      console.warn("User control:", user?.control);
      return <Navigate to="/unauthorized" replace />;
    }
  } else {
    // Module exists - check canRead permission (must be explicitly true)
    if (moduleAccess.canRead !== true) {
      // Check if user has global READ_WRITE as fallback
      const hasGlobalWrite = user?.control === "READ_WRITE";
      if (!hasGlobalWrite) {
        console.warn(`🚫 Access denied: Module '${moduleKey}' has canRead: ${moduleAccess.canRead} (required: true) at path '${location.pathname}'`);
        return <Navigate to="/unauthorized" replace />;
      } else {
        // User has global READ_WRITE - allow access even if module canRead is false
        if (import.meta.env.DEV) {
          console.log(`✅ Allowing access: User has global READ_WRITE control (all rights)`);
        }
      }
    }
    // If canRead is true, allow access
  }

  // 🔒 Check write permission for write operations
  // More specific patterns to avoid false positives
  const writePatterns = [
    /\/add-/i,
    /\/create-/i,
    /\/edit-/i,
    /\/update-/i,
    /\/delete-/i,
    /\/new-/i,
    /-add$/i,
    /-create$/i,
    /-edit$/i,
    /-update$/i,
    /-delete$/i,
    /-new$/i,
  ];

  const isWriteOperation = writePatterns.some(pattern => pattern.test(fullPath));

  // Check write permission: require explicit canWrite: true or global READ_WRITE
  if (isWriteOperation) {
    // Check module-level write permission first
    const hasModuleWrite = moduleAccess?.canWrite === true;

    // If module doesn't have explicit write permission, check global control
    if (!hasModuleWrite) {
      const hasGlobalWrite = user?.control === "READ_WRITE";
      if (!hasGlobalWrite) {
        console.warn(`Write blocked: No write permission for module '${moduleKey}' at path '${location.pathname}'`);
        return <Navigate to="/unauthorized" replace />;
      }
    }
    // If hasModuleWrite is true OR hasGlobalWrite is true, allow access
  }

  return <Outlet />;
}
