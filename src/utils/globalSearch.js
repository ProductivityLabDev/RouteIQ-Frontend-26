export const SEARCH_PAGE_LINKS = [
  { label: "Dashboard", description: "Vendor dashboard overview", path: "/dashboard", keywords: ["home", "overview", "stats", "main"] },
  { label: "Edit Profile", description: "Vendor profile settings", path: "/vendor-profile", keywords: ["profile", "account", "company", "settings", "vendor details"] },
  { label: "Vehicle Management", description: "Vehicles and maintenance", path: "/vehicleManagement", keywords: ["vehicle", "bus", "fleet", "maintenance", "garage"] },
  { label: "Repair Schedule", description: "Vehicle repairs and service schedule", path: "/repair-schedule", keywords: ["repair", "service", "maintenance", "workshop"] },
  { label: "Reported Defects", description: "Vehicle defect reports", path: "/reported-defects", keywords: ["defects", "issues", "damage", "problems"] },
  { label: "Vehicle Notes", description: "Vehicle notes and logs", path: "/notes", keywords: ["notes", "vehicle notes", "logs", "remarks"] },
  { label: "Employee Management", description: "Employees and roles", path: "/EmployeeManagement", keywords: ["employee", "driver", "staff", "team", "workers"] },
  { label: "Driver Management", description: "Driver records and assignments", path: "/DriverManagement", keywords: ["driver", "chauffeur", "operator", "driver records"] },
  { label: "School Management", description: "Schools and institutes", path: "/SchoolManagement", keywords: ["school", "institute", "academy", "campus"] },
  { label: "Student Management", description: "Students and school riders", path: "/StudentManagement", keywords: ["student", "rider", "learner", "children"] },
  { label: "Route Management", description: "Routes and assignments", path: "/RouteManagement", keywords: ["route", "map", "assignment", "stops"] },
  { label: "Real-Time Tracking", description: "Live location and tracking", path: "/RealTimeTracking", keywords: ["tracking", "live", "location", "gps"] },
  { label: "Route Scheduling", description: "Trip and route schedules", path: "/RouteSchedule", keywords: ["schedule", "trip", "planner", "calendar"] },
  { label: "Chat Monitoring", description: "Vendor communication center", path: "/vendorChat", keywords: ["chat", "messages", "communication", "conversation"] },
  { label: "Accounting", description: "Invoices and financial screens", path: "/accounting", keywords: ["invoice", "billing", "payment", "finance", "accounting"] },
  { label: "Billing Invoice", description: "Legacy billing and invoice screen", path: "/BillingInvoice", keywords: ["billing invoice", "subscription", "driver invoices"] },
  { label: "GL Codes", description: "GL codes and ledger setup", path: "/GlCodes", keywords: ["gl", "gl code", "ledger", "account code"] },
  { label: "Access Management", description: "Users and permissions", path: "/accessManagement", keywords: ["access", "permissions", "roles", "users"] },
  { label: "Documents", description: "Corporate and training documents", path: "/documents", keywords: ["documents", "files", "paperwork", "training"] },
  { label: "Feedback", description: "Vendor feedback and support", path: "/feedback", keywords: ["feedback", "support", "help", "complaint"] },
  { label: "Settings", description: "Dashboard settings and profile links", path: "/dashboard/settings", keywords: ["settings", "preferences", "configuration"] },
  { label: "Feedback and Support", description: "Dashboard feedback support center", path: "/dashboard/feedback-and-support", keywords: ["feedback support", "help center", "support center"] },
  { label: "Notifications", description: "Unread alerts and updates", path: "/notification", keywords: ["notifications", "alerts", "updates", "bell"] },
];

