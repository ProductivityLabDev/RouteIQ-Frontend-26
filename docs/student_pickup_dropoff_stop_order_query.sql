-- ============================================================
-- Student: Kis ka kya Pickup, kya Dropoff, aur Stop Order Id
-- ============================================================
-- RouteStops table (tumhara sample):
--   Id | RouteId | StopType  | StopAddress (ya StopName) | Latitude  | Longitude  | StopOrder | Time       | ? | IsDeleted | CreatedAt | UpdatedAt
--   47 | 25      | Pickup    | 166 W Harrison St...      | 41.87...  | -87.63...  | 1         | 02:48:00   | 1 | 0         | 2026-...  | NULL
--   48 | 25      | Dropoff   | 161 W 9th St...           | 41.87...  | -87.63...  | 2         | NULL       | 1 | 0         | 2026-...  | NULL
-- Agar column names alag hon (e.g. StopName, Address, ArrivalTime) to query mein replace kar lena.
-- ============================================================

-- -----------------------------------------------
-- ROUTESTOPS: Route 25 (ya koi bhi) – saare stops + Stop Order
-- -----------------------------------------------
SELECT
    rs.Id          AS StopId,
    rs.RouteId,
    rs.StopType    AS PickupOrDropoff,   -- 'Pickup' / 'Dropoff'
    rs.StopAddress AS PickupOrDropoffAddress,
    rs.Latitude,
    rs.Longitude,
    rs.StopOrder   AS StopOrderId,
    rs.EstimatedArrivalTime   -- ya jo column name hai time wala
FROM RouteStops rs
WHERE rs.RouteId = 25
  AND (rs.IsDeleted = 0 OR rs.IsDeleted IS NULL)
ORDER BY rs.RouteId, rs.StopOrder;


-- -----------------------------------------------
-- ROUTESTOPS: Har route ke liye Pickup/Dropoff + StopOrder (summary)
-- -----------------------------------------------
SELECT
    rs.RouteId,
    rs.Id          AS StopId,
    rs.StopType,
    rs.StopAddress,
    rs.StopOrder   AS StopOrderId,
    rs.Latitude,
    rs.Longitude
FROM RouteStops rs
WHERE (rs.IsDeleted = 0 OR rs.IsDeleted IS NULL)
ORDER BY rs.RouteId, rs.StopOrder;


-- -----------------------------------------------
-- (Jab Student / RouteStudent table batao ge) Kis student ka kya Pickup, Dropoff, StopOrderId
-- -----------------------------------------------
-- Abhi ke liye RouteStops se: kaun sa stop Pickup hai, kaun Dropoff, StopOrder kya hai
SELECT
    rs.RouteId,
    rs.Id          AS StopId,
    rs.StopOrder   AS StopOrderId,
    rs.StopType    AS PickupOrDropoff,
    rs.StopAddress AS Address
FROM RouteStops rs
WHERE (rs.IsDeleted = 0 OR rs.IsDeleted IS NULL)
ORDER BY rs.RouteId, rs.StopOrder;


-- ========== Neeche wale options mein Student table join hai ==========

-- -----------------------------------------------
-- OPTION 1: Sirf Student table se (pickup/dropoff address)
-- -----------------------------------------------
-- Agar Student table mein hi PickupLocation, DropLocation / DropoffLocation hai
SELECT
    s.StudentId,
    s.FirstName,
    s.LastName,
    ISNULL(s.FirstName, '') + ' ' + ISNULL(s.LastName, '') AS StudentName,
    s.PickupLocation   AS Pickup,
    s.DropLocation     AS Dropoff,   -- ya DropoffLocation / DropAddress
    s.PickupLatitude,
    s.PickupLongitude,
    s.DropLatitude,    -- ya DropoffLatitude
    s.DropLongitude,   -- ya DropoffLongitude
    s.InstituteId,
    s.EnrollmentNo
FROM Student s
WHERE (s.IsDeleted = 0 OR s.IsDeleted IS NULL)
ORDER BY s.InstituteId, s.LastName, s.FirstName;


