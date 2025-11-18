# 🗺️ Routing System Explanation

## Overview
Your application uses **React Router v6** with a multi-layered routing architecture that includes:
- Public routes (authentication)
- Protected routes (with permission-based access control)
- Nested routes (layouts with sub-routes)
- Route guards (authentication & authorization)

---

## 📁 File Structure

```
src/
├── main.jsx              # Entry point - Sets up BrowserRouter
├── App.jsx               # Main routing configuration
├── protectedRoutes.jsx   # Route protection logic (permissions)
├── routes.jsx            # Route definitions for Dashboard
└── layouts/
    ├── dashboard.jsx     # Dashboard layout with nested routes
    ├── auth.jsx          # Auth layout with nested routes
    └── EmployeeDashboard.jsx  # Employee layout with nested routes
```

---

## 🔄 Routing Flow

### 1. **Entry Point** (`main.jsx`)
```jsx
<BrowserRouter>           // Enables routing
  <Provider store={store}> // Redux store
    <PersistGate>         // Persists Redux state
      <App />             // Main app component
    </PersistGate>
  </Provider>
</BrowserRouter>
```

**What it does:**
- Wraps the app with `BrowserRouter` to enable client-side routing
- Provides Redux store for state management
- Persists user data in localStorage

---

### 2. **Main App Router** (`App.jsx`)

The `App.jsx` file defines **three types of routes**:

#### **A. Public Routes** (No authentication required)
```jsx
<Route path="/LoginAsVendor" element={<LoginAsVendor />} />
<Route path="/account/*" element={<Auth />} />           // Nested auth routes
<Route path="/account/logout" element={<Logout />} />
<Route path="/" element={<Navigate to="/account/sign-in" replace />} />
```

**Accessible to:** Everyone (unauthenticated users)

#### **B. Protected Routes** (Currently commented out)
```jsx
{/* <Route element={<ProtectedRoute />}> */}
  <Route path="/dashboard/*" element={<Dashboard />} />
  <Route path="/vehicleManagement" element={<VehicleManagement />} />
  // ... other protected routes
{/* </Route> */}
```

**Note:** The `ProtectedRoute` wrapper is currently **commented out**, so all routes are accessible without authentication checks.

#### **C. 404 Route** (Catch-all)
```jsx
<Route path="*" element={<Navigate to="/LoginAsVendor" replace />} />
```

**What it does:** Redirects any unknown route to the login page

---

### 3. **Nested Routing** (Layout-based)

#### **Dashboard Layout** (`/dashboard/*`)
```jsx
<Route path="/dashboard/*" element={<Dashboard />} />
```

**Inside `dashboard.jsx`:**
- Renders sidebar navigation (`Sidenav`)
- Renders navbar (`DashboardNavbar`)
- Defines nested routes from `routes.jsx`:
  - `/dashboard/home` → Home component
  - `/dashboard/manage` → Manage component
  - `/dashboard/route-schedules` → Schedule component
  - `/dashboard/communication` → Communication component
  - etc.

**How it works:**
- The `*` in `/dashboard/*` means "match any path starting with /dashboard"
- Inside `Dashboard` component, it uses `<Routes>` again to match sub-paths
- Routes are dynamically generated from `routes.jsx` file

#### **Auth Layout** (`/account/*`)
```jsx
<Route path="/account/*" element={<Auth />} />
```

**Inside `auth.jsx`:**
- Defines authentication routes:
  - `/account/sign-in` → SignIn component
  - `/account/sign-up` → SignUp component
  - `/account/forgot-password` → ForgotPassword component

#### **Employee Dashboard Layout** (`/EmployeeDashboard/*`)
```jsx
<Route path="/EmployeeDashboard/*" element={<EmployeeManagementRoutes />} />
```

**Inside `EmployeeDashboard.jsx`:**
- Defines employee-specific routes:
  - `/EmployeeDashboard/` → Login
  - `/EmployeeDashboard/home` → Home
  - `/EmployeeDashboard/profileInformation` → Profile
  - `/EmployeeDashboard/employeePayroll` → Payroll
  - etc.

---

### 4. **Route Protection** (`protectedRoutes.jsx`)

**Current Status:** ⚠️ **DISABLED** (authentication checks are commented out)

**How it works when enabled:**

```jsx
<Route element={<ProtectedRoute />}>
  {/* All routes inside are protected */}
</Route>
```

**Protection Logic:**

1. **Authentication Check:**
   ```jsx
   if (!token || !user) {
     return <Navigate to="/LoginAsVendor" replace />;
   }
   ```

2. **Token Expiration Check:**
   ```jsx
   if (decoded.exp < currentTime) {
     return <Navigate to="/LoginAsVendor" replace />;
   }
   ```

