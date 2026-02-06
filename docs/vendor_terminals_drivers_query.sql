-- ============================================================
-- Vendor userId 36: Kitne terminals + kis terminal par kaun drivers
-- ============================================================
-- Note: Table/column names backend schema ke hisaab se change kar sakte hain.
-- Common names: Terminals, Users, Employees/Drivers, UserTerminals, etc.
-- ============================================================

-- -----------------------------------------------
-- OPTION 1: Agar Terminals table mein VendorId/UserId/CreatedBy ho
-- -----------------------------------------------
-- Vendor 36 ke saare terminals + count
SELECT 
    t.TerminalId,
    t.TerminalName,
    t.TerminalCode,
    COUNT(DISTINCT e.Id) AS DriverCount
FROM Terminals t
LEFT JOIN Employees e ON e.TerminalId = t.TerminalId 
    OR e.AssignedTerminalId = t.TerminalId 
    OR e.TerminalAssignedTo = t.TerminalId
WHERE t.VendorId = 36 
   OR t.UserId = 36 
   OR t.CreatedByUserId = 36
   AND (t.IsDeleted = 0 OR t.IsDeleted IS NULL)
GROUP BY t.TerminalId, t.TerminalName, t.TerminalCode
ORDER BY t.TerminalName;


-- -----------------------------------------------
-- OPTION 2: Terminal-wise drivers list (detail)
-- -----------------------------------------------
SELECT 
    t.TerminalId,
    t.TerminalName,
    t.TerminalCode,
    e.Id AS DriverId,
    e.FirstName,
    e.LastName,
    e.Name AS DriverName,
    e.PhoneNo,
    e.Email
FROM Terminals t
LEFT JOIN Employees e ON e.TerminalId = t.TerminalId 
    OR e.AssignedTerminalId = t.TerminalId 
    OR e.TerminalAssignedTo = t.TerminalId
WHERE (t.VendorId = 36 OR t.UserId = 36 OR t.CreatedByUserId = 36)
  AND (t.IsDeleted = 0 OR t.IsDeleted IS NULL)
ORDER BY t.TerminalName, e.LastName, e.FirstName;


-- -----------------------------------------------
-- OPTION 3: Agar User 36 = Vendor aur link UserTerminals / VendorTerminals jaisi table se ho
-- -----------------------------------------------
-- Pehle check: User 36 vendor hai?
-- SELECT * FROM Users WHERE Id = 36;
-- Terminals vendor se kaise link hain (VendorId, UserId, mapping table)?

-- Example: UserTerminals mapping table
/*
SELECT 
    t.TerminalId,
    t.TerminalName,
    t.TerminalCode,
    COUNT(e.Id) AS DriverCount
FROM UserTerminals ut
JOIN Terminals t ON t.TerminalId = ut.TerminalId
LEFT JOIN Employees e ON e.AssignedTerminalId = t.TerminalId
WHERE ut.UserId = 36
GROUP BY t.TerminalId, t.TerminalName, t.TerminalCode;
*/


-- -----------------------------------------------
-- SIMPLE TOTALS: Vendor 36 – total terminals, total drivers
-- -----------------------------------------------
/*
SELECT 
    COUNT(DISTINCT t.TerminalId) AS TotalTerminals,
    COUNT(DISTINCT e.Id) AS TotalDrivers
FROM Terminals t
LEFT JOIN Employees e ON e.AssignedTerminalId = t.TerminalId OR e.TerminalId = t.TerminalId
WHERE t.VendorId = 36 OR t.UserId = 36 OR t.CreatedByUserId = 36;
*/
