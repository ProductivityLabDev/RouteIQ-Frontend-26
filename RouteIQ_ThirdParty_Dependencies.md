# RouteIQ Frontend — Third-Party Dependencies Complete Reference

> **Purpose:** Har third-party library ka detailed overview, reason, aur project mein use ka location.
> **Project:** RouteIQ Frontend v2.1.0
> **Date:** March 2026

---

## TABLE OF CONTENTS

1. [Core Framework & Build Tools](#1-core-framework--build-tools)
2. [State Management](#2-state-management)
3. [Routing](#3-routing)
4. [HTTP Client & API Communication](#4-http-client--api-communication)
5. [Real-Time Communication](#5-real-time-communication)
6. [UI Component Libraries](#6-ui-component-libraries)
7. [Styling & CSS Utilities](#7-styling--css-utilities)
8. [Icons](#8-icons)
9. [Charts & Data Visualization](#9-charts--data-visualization)
10. [Maps & Geolocation](#10-maps--geolocation)
11. [Date & Time Utilities](#11-date--time-utilities)
12. [Forms & User Input](#12-forms--user-input)
13. [Notifications & Feedback](#13-notifications--feedback)
14. [Authentication & Security](#14-authentication--security)
15. [Type Safety & Code Quality](#15-type-safety--code-quality)
16. [Missing / Recommended Libraries (Not Yet Installed)](#16-missing--recommended-libraries-not-yet-installed)

---

## 1. CORE FRAMEWORK & BUILD TOOLS

---

### 1.1 `react` v18.3.1
**Category:** Core Framework
**Package:** `react`

**Kya hai:**
React ek JavaScript UI library hai jo component-based architecture use karti hai. Virtual DOM ke zariye efficient re-rendering hoti hai.

**Kyun zaroorat hai:**
Poora project React par built hai. Har page, har component, har modal — sab React components hain.

**Kahan use hoga:**
- Har `.jsx` aur `.tsx` file mein
- `src/pages/`, `src/components/`, `src/layouts/`, `src/widgets/` — sab jagah

---

### 1.2 `react-dom` v18.3.1
**Category:** Core Framework
**Package:** `react-dom`

**Kya hai:**
React ka browser-specific package jo virtual DOM ko actual HTML DOM mein render karta hai.

**Kyun zaroorat hai:**
`ReactDOM.createRoot()` se app browser mein mount hoti hai. Modals ke liye `createPortal()` bhi yahan se aata hai.

**Kahan use hoga:**
- `src/main.jsx` — app entry point
- `src/components/Modals/` — portal-based modals ke liye

---

### 1.3 `vite` v5.3.3
**Category:** Build Tool
**Package:** `vite` (devDependency)

**Kya hai:**
Modern, fast JavaScript bundler aur dev server. Webpack se kaafi tez hai, especially HMR (Hot Module Replacement) mein.

**Kyun zaroorat hai:**
- Development mein instant server start
- Production build optimize karta hai
- Environment variables (`.env`) handle karta hai
- `VITE_API_URL`, `VITE_GOOGLE_MAPS_API_KEY` jaise env vars ka access

**Kahan use hoga:**
- `vite.config.js` — build configuration
- `index.html` — entry HTML file
- `.env` — environment variables

---

### 1.4 `@vitejs/plugin-react` v4.3.1
**Category:** Build Tool Plugin
**Package:** `@vitejs/plugin-react` (devDependency)

**Kya hai:**
Vite ka official React plugin jo JSX transform, Fast Refresh, aur Babel integration provide karta hai.

**Kyun zaroorat hai:**
Bina is plugin ke Vite React JSX ko nahi samajh sakta. Fast Refresh developer experience ke liye critical hai.

**Kahan use hoga:**
- `vite.config.js` mein configure hota hai
- Automatically sab `.jsx`/`.tsx` files par apply hota hai

---

### 1.5 `react-scripts` v5.0.1
**Category:** Build Tool (Legacy)
**Package:** `react-scripts`

**Kya hai:**
Create React App (CRA) ka build/test toolkit.

**Kyun zaroorat hai (aur kya problem hai):**
Project mein listed hai lekin **Vite use ho raha hai** primary build tool ke taur par. Yeh legacy dependency hai. Ise hata dena chahiye — confusion aur bundle size dono ke liye unnecessary hai.

**Recommendation:** `react-scripts` ko package.json se remove karo, sirf Vite rakho.

---

## 2. STATE MANAGEMENT

---

### 2.1 `@reduxjs/toolkit` v2.10.1
**Category:** State Management
**Package:** `@reduxjs/toolkit`

**Kya hai:**
Redux ka official, opinionated toolset. `createSlice`, `createAsyncThunk`, `createEntityAdapter` — sab included hain. Boilerplate dramatically kam karta hai.

**Kyun zaroorat hai:**
Project mein **22 Redux slices** hain across multiple modules:
- Financial data (payroll, invoices, accounts)
- Operational data (routes, buses, schedules)
- User/auth state
- Dashboard data

Itna complex state management pure React Context se handle karna impossible tha.

**Kahan use hoga:**
- `src/redux/store.ts` — store configuration
- `src/redux/slices/` — 22 slice files:
  - `userSlice`, `usersSlice`
  - `busesSlice`, `routesSlice`
  - `payrollSlice`
  - `accountsPayableSlice`, `accountsReceivableSlice`
  - `schoolInvoicesSlice`, `tripInvoicesSlice`
  - `balanceSheetSlice`, `incomeStatementSlice`
  - `chatSlice`, `notificationsSlice`
  - `vendorDashboardSlice`, `schoolDashboardSlice`, `employeeDashboardSlice`
  - aur 6 more slices

---

### 2.2 `react-redux` v9.2.0
**Category:** State Management (React Bindings)
**Package:** `react-redux`

**Kya hai:**
Redux ko React ke saath connect karta hai. `useSelector`, `useDispatch` hooks provide karta hai.

**Kyun zaroorat hai:**
Redux store ke bina React components state access nahi kar saktay. Yeh bridge hai Redux aur React ke darmiyan.

**Kahan use hoga:**
- Har component jo Redux state read/write karta hai
- `src/components/FinancialDashboard.jsx`
- `src/pages/accounting/Accounting.jsx`
- `src/pages/payroll/` ke sab components
- `src/components/vendorRoutesCard/` components

---

### 2.3 `redux-persist` v6.0.0
**Category:** State Persistence
**Package:** `redux-persist`

**Kya hai:**
Redux state ko browser localStorage/sessionStorage mein persist karta hai. App reload hone par state maintain rehti hai.

**Kyun zaroorat hai:**
- **User authentication state** — page refresh par user logged out nahi hona chahiye
- **Employee dashboard data** — `dashboardData` aur `lastPunchStatus` persist hote hain
- Without this, har refresh par user ko dobara login karna padta

**Kahan use hoga:**
- `src/redux/store.ts` — `persistReducer` aur `persistStore` configuration
- `src/main.jsx` — `PersistGate` wrapper
- Persisted slices: `user`, `employeeDashboard` (selective keys)

---

## 3. ROUTING

---

### 3.1 `react-router-dom` v6.24.1
**Category:** Client-Side Routing
**Package:** `react-router-dom`

**Kya hai:**
React ka most popular routing library. URL-based navigation, nested routes, protected routes, aur lazy loading support karta hai.

**Kyun zaroorat hai:**
RouteIQ ek **multi-role, multi-dashboard** application hai:
- Vendor Dashboard (`/vendor/...`)
- School Dashboard (`/school/...`)
- Employee Dashboard (`/employee/...`)
- Auth pages (`/sign-in`, `/sign-up`)
- 20+ separate pages

Bina routing ke yeh sab pages manage karna impossible hai.

**Kahan use hoga:**
- `src/main.jsx` — `BrowserRouter` setup
- `src/components/routes/` — `ProtectedRoute`, `PublicRoute` components
- Har page component mein `useNavigate`, `useParams`, `useLocation`
- `src/App.jsx` ya main router file — all route definitions

**Key features used:**
- `<Routes>` aur `<Route>` — page mapping
- `<Navigate>` — redirects
- `<Outlet>` — nested layout rendering
- `useNavigate()` — programmatic navigation
- `useParams()` — URL parameters (e.g., `/route/:id`)
- Protected routes — permission-based access

---

## 4. HTTP CLIENT & API COMMUNICATION

---

### 4.1 `axios` v1.13.1
**Category:** HTTP Client
**Package:** `axios`

**Kya hai:**
Promise-based HTTP client for browser aur Node.js. Fetch API se better features provide karta hai.

**Kyun zaroorat hai:**
**25+ API services** hain jo backend se data fetch karte hain:
- Custom interceptors for JWT token refresh
- Automatic request/response transformation
- Error handling centrally
- `credentials: 'include'` for cookies

**Kahan use hoga:**
- `src/configs/` — Axios instance configuration (base URL, headers, interceptors)
- **Every service file** in `src/services/`:
  - `userService.ts`, `employeeService.ts`, `vendorService.ts`
  - `payrollService.ts`, `schoolInvoicesService.ts`, `tripInvoicesService.ts`
  - `accountsPayableService.ts`, `accountsReceivableService.ts`
  - `balanceSheetService.ts`, `incomeStatementService.ts`
  - `routeService.ts`, `busService.ts`, `trackingService.ts`
  - `chatService.ts`, `notificationService.ts`
  - aur 10+ more services

**Key features used:**
- `axios.create()` — custom instance with base URL
- Request interceptors — JWT token attach karna
- Response interceptors — 401 par token refresh
- `withCredentials: true` — cookies ke liye

---

### 4.2 `js-cookie` v3.0.5
**Category:** Cookie Management
**Package:** `js-cookie`

**Kya hai:**
Browser cookies ko read/write/delete karne ka simple API.

**Kyun zaroorat hai:**
- JWT access token aur refresh token cookies mein store hote hain
- Axios interceptors mein cookie se token read karna hota hai
- Logout par cookies clear karna hota hai

**Kahan use hoga:**
- `src/configs/` — Axios interceptors (token read karna)
- `src/services/userService.ts` — login/logout
- `src/components/routes/ProtectedRoute.jsx` — auth check

---

## 5. REAL-TIME COMMUNICATION

---

### 5.1 `socket.io-client` v4.8.3
**Category:** WebSocket / Real-Time
**Package:** `socket.io-client`

**Kya hai:**
Socket.IO ka browser client. WebSocket protocol use karta hai real-time bidirectional communication ke liye.

**Kyun zaroorat hai:**
RouteIQ mein multiple real-time features hain:
1. **Live GPS Tracking** — bus locations real-time update hoti hain map par
2. **Chat System** — vendor-to-vendor ya vendor-to-school instant messaging
3. **Notifications** — push notifications real-time deliver hoti hain
4. **Trip Status Updates** — trip start/end/delay real-time broadcast

**Kahan use hoga:**
- `src/hooks/` — custom `useSocket` hook ya similar
- `src/services/chatService.ts` — real-time messages send/receive
- `src/services/trackingService.ts` — GPS location updates
- `src/services/notificationService.ts` — real-time notifications
- `src/components/Map.jsx` / `MapComponent.jsx` — live bus position updates
- `src/components/ChatPanel.jsx`, `ChatMessage.jsx` — live chat UI

**Events used (estimated):**
- `connect` / `disconnect`
- `message:send`, `message:receive`
- `location:update`
- `notification:new`
- `trip:status`

---

## 6. UI COMPONENT LIBRARIES

---

### 6.1 `@mui/material` v5.16.6
**Category:** UI Components
**Package:** `@mui/material`

**Kya hai:**
Google Material Design ka React implementation. Pre-built, accessible, customizable components ka complete set.

**Kyun zaroorat hai:**
Complex UI components jo scratch se banana time-consuming hai:
- Data Tables with sorting/filtering
- Dialog/Modal components
- Form inputs with validation states
- Tabs, Accordion, Drawer
- Date/Time pickers (backup)

**Kahan use hoga:**
- `src/pages/accounting/Accounting.jsx` — 10-tab interface (Tabs component)
- `src/components/FinancialDashboard.jsx` — dashboard cards/tables
- `src/components/Modals/` — dialog components
- `src/pages/payroll/` — complex form inputs
- `src/pages/vehicle-management/` — data tables

**Dependencies (automatically installed with MUI):**
- `@emotion/react` — required styling engine
- `@emotion/styled` — styled components

---

### 6.2 `@emotion/react` v11.13.0 & `@emotion/styled` v11.13.0
**Category:** CSS-in-JS (MUI Dependency)
**Package:** `@emotion/react`, `@emotion/styled`

**Kya hai:**
CSS-in-JS library. MUI internally use karta hai styling ke liye.

**Kyun zaroorat hai:**
MUI v5 ka styling engine Emotion hai. Bina Emotion ke MUI work nahi karta.

**Kahan use hoga:**
- MUI components ke through automatically
- Custom MUI theme overrides mein
- `src/configs/` — MUI theme configuration (agar hai)

---

### 6.3 `@material-tailwind/react` v2.1.9
**Category:** UI Components
**Package:** `@material-tailwind/react`

**Kya hai:**
Material Design + Tailwind CSS ka combination. Tailwind classes ke saath Material-styled components.

**Kyun zaroorat hai:**
MUI ke saath coexist karta hai. Kuch components (buttons, cards, badges) Material Tailwind se use kiye gaye hain jo pure Tailwind se better styled hain.

**Kahan use hoga:**
- Various card components in `src/components/customCards/`
- Dashboard header components
- Button variants in `src/components/buttons/`

**Note:** Agar project sirf ek UI library par standardize karna ho, toh ya pure MUI rakho ya Material Tailwind — dono saath rakhne se bundle size barhti hai.

---

### 6.4 `react-modal` v3.16.3
**Category:** Modal Component
**Package:** `react-modal`

**Kya hai:**
Accessible modal dialog component. Keyboard navigation, focus trap, aria attributes sab built-in hain.

**Kyun zaroorat hai:**
Project mein bahut saare modals hain:
- Invoice creation/editing modals
- Pay stub modal
- Confirmation dialogs
- Document upload modals

**Kahan use hoga:**
- `src/components/Modals/` — sab modal components
- `src/components/vendorRoutesCard/` — route detail modals
- Pay stub modal in payroll section
- Wallet transaction modals

---

## 7. STYLING & CSS UTILITIES

---

### 7.1 `tailwindcss` v3.4.4
**Category:** CSS Framework
**Package:** `tailwindcss` (devDependency)

**Kya hai:**
Utility-first CSS framework. Pre-defined CSS classes ko directly HTML mein use karo, custom CSS likhne ki zaroorat nahi.

**Kyun zaroorat hai:**
- Rapid UI development
- Consistent spacing, colors, typography
- Responsive design (`sm:`, `md:`, `lg:` breakpoints)
- Dark mode support (agar implement ho)

**Kahan use hoga:**
- Har JSX component mein `className` attribute mein
- `tailwind.config.cjs` — custom colors, fonts, breakpoints
- Almost every component file

---

### 7.2 `autoprefixer` v10.4.19
**Category:** CSS Post-Processing
**Package:** `autoprefixer` (devDependency)

**Kya hai:**
CSS mein automatically vendor prefixes add karta hai (`-webkit-`, `-moz-`, etc.) cross-browser compatibility ke liye.

**Kyun zaroorat hai:**
Modern CSS features automatically sab browsers mein work karein.

**Kahan use hoga:**
- `postcss.config.cjs` — automatically configured
- Build process mein automatically run hota hai

---

### 7.3 `postcss` v8.4.39
**Category:** CSS Toolchain
**Package:** `postcss` (devDependency)

**Kya hai:**
CSS transformation tool. Tailwind aur Autoprefixer dono PostCSS plugins hain.

**Kyun zaroorat hai:**
Tailwind CSS ko process karna PostCSS ke bina possible nahi.

**Kahan use hoga:**
- `postcss.config.cjs` — configuration file
- Build process mein automatically

---

## 8. ICONS

---

### 8.1 `@heroicons/react` v2.1.4
**Category:** Icons
**Package:** `@heroicons/react`

**Kya hai:**
Tailwind CSS team ka official icon set. SVG icons React components ke roop mein. Solid aur Outline variants available hain.

**Kyun zaroorat hai:**
Navigation icons, action buttons, status indicators ke liye clean, consistent icons chahiye.

**Kahan use hoga:**
- Navigation menu icons
- Button icons (add, edit, delete, download)
- Status indicators
- `src/components/MenuComponent.jsx`

---

### 8.2 `lucide-react` v0.511.0
**Category:** Icons
**Package:** `lucide-react`

**Kya hai:**
Open-source icon library. 1000+ SVG icons, consistent design language.

**Kyun zaroorat hai:**
Heroicons mein jo icons nahi hain woh Lucide mein mil jaate hain. Financial icons (wallet, receipt, etc.) Lucide mein zyada hain.

**Kahan use hoga:**
- `src/components/FinancialDashboard.jsx` — financial icons
- Accounting module tabs icons
- Payroll section icons

---

### 8.3 `react-icons` v5.2.1
**Category:** Icons
**Package:** `react-icons`

**Kya hai:**
Multiple icon libraries ka wrapper (Font Awesome, Material Icons, Feather, Bootstrap Icons, etc.) ek package mein.

**Kyun zaroorat hai:**
Specific icons jo Heroicons ya Lucide mein nahi hain (Font Awesome ke kuch unique icons, etc.)

**Kahan use hoga:**
- Various components throughout the app
- Especially where brand icons (social media, etc.) needed hain

**Note:** Teen alag icon libraries use karna bundle size barhata hai. Consider karo ek par standardize karna — `lucide-react` best choice hai (lightest, most complete).

---

## 9. CHARTS & DATA VISUALIZATION

---

### 9.1 `apexcharts` v3.50.0 & `react-apexcharts` v1.4.1
**Category:** Data Visualization
**Package:** `apexcharts`, `react-apexcharts`

**Kya hai:**
Feature-rich, interactive chart library. 20+ chart types support karta hai.

**Kyun zaroorat hai:**
Financial dashboards mein complex charts:
- Revenue trends (line charts)
- Income vs Expense (bar charts)
- Route performance (area charts)
- Payroll breakdown (pie/donut charts)

**Key features:**
- Zoom & pan
- Tooltips
- Animations
- Export to PNG/CSV

**Kahan use hoga:**
- `src/components/FinancialDashboard.jsx`
- `src/pages/accounting/Accounting.jsx` — income statement charts
- `src/components/EmployeeInsightsDashboards.jsx`
- `src/components/KPIScreen.jsx`
- `src/configs/` — chart configurations

---

### 9.2 `recharts` v2.15.2
**Category:** Data Visualization
**Package:** `recharts`

**Kya hai:**
React-specific charting library. D3.js par built, React components ke roop mein charts.

**Kyun zaroorat hai:**
ApexCharts ke parallel use ho raha hai. Kuch simple charts (sparklines, small KPI charts) ke liye Recharts lighter hai.

**Kahan use hoga:**
- `src/components/vendorRoutesCard/` — route performance mini-charts
- Dashboard KPI widgets
- School dashboard charts

**Note:** Dono chart libraries use karna bundle size significantly barhata hai (~500KB+). Ek par standardize karna chahiye — **ApexCharts** rakho, Recharts hata do.

---

## 10. MAPS & GEOLOCATION

---

### 10.1 `@react-google-maps/api` v2.19.3
**Category:** Maps & Geolocation
**Package:** `@react-google-maps/api`

**Kya hai:**
Google Maps JavaScript API ka official React wrapper. Maps, Markers, Routes, Polygons sab React components ke roop mein.

**Kyun zaroorat hai:**
RouteIQ ek **transportation management system** hai — Maps central feature hain:
- **Real-time bus tracking** — live GPS position show karna
- **Route visualization** — routes map par draw karna
- **Trip planning** — source to destination path
- **Student pickup points** — stop locations mark karna
- **School locations** — school map par show karna

**Kahan use hoga:**
- `src/components/Map.jsx` — main map component
- `src/components/MapComponent.jsx` — reusable map wrapper
- `src/pages/real-time-tracking/` — live tracking page
- `src/components/TripPlanner/` — trip planning with maps
- `src/pages/route-management/` — route creation with map

**Required API Keys:**
- `VITE_GOOGLE_MAPS_API_KEY` in `.env`
- Google Maps Platform mein enable karne wali APIs:
  - Maps JavaScript API
  - Directions API
  - Geocoding API
  - Places API

---

## 11. DATE & TIME UTILITIES

---

### 11.1 `date-fns` v3.6.0
**Category:** Date Utilities
**Package:** `date-fns`

**Kya hai:**
Modern JavaScript date utility library. Immutable, functional approach. Tree-shakeable (sirf jo import karo woh bundle mein jata hai).

**Kyun zaroorat hai:**
Financial module mein extensive date operations:
- Invoice due dates calculate karna
- Payroll period dates
- Date range filtering
- Date formatting for display

**Kahan use hoga:**
- `src/pages/accounting/Accounting.jsx`
- `src/services/payrollService.ts` — pay period calculations
- `src/services/schoolInvoicesService.ts` — invoice dates
- `src/components/` — date display formatting
- Chart date labels formatting

---

### 11.2 `dayjs` v1.11.13
**Category:** Date Utilities
**Package:** `dayjs`

**Kya hai:**
Lightweight Moment.js alternative. 2KB size, Moment.js jaisi API.

**Kyun zaroorat hai:**
Simple date formatting aur manipulation ke liye. date-fns se simpler API hai quick operations ke liye.

**Kahan use hoga:**
- `src/components/AnalogClock.jsx` — time display
- Various date display components
- Schedule-related components

**Note:** Dono `date-fns` aur `dayjs` use karna redundant hai. Ek par standardize karo — **date-fns** prefer karo (better TypeScript support, tree-shakeable).

---

## 12. FORMS & USER INPUT

---

### 12.1 `react-datepicker` v7.3.0
**Category:** Date Input
**Package:** `react-datepicker`

**Kya hai:**
Full-featured date/time picker component for React.

**Kyun zaroorat hai:**
- Invoice date selection
- Payroll period selection
- Route schedule dates
- Time off request dates

**Kahan use hoga:**
- `src/components/DatePicker.jsx` — custom wrapper component
- `src/components/InvoiceForm.jsx` — invoice dates
- `src/pages/route-schedule/` — schedule dates
- `src/pages/payroll/` — pay period selection

---

### 12.2 `react-day-picker` v8.10.1
**Category:** Date Input
**Package:** `react-day-picker`

**Kya hai:**
Flexible day picker, specially good for date ranges aur calendar views.

**Kyun zaroorat hai:**
Date range selection ke liye (e.g., report date ranges, schedule views).

**Kahan use hoga:**
- Reports date range filtering
- Accounting module date filters
- Scheduling calendar views

**Note:** `react-datepicker` aur `react-day-picker` dono similar purpose serve karte hain. Ek use karo, dusra remove karo.

---

### 12.3 `prop-types` v15.8.1
**Category:** Runtime Type Checking
**Package:** `prop-types`

**Kya hai:**
React component props ki runtime type checking. TypeScript alternative for JavaScript files.

**Kyun zaroorat hai:**
Project mein mixed JS/TS codebase hai. `.jsx` files mein prop-types use hote hain development-time validation ke liye.

**Kahan use hoga:**
- Sab `.jsx` component files mein (`.tsx` files mein TypeScript interfaces use hote hain)
- Development environment mein console warnings

---

## 13. NOTIFICATIONS & FEEDBACK

---

### 13.1 `react-hot-toast` v2.6.0
**Category:** Toast Notifications
**Package:** `react-hot-toast`

**Kya hai:**
Beautiful, customizable toast notification library for React.

**Kyun zaroorat hai:**
User ko feedback dena API operations par:
- Invoice create hone par success toast
- Error hone par error toast
- Payroll process hone par notification
- Route save hone par confirmation

**Kahan use hoga:**
- Har service call ke baad: `toast.success('Invoice created!')` ya `toast.error('Failed to create invoice')`
- `src/pages/` — almost every page
- `src/services/` — API error handling
- Globally: `<Toaster />` component `src/App.jsx` ya main layout mein

---

## 14. AUTHENTICATION & SECURITY

---

### 14.1 `jwt-decode` v4.0.0
**Category:** Authentication
**Package:** `jwt-decode`

**Kya hai:**
JWT (JSON Web Token) ko decode karta hai bina signature verify kiye. Token payload padhne ke liye.

**Kyun zaroorat hai:**
- Logged-in user ki info (role, id, name) JWT token se extract karna
- Token expiry check karna
- Role-based access control (vendor, school, employee, admin)
- Protected routes mein user role verify karna

**Kahan use hoga:**
- `src/services/userService.ts` — login response mein token decode
- `src/components/routes/ProtectedRoute.jsx` — role check
- `src/redux/slices/userSlice.js` — user info store karna
- `src/configs/` — Axios interceptor (token expiry check)

---

## 15. TYPE SAFETY & CODE QUALITY

---

### 15.1 `typescript` v5.7.2
**Category:** Type Safety
**Package:** `typescript` (devDependency)

**Kya hai:**
JavaScript ka typed superset. Compile-time type checking, better IDE support, fewer runtime bugs.

**Kyun zaroorat hai:**
- Service files (`.ts`) strongly typed hain
- API response types define karna
- Redux slice types
- Better developer experience

**Kahan use hoga:**
- `src/services/*.ts` — sab service files
- `src/redux/store.ts` — store types
- `src/redux/slices/*.ts` — typed slices
- `src/types/` — shared type definitions

---

### 15.2 `prettier` v3.3.2
**Category:** Code Formatting
**Package:** `prettier` (devDependency)

**Kya hai:**
Opinionated code formatter. Consistent code style enforce karta hai automatically.

**Kyun zaroorat hai:**
Team mein code style consistency ke liye. Prettier automatically format karta hai — debates khatam.

**Kahan use hoga:**
- `prettier.config.cjs` — configuration
- Pre-commit hooks (agar configured)
- VS Code save-on-format

---

### 15.3 `prettier-plugin-tailwindcss` v0.6.5
**Category:** Code Formatting Plugin
**Package:** `prettier-plugin-tailwindcss` (devDependency)

**Kya hai:**
Prettier ka Tailwind CSS plugin jo Tailwind classes ko recommended order mein automatically sort karta hai.

**Kyun zaroorat hai:**
Tailwind classes ka order consistent rakhnna (layout → spacing → typography → colors → effects).

**Kahan use hoga:**
- Automatically Prettier ke saath run hota hai
- `prettier.config.cjs` mein configured

---

### 15.4 `@types/node`, `@types/react`, `@types/react-dom`
**Category:** TypeScript Definitions
**Package:** devDependencies

**Kya hai:**
TypeScript type definitions for Node.js, React, aur React DOM.

**Kyun zaroorat hai:**
TypeScript ko React components aur Node APIs ki types samajhne ke liye.

**Kahan use hoga:**
- Automatically TypeScript ke saath use hota hai
- `tsconfig.json` — references

---

## 16. MISSING / RECOMMENDED LIBRARIES (Not Yet Installed)

Yeh libraries project mein nahi hain lekin **zaroor add karni chahiye**:

---

### 16.1 `react-hook-form` (RECOMMENDED)
**Category:** Form Management
**Why needed:** Project mein bahut saare complex forms hain (Invoice Form, Employee Form, Route Form, Payroll Form). Abhi likely uncontrolled forms ya manual state hain. React Hook Form performance-optimized form handling provide karta hai with validation.
**Install:** `npm install react-hook-form`
**Use karo:** `src/components/InvoiceForm.jsx`, `src/components/AddBusInfoForm.jsx`, `src/pages/payroll/`, employee forms

---

### 16.2 `zod` (RECOMMENDED)
**Category:** Schema Validation
**Why needed:** API request/response validation. TypeScript ke saath perfectly integrate hota hai. Yeh form validation (react-hook-form ke saath) aur API response validation dono ke liye use hota hai.
**Install:** `npm install zod`
**Use karo:** Service files mein API responses validate karne ke liye, forms validation schema ke liye

---

### 16.3 `@tanstack/react-query` (STRONGLY RECOMMENDED)
**Category:** Server State Management
**Why needed:** Abhi project mein Redux `createAsyncThunk` se API calls hain. React Query server state (API data) ko client state se alag manage karta hai — caching, background refetching, loading/error states automatically handle karta hai. Redux ki complexity kam hogi.
**Install:** `npm install @tanstack/react-query`
**Use karo:** Har service API call ko replace karne ke liye

---

### 16.4 `react-pdf` ya `jspdf` (RECOMMENDED)
**Category:** PDF Generation
**Why needed:** Invoices, pay stubs, aur reports PDF format mein download/print karne ke liye zaroorat hai. Project mein `PDFIcons` component hai jo suggest karta hai PDF feature planned/partial hai.
**Install:** `npm install @react-pdf/renderer` (better) ya `npm install jspdf`
**Use karo:** `src/pages/accounting/` invoices, `src/pages/payroll/` pay stubs

---

### 16.5 `xlsx` (RECOMMENDED)
**Category:** Excel Export
**Why needed:** Accounting reports, payroll data, aur financial statements ko Excel format mein export karna common requirement hai. Invoice lists, employee lists, etc.
**Install:** `npm install xlsx`
**Use karo:** `src/pages/accounting/Accounting.jsx` reports export, payroll export

---

### 16.6 `react-table` / `@tanstack/react-table` (RECOMMENDED)
**Category:** Data Tables
**Why needed:** Project mein bahut saare tables hain (DriverTable, SchoolTable, StudentTable, GLCodesTable). @tanstack/react-table headless table logic provide karta hai — sorting, filtering, pagination sab built-in.
**Install:** `npm install @tanstack/react-table`
**Use karo:** All table components in `src/components/`

---

### 16.7 `i18next` + `react-i18next` (FUTURE - if multilingual)
**Category:** Internationalization
**Why needed:** Agar app ko multiple languages mein support karna ho (English, Urdu, etc.)
**Install:** `npm install i18next react-i18next`

---

## SUMMARY TABLE

| Library | Version | Category | Priority | Remove? |
|---------|---------|----------|----------|---------|
| react | 18.3.1 | Core | Critical | No |
| react-dom | 18.3.1 | Core | Critical | No |
| vite | 5.3.3 | Build | Critical | No |
| @reduxjs/toolkit | 2.10.1 | State | Critical | No |
| react-redux | 9.2.0 | State | Critical | No |
| redux-persist | 6.0.0 | State | Critical | No |
| react-router-dom | 6.24.1 | Routing | Critical | No |
| axios | 1.13.1 | HTTP | Critical | No |
| socket.io-client | 4.8.3 | Real-time | Critical | No |
| @react-google-maps/api | 2.19.3 | Maps | Critical | No |
| @mui/material | 5.16.6 | UI | High | No |
| tailwindcss | 3.4.4 | Styling | Critical | No |
| react-hot-toast | 2.6.0 | UX | High | No |
| jwt-decode | 4.0.0 | Auth | Critical | No |
| js-cookie | 3.0.5 | Auth | High | No |
| apexcharts | 3.50.0 | Charts | High | No |
| react-apexcharts | 1.4.1 | Charts | High | No |
| date-fns | 3.6.0 | Dates | High | No |
| react-datepicker | 7.3.0 | Input | High | No |
| typescript | 5.7.2 | Quality | High | No |
| react-modal | 3.16.3 | UI | Medium | Consider MUI Dialog |
| @heroicons/react | 2.1.4 | Icons | Medium | No |
| lucide-react | 0.511.0 | Icons | Medium | Standardize to this |
| react-icons | 5.2.1 | Icons | Low | **Consider removing** |
| recharts | 2.15.2 | Charts | Low | **Remove (use ApexCharts)** |
| dayjs | 1.11.13 | Dates | Low | **Remove (use date-fns)** |
| react-day-picker | 8.10.1 | Input | Low | **Remove (use react-datepicker)** |
| react-scripts | 5.0.1 | Build | None | **Remove (use Vite only)** |
| @material-tailwind/react | 2.1.9 | UI | Low | Consider removing |
| prop-types | 15.8.1 | Quality | Low | Remove from TS files |
| react-hook-form | NOT INSTALLED | Forms | **High — Install** | - |
| zod | NOT INSTALLED | Validation | **High — Install** | - |
| @react-pdf/renderer | NOT INSTALLED | PDF | **High — Install** | - |
| xlsx | NOT INSTALLED | Export | **Medium — Install** | - |

---

## BUNDLE SIZE CONCERNS

Current estimated bundle size issues:
1. **Duplicate chart libraries:** ApexCharts + Recharts (~500KB extra)
2. **Duplicate date libraries:** date-fns + dayjs (~100KB extra)
3. **Triple icon libraries:** Heroicons + Lucide + React Icons (~200KB extra)
4. **Duplicate date pickers:** react-datepicker + react-day-picker (~150KB extra)
5. **react-scripts:** Not needed with Vite

**Recommendation:** Remove duplicates. Estimated savings: ~800KB-1MB in bundle size.

---

*Document generated for RouteIQ Frontend v2.1.0 | March 2026*