3. **Permission-Based Access:**
   - Maps URL paths to backend modules (e.g., `/vehicleManagement` → `VEHICLE` module)
   - Checks if user has `canRead: true` for that module
   - For write operations (e.g., `/edit-`, `/add-`), checks `canWrite: true`
   - Users with `control: "READ_WRITE"` get full access

4. **Safe Routes** (No permission check):
   - `/dashboard`
   - `/dashboard_subscription`
   - `/subscription_page`
   - `/payment_success`
   - `/unauthorized`

---

## 🔍 Route Matching Process

### Example: User navigates to `/vehicleManagement`

1. **App.jsx** checks routes:
   - ✅ Matches: `<Route path="/vehicleManagement" element={<VehicleManagement />} />`
   - Renders `VehicleManagement` component

2. **If ProtectedRoute was enabled:**
   - `ProtectedRoute` checks authentication
   - Extracts path segment: `VEHICLEMANAGEMENT`
   - Maps to module: `VEHICLE`
   - Checks user permissions: `user.modules.VEHICLE.canRead`
   - If allowed → renders `<Outlet />` (which renders `VehicleManagement`)
   - If denied → redirects to `/unauthorized`

---

## 📊 Route-to-Module Mapping

The `protectedRoutes.jsx` file maps URL paths to backend permission modules:

```jsx
const routeToModuleMap = {
  VEHICLEMANAGEMENT: "VEHICLE",
  DRIVERMANAGEMENT: "DRIVER",
  EMPLOYEEMANAGEMENT: "EMPLOYEE",
  SCHOOLMANAGEMENT: "SCHOOL",
  STUDENTMANAGEMENT: "STUDENT",
  ROUTEMANAGEMENT: "ROUTE",
  REALTIMETRACKING: "TRACKING",
  ROUTESCHEDULE: "SCHEDULING",
  BILLINGINVOICE: "ACCOUNTING",
  ACCESSMANAGEMENT: "ACCESS",
  VENDORCHAT: "CHATS",
  // ... etc
};
```

**Why this mapping?**
- URLs use kebab-case: `/vehicle-management`
- Backend uses uppercase: `VEHICLE`
- This mapping bridges the gap

---

## 🎯 Key Concepts

### **Outlet Component**
- Used in `ProtectedRoute` to render child routes
- Acts as a placeholder for nested route content
- Only renders if all checks pass

### **Navigate Component**
- Programmatically redirects users
- Used for:
  - Redirecting unauthenticated users to login
  - Redirecting unauthorized users to `/unauthorized`
  - Default route (`/` → `/account/sign-in`)

### **Nested Routes**
- Routes can be nested using `/*` wildcard
- Parent route renders layout
- Child routes render specific pages
- Example: `/dashboard/*` → Dashboard layout → `/dashboard/home` → Home page

### **Route Guards**
- `ProtectedRoute` acts as a guard
- Checks authentication before rendering
- Checks permissions before allowing access
- Redirects if checks fail

---

## 🚨 Current Issues

1. **ProtectedRoute is Disabled:**
   - All authentication/permission checks are commented out
   - Routes are accessible without login
   - **To enable:** Uncomment the checks in `protectedRoutes.jsx`

2. **Route Organization:**
   - Some routes are defined in `App.jsx`
   - Some routes are defined in `routes.jsx`
   - Could be better organized

3. **Missing ProtectedRoute Wrapper:**
   - In `App.jsx`, the `<Route element={<ProtectedRoute />}>` wrapper is commented out
   - Private routes are not actually protected

---

## 💡 How to Enable Route Protection

1. **Uncomment authentication checks in `protectedRoutes.jsx`:**
   ```jsx
   if (!token || !user) {
     return <Navigate to="/LoginAsVendor" replace />;
   }
   ```

2. **Uncomment ProtectedRoute wrapper in `App.jsx`:**
   ```jsx
   <Route element={<ProtectedRoute />}>
     {/* All private routes here */}
   </Route>
   ```

3. **Test with different user permissions**

---

## 📝 Summary

**Routing Architecture:**
```
BrowserRouter (main.jsx)
  └── App (App.jsx)
      ├── Public Routes (/LoginAsVendor, /account/*)
      ├── Protected Routes (wrapped in ProtectedRoute - currently disabled)
      │   ├── Dashboard Layout (/dashboard/*)
      │   │   └── Nested Routes (from routes.jsx)
      │   ├── Employee Layout (/EmployeeDashboard/*)
      │   │   └── Nested Routes (employee-specific)
      │   └── Direct Routes (/vehicleManagement, etc.)
      └── 404 Route (*)
```

**Flow:**
1. User navigates to URL
2. `App.jsx` matches route
3. If protected, `ProtectedRoute` checks auth/permissions
4. If allowed, renders component
5. If denied, redirects to login/unauthorized

