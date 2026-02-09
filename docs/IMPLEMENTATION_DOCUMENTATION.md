<![CDATA[<div align="center">

# 🚌 Route IQ Frontend

### Implementation Documentation

**Version 2.0** | **February 2026**

---

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-API-4285F4?logo=googlemaps&logoColor=white)](https://developers.google.com/maps)

</div>

---

## 📋 Table of Contents

| # | Section | Description |
|---|---------|-------------|
| 1 | [Live Tracking](#-1-live-tracking-module) | Real-time vehicle monitoring |
| 2 | [Route Management](#-2-route-management-module) | Routes, stops, assignments |
| 3 | [Smart Matching](#-3-smart-matching-feature) | Intelligent student-route pairing |
| 4 | [API Reference](#-4-api-reference) | Backend endpoints |
| 5 | [Technical Stack](#-5-technical-stack) | Technologies used |

---

<br>

# 🛰️ 1. Live Tracking Module

> **Real-time vehicle tracking with automatic updates, interactive markers, and path visualization**

<br>

## 1.1 Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🔄 **Auto Polling** | Refreshes every 7 seconds | ✅ |
| 🎨 **Status Colors** | Green/Yellow/Gray markers | ✅ |
| 📍 **Vehicle Detail** | Click marker for info panel | ✅ |
| 🛤️ **Path History** | Blue polyline on map | ✅ |
| 📊 **Status Bar** | Live counts + controls | ✅ |

<br>

## 1.2 Marker Color System

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│    🟢 GREEN      Vehicle is IN TRANSIT (moving)         │
│                                                         │
│    🟡 YELLOW     Vehicle is AT STOP (picking up)        │
│                                                         │
│    ⚪ GRAY       Vehicle is IDLE (not active)           │
│                                                         │
│    🔵 BLUE       Driver marker                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

<br>

## 1.3 Vehicle Detail Panel

When you click on any vehicle marker:

```
┌──────────────────────────────────────┐
│  Test Bus 001            [🟢 Active] │
│  ABC-1234                            │
├──────────────────────────────────────┤
│  👤 Driver      : John Smith         │
│  🛣️ Route       : AM Route 5         │
│  📍 Location    : 24.79, 67.06       │
│  ⚡ Speed       : 45 km/h            │
│  🕐 Updated     : 2:45:30 PM         │
│  👨‍🎓 Students    : 12 / 25 on board   │
├──────────────────────────────────────┤
│  📍 Path history: 156 points         │
└──────────────────────────────────────┘
```

<br>

## 1.4 Status Bar (Bottom Panel)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  🟢 5 In Transit  │  🟡 2 At Stop  │  ⚪ 8 Idle  │  Updated: 2:45 PM  │  🟢 Live  │  🔄 Refresh  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Controls:**
- **Live/Paused** — Toggle automatic refresh
- **Refresh** — Manual data refresh

<br>

## 1.5 Polling Behavior

| Scenario | Map Behavior |
|----------|--------------|
| Page Load | Centers on markers, zoom 15 |
| During Polling | Map stays in place (no jumping) |
| Terminal Change | Re-centers on new markers |
| School Change | Re-centers on new markers |

<br>

---

<br>

# 🗺️ 2. Route Management Module

> **Hierarchical route management with map visualization**

<br>

## 2.1 Navigation Hierarchy

```
📁 Terminal 1
│
├── 🏫 Lincoln High School
│   │
│   ├── 🚌 Route AM-001
│   │   ├── 📍 Stop 1: School Main Gate
│   │   ├── 📍 Stop 2: North Colony
│   │   ├── 📍 Stop 3: South Block
│   │   └── 👨‍🎓 Students: [John, Jane, Mike...]
│   │
│   └── 🚌 Route PM-001
│       └── ...
│
├── 🏫 Washington Middle School
│   └── ...
│
📁 Terminal 2
└── ...
```

<br>

## 2.2 Route Map View

When a route is selected:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     [1]●─────────────●[2]─────────────●[3]                  │
│       │               │               │                     │
│       ▼               ▼               ▼                     │
│    School          Colony A        Colony B                 │
│    Gate                                                     │
│                                                             │
│     ◆ = Stop Marker                                         │
│     ● = Student Pickup Point                                │
│     ─ = Route Polyline (Google Directions)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

<br>

---

<br>

# 🎯 3. Smart Matching Feature

> **Automatically find students near route stops**

<br>

## 3.1 How It Works

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   STEP 1: Click "Smart Match Students" on any route            │
│           ↓                                                    │
│   STEP 2: System finds route's pickup location                 │
│           ↓                                                    │
│   STEP 3: Search students within radius                        │
│           │                                                    │
│           ├── Try ADDRESS matching first (exact match)         │
│           │                                                    │
│           └── Fallback to COORDINATE matching (proximity)      │
│           ↓                                                    │
│   STEP 4: Display matched students                             │
│           ↓                                                    │
│   STEP 5: One-click assign to route                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

<br>

## 3.2 Matching Types

| Type | Parameter | Range | Best For |
|------|-----------|-------|----------|
| **Address** | `radiusMeters` | 10m - 5000m | Exact street address |
| **Coordinate** | `radiusKm` | 0.01km - 50km | General area |

<br>

## 3.3 Smart Match UI

**On Route Card:**
```
┌─────────────────────────────────────────┐
│  🚌 Route AM-001                        │
│  ├── 📍 3 Stops                         │
│  └── 👨‍🎓 12 Students                     │
│                                         │
│  [🔍 Smart Match Students]              │
└─────────────────────────────────────────┘
```

**After Matching:**
```
┌─────────────────────────────────────────┐
│  🎯 Matched Students (5)                │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 👨‍🎓 John Smith                   │    │
│  │    📍 123 Main St (0.5 km)      │    │
│  │                        [+ Add]  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 👨‍🎓 Jane Doe                     │    │
│  │    📍 456 Oak Ave (0.8 km)      │    │
│  │                        [+ Add]  │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

<br>

---

<br>

# 📡 4. API Reference

<br>

## 4.1 Tracking APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tracking/vehicles/active` | GET | All active vehicles |
| `/tracking/vehicles/:id/location` | GET | Single vehicle detail |
| `/tracking/vehicles/:id/history` | GET | Vehicle path history |
| `/tracking/terminals/:id/vehicles` | GET | Terminal's vehicles |
| `/tracking/schools/:id/vehicles` | GET | School's vehicles |
| `/tracking/routes/:id/live` | GET | Live route + students |
| `/tracking/routes/:id/students/onboard` | GET | Students on board |
| `/tracking/drivers/:id/location` | GET | Driver location |

<br>

## 4.2 Route APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/routes/students/find-by-location` | POST | Smart match students |
| `/routes/:id/students/:studentId` | POST | Assign student to route |

<br>

## 4.3 Request/Response Examples

**Smart Match Request:**
```json
{
  "instituteId": 31,
  "address": "123 Main Street",
  "radiusMeters": 5000,
  "matchType": "address"
}
```

**Smart Match Response:**
```json
{
  "ok": true,
  "data": {
    "matchedStudents": [
      {
        "studentId": 101,
        "firstName": "John",
        "lastName": "Smith",
        "pickupAddress": "125 Main Street",
        "distance": 50
      }
    ],
    "totalMatched": 1,
    "matchType": "address"
  }
}
```

<br>

---

<br>

# 🛠️ 5. Technical Stack

<br>

## 5.1 Technologies

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3 |
| **Build Tool** | Vite 5.3 |
| **Styling** | Tailwind CSS 3.x |
| **UI Components** | Material Tailwind |
| **State Management** | Redux Toolkit |
| **Maps** | Google Maps API |
| **HTTP Client** | Axios |
| **Notifications** | React Hot Toast |

<br>

## 5.2 Project Structure

```
src/
│
├── 📁 pages/
│   ├── 📁 realTimeTracking/
│   │   └── RealTimeTracking.jsx    ← Live tracking page
│   │
│   └── 📁 routeManagement/
│       ├── RouteManagement.jsx     ← Main route page
│       ├── SchoolList.jsx          ← Schools & routes list
│       └── CreateRoute.jsx         ← Create new route
│
├── 📁 components/
│   └── MapComponent.jsx            ← Google Maps wrapper
│
├── 📁 services/
│   ├── trackingService.ts          ← Tracking APIs
│   ├── routeService.ts             ← Route APIs
│   └── studentService.ts           ← Student APIs
│
└── 📁 redux/
    └── 📁 slices/
        ├── schoolSlice.js
        ├── studentSlice.js
        └── routesSlice.js
```

<br>

## 5.3 Environment Variables

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_BASE_URL=http://localhost:3000
VITE_API_PREFIX=/api/v1
```

<br>

---

<br>

<div align="center">

## 📝 Change Log

| Date | Version | Changes |
|------|---------|---------|
| Feb 5, 2026 | 2.0 | Live Tracking + Smart Matching |

<br>

---

**Route IQ** — School Bus Management System

*Built with ❤️ by the Development Team*

</div>
]]>