export const SEARCH_COMMAND_LINKS = [
  { id: "cmd-school-invoices", label: "School Invoices", description: "Open accounting on school invoices tab", path: "/accounting?tab=School%20Invoices", keywords: ["school invoice", "invoice school", "billing school", "fees"] },
  { id: "cmd-trip-invoices", label: "Trip Invoices", description: "Open accounting on trip invoices tab", path: "/accounting?tab=Trip%20invoices", keywords: ["trip invoice", "invoice trip", "trip billing"] },
  { id: "cmd-accounts-payable", label: "Accounts Payable", description: "Open accounting payable view", path: "/accounting?tab=Accounts%20Payable", keywords: ["payable", "vendor payments", "expenses"] },
  { id: "cmd-accounts-receivable", label: "Accounts Receivable", description: "Open accounting receivable view", path: "/accounting?tab=Accounts%20Receivable", keywords: ["receivable", "incoming payments", "collections"] },
  { id: "cmd-add-employee", label: "Add Employee", description: "Go to employee management and add a new employee", path: "/EmployeeManagement", keywords: ["employee", "new employee", "create employee", "hire", "add driver", "staff onboarding"] },
  { id: "cmd-add-bus", label: "Add Bus", description: "Go to vehicle management and add a new bus", path: "/vehicleManagement", keywords: ["bus", "vehicle", "new bus", "create bus", "add vehicle", "register bus", "fleet onboarding"] },
  { id: "cmd-add-school", label: "Add School", description: "Go to school management and add a new school", path: "/SchoolManagement", keywords: ["school", "new school", "create school", "add institute", "register school"] },
  { id: "cmd-add-route", label: "Create Route", description: "Go to route management and create a route", path: "/RouteManagement", keywords: ["route", "add route", "new route", "create trip route", "route setup"] },
  { id: "cmd-edit-profile", label: "Vendor Profile", description: "Open vendor profile settings", path: "/vendor-profile", keywords: ["my profile", "company profile", "account settings"] },
  { id: "cmd-terminal", label: "Terminal", description: "Open accounting on terminal tab", path: "/accounting?tab=Terminal", keywords: ["terminal accounting", "terminal invoices", "terminal tab"] },
  { id: "cmd-kpi", label: "KPI", description: "Open accounting KPI tab", path: "/accounting?tab=KPI", keywords: ["kpi", "stats", "performance metrics", "analytics"] },
  { id: "cmd-income-statement", label: "Income Statement", description: "Open accounting income statement tab", path: "/accounting?tab=Income%20Statement", keywords: ["income statement", "profit and loss", "pnl"] },
  { id: "cmd-balance-sheet", label: "Balance Sheet", description: "Open accounting balance sheet tab", path: "/accounting?tab=Balance%20Sheet", keywords: ["balance sheet", "assets", "liabilities", "equity"] },
  { id: "cmd-generate-report", label: "Generate Report", description: "Open accounting report generation tab", path: "/accounting?tab=Generate%20Report", keywords: ["report", "generate report", "export report"] },
];

export const normalizeSearchText = (value) => String(value || "")
  .toLowerCase()
  .replace(/[%?&=/_-]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

export const scoreSearchItem = (query, values = [], options = {}) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const looksLikeRecordQuery = queryTokens.length > 1 || normalizedQuery.length >= 4 || /\d/.test(normalizedQuery);
  const kindBoost = options.kind === "record" ? 18 : 0;
  const pagePenalty = looksLikeRecordQuery && options.kind === "page" ? 12 : 0;

  const isSubsequence = (needle, haystack) => {
    let pointer = 0;
    for (const char of haystack) {
      if (char === needle[pointer]) pointer += 1;
      if (pointer === needle.length) return true;
    }
    return false;
  };

  let score = 0;
  values.forEach((value) => {
    const normalizedValue = normalizeSearchText(value);
    if (!normalizedValue) return;

    const compactValue = normalizedValue.replace(/\s+/g, "");
    const valueTokens = normalizedValue.split(/[\s/-]+/).filter(Boolean);

    if (normalizedValue === normalizedQuery) score += 180;
    else if (compactValue === compactQuery) score += 160;
    else if (normalizedValue.startsWith(normalizedQuery)) score += 105;
    else if (valueTokens.some((valueToken) => valueToken === normalizedQuery)) score += 95;
    else if (valueTokens.some((valueToken) => valueToken.startsWith(normalizedQuery))) score += 72;
    else if (normalizedValue.includes(normalizedQuery)) score += 48;

    queryTokens.forEach((token) => {
      if (valueTokens.some((valueToken) => valueToken === token)) score += 30;
      else if (valueTokens.some((valueToken) => valueToken.startsWith(token))) score += 18;
      else if (normalizedValue.includes(token)) score += 8;
      else if (token.length >= 4 && isSubsequence(token, normalizedValue)) score += 2;
    });

    if (normalizedQuery.length <= 3 && isSubsequence(normalizedQuery, normalizedValue)) score += 6;
  });

  return Math.max(score + kindBoost - pagePenalty, 0);
};

export const createFocusPath = (basePath, focus = {}, extraParams = {}) => {
  const params = new URLSearchParams();

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });

  if (focus.type) params.set("focusType", String(focus.type));
  if (focus.id !== undefined && focus.id !== null && focus.id !== "") params.set("focusId", String(focus.id));
  if (focus.label) params.set("focusLabel", String(focus.label));

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

export const readFocusParams = (searchParams, expectedType = "") => {
  const focusType = searchParams.get("focusType") || "";
  if (expectedType && focusType && focusType !== expectedType) return null;

  const focusId = searchParams.get("focusId") || "";
  const focusLabel = (searchParams.get("focusLabel") || "").trim().toLowerCase();
  if (!focusId && !focusLabel) return null;

  return { focusType, focusId, focusLabel };
};