-- -----------------------------------------------
-- OPTION 2: Route + Stops + Students (Stop Order Id ke sath)
-- -----------------------------------------------
-- Agar RouteStops (StopOrder) aur RouteStudent / StudentRouteAssignment jaisi tables hain
-- PickupStopId / DropoffStopId ya StopOrder directly student assignment mein ho sakta hai
SELECT
    r.RouteId,
    r.RouteNumber,
    r.RouteName,
    rs.StopId,
    rs.StopOrder       AS StopOrderId,
    rs.StopName,
    rs.StopAddress,
    rs.StopType,       -- 'Pickup' / 'Dropoff' agar column hai
    s.StudentId,
    ISNULL(s.FirstName, '') + ' ' + ISNULL(s.LastName, '') AS StudentName,
    -- Student ka khud ka pickup/dropoff (address)
    s.PickupLocation   AS StudentPickup,
    s.DropLocation     AS StudentDropoff
FROM RouteStops rs
JOIN Route r ON r.RouteId = rs.RouteId
LEFT JOIN RouteStudent rstu ON rstu.RouteId = r.RouteId
    AND (rstu.PickupStopId = rs.StopId OR rstu.DropoffStopId = rs.StopId
         OR rstu.PickupStopOrder = rs.StopOrder OR rstu.DropoffStopOrder = rs.StopOrder)
LEFT JOIN Student s ON s.StudentId = rstu.StudentId
WHERE (r.IsDeleted = 0 OR r.IsDeleted IS NULL)
ORDER BY r.RouteId, rs.StopOrder, s.LastName, s.FirstName;


-- -----------------------------------------------
-- OPTION 3: Simple – Route ke students + unka pickup, dropoff, aur stop order
-- -----------------------------------------------
-- Agar RouteStudent mein sirf RouteId, StudentId hai aur stop order alag table mein nahi
-- to stops ko route ke hisaab se join karke dikha sakte ho
SELECT
    r.RouteId,
    r.RouteNumber,
    s.StudentId,
    ISNULL(s.FirstName, '') + ' ' + ISNULL(s.LastName, '') AS StudentName,
    s.PickupLocation   AS Pickup,
    s.DropLocation     AS Dropoff,
    -- Agar RouteStops se match karke pickup/drop stop order nikalna ho
    pickup_stop.StopId   AS PickupStopId,
    pickup_stop.StopOrder AS PickupStopOrderId,
    dropoff_stop.StopId   AS DropoffStopId,
    dropoff_stop.StopOrder AS DropoffStopOrderId
FROM RouteStudent rstu
JOIN Route r ON r.RouteId = rstu.RouteId
JOIN Student s ON s.StudentId = rstu.StudentId
LEFT JOIN RouteStops pickup_stop
    ON pickup_stop.RouteId = r.RouteId
   AND (pickup_stop.StopAddress = s.PickupLocation OR pickup_stop.StopName = s.PickupLocation
        OR (pickup_stop.Latitude = s.PickupLatitude AND pickup_stop.Longitude = s.PickupLongitude))
LEFT JOIN RouteStops dropoff_stop
    ON dropoff_stop.RouteId = r.RouteId
   AND (dropoff_stop.StopAddress = s.DropLocation OR dropoff_stop.StopName = s.DropLocation
        OR (dropoff_stop.Latitude = s.DropLatitude AND dropoff_stop.Longitude = s.DropLongitude))
WHERE (r.IsDeleted = 0 OR r.IsDeleted IS NULL)
ORDER BY r.RouteId, s.LastName, s.FirstName;


-- -----------------------------------------------
-- OPTION 4: Minimal – Sirf yeh 3 cheezein (kis student ka kya pickup, dropoff, stop order)
-- -----------------------------------------------
-- Jo bhi columns tumhare DB mein hain unse replace karo: StudentId, Pickup, Dropoff, StopOrder
SELECT
    s.StudentId,
    ISNULL(s.FirstName, '') + ' ' + ISNULL(s.LastName, '') AS StudentName,
    s.PickupLocation   AS Pickup,
    s.DropLocation     AS Dropoff,
    rs.StopOrder       AS StopOrderId,
    rs.StopId,
    rs.StopName
FROM Student s
LEFT JOIN RouteStudent rstu ON rstu.StudentId = s.StudentId
LEFT JOIN RouteStops rs ON rs.RouteId = rstu.RouteId
    AND (rs.StopAddress IN (s.PickupLocation, s.DropLocation) OR rs.StopName IN (s.PickupLocation, s.DropLocation))
WHERE (s.IsDeleted = 0 OR s.IsDeleted IS NULL)
ORDER BY s.StudentId, rs.StopOrder;
