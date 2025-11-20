# Database Installation Guide
## Route IQ MSSQL Database Setup

---

## Prerequisites

1. **MSSQL Server** installed and running
   - SQL Server 2016 or later
   - SQL Server Management Studio (SSMS) recommended

2. **Permissions**
   - Database creation permissions
   - Schema modification permissions

---

## Installation Steps

### Step 1: Create Database

Open SQL Server Management Studio and run:

```sql
-- Create the database
CREATE DATABASE RouteIQ_DB;
GO

-- Verify database creation
SELECT name, database_id, create_date 
FROM sys.databases 
WHERE name = 'RouteIQ_DB';
GO
```

### Step 2: Run Schema Script

1. Open `database_schema.sql` in SSMS
2. Make sure `RouteIQ_DB` is selected in the database dropdown
3. Execute the entire script (F5)
4. Wait for completion (may take 1-2 minutes)

### Step 3: Verify Installation

Run these verification queries:

```sql
USE RouteIQ_DB;
GO

-- Check table count
SELECT 
    COUNT(*) AS TotalTables,
    'Tables created successfully' AS Status
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
-- Should return 35+

-- Check indexes
SELECT 
    COUNT(*) AS TotalIndexes
FROM sys.indexes 
WHERE object_id IN (SELECT object_id FROM sys.tables);
-- Should return 30+

-- Check foreign keys
SELECT 
    COUNT(*) AS TotalForeignKeys
FROM sys.foreign_keys;
-- Should return 40+

-- Check sample data
SELECT 'PayTypes' AS TableName, COUNT(*) AS RecordCount FROM PayTypes
UNION ALL
SELECT 'PayCycles', COUNT(*) FROM PayCycles
UNION ALL
SELECT 'States', COUNT(*) FROM States
UNION ALL
SELECT 'Roles', COUNT(*) FROM Roles
UNION ALL
SELECT 'GLCodes', COUNT(*) FROM GLCodes;
```

### Step 4: Test Stored Procedures

```sql
-- Test user permissions procedure (will return empty - no users yet)
EXEC sp_GetUserPermissions @UserId = 1;

-- Test vehicle defects procedure (will return empty - no vehicles yet)
EXEC sp_GetVehicleDefects @VehicleId = 1;
```

---

## Post-Installation

### 1. Create Database User (Optional)

```sql
-- Create application user
CREATE LOGIN RouteIQ_App WITH PASSWORD = 'YourSecurePassword123!';
GO

USE RouteIQ_DB;
GO

CREATE USER RouteIQ_App FOR LOGIN RouteIQ_App;
GO

-- Grant permissions
ALTER ROLE db_datareader ADD MEMBER RouteIQ_App;
ALTER ROLE db_datawriter ADD MEMBER RouteIQ_App;
ALTER ROLE db_ddladmin ADD MEMBER RouteIQ_App;
GO
```

### 2. Backup Database

```sql
-- Create backup
BACKUP DATABASE RouteIQ_DB
TO DISK = 'C:\Backups\RouteIQ_DB.bak'
WITH FORMAT, COMPRESSION;
GO
```

---

## Connection String

### For .NET/NestJS Backend:

```json
{
  "connectionString": "Server=localhost;Database=RouteIQ_DB;User Id=RouteIQ_App;Password=YourSecurePassword123!;TrustServerCertificate=True;"
}
```

### For Node.js with mssql:

```javascript
const config = {
  server: 'localhost',
  database: 'RouteIQ_DB',
  user: 'RouteIQ_App',
  password: 'YourSecurePassword123!',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};
```

---

## Troubleshooting

### Error: "Cannot create database"
- **Solution:** Check SQL Server is running
- **Solution:** Verify you have CREATE DATABASE permission

### Error: "Foreign key constraint"
- **Solution:** Make sure all tables are created in order
- **Solution:** Check for any script errors before the failing statement

### Error: "Index already exists"
- **Solution:** Drop existing indexes first
- **Solution:** Or modify script to use IF NOT EXISTS

### Tables not created
- **Solution:** Check script execution completed
- **Solution:** Verify you're connected to correct database
- **Solution:** Check SQL Server error log

---

## Next Steps

1. ✅ Database schema installed
2. ⏳ Configure backend connection
3. ⏳ Set up environment variables
4. ⏳ Test API endpoints
5. ⏳ Seed initial data (optional)

---

## Optional: Seed Initial Data

Create a separate script `seed_data.sql` for:
- Default admin user
- Test vendors
- Test vehicles
- Test routes

---

**Installation Complete!** 🎉

