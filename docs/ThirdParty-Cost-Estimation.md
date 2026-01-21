# Route IQ — Third‑Party & Operational Cost Estimation (Client‑Facing)

**Date:** 2026-01-14  
**Scope:** Estimated recurring + optional one‑time costs for third‑party services used by Route IQ (Frontend + Backend).  
**Notes:** Prices vary by **region**, **plan/tier**, and vendor pricing changes. Treat this as a **budgetary estimate** and confirm using official calculators before final approval.

---

## What we confirmed from the codebase

- **Database is MSSQL** (see `INSTALL_DATABASE.md`) → Azure side normally maps to **Azure SQL Database** or **Azure SQL Managed Instance**.
- **Google Maps is used in the frontend** via `@react-google-maps/api`:
  - Map rendering (Maps JavaScript API / “Dynamic Maps” loads)
  - **DirectionsService** for road‑following routes (routing requests)
  - **Places library** for pickup/dropoff autocomplete (`CreateRoute.jsx`)

---

## What the client should expect to pay for (no amounts version)

> This section intentionally contains **no pricing**. It is a checklist of the third‑party services and operational items typically required to run Route IQ in production.

| Category | Billing model (typical) | Required? | Notes |
|---|---|---|---|
| **Backend Hosting (NestJS API)** | Monthly compute + bandwidth | **Yes** | Recommended: Azure App Service (Linux) (current setup: no Docker) |
| **Database (MSSQL)** | Monthly tier + storage | **Yes** | Azure SQL Database or Azure SQL Managed Instance |
| **Google Maps Platform** | Usage‑based (requests/loads) | **Yes** | Maps JS + Places Autocomplete + Directions/Routing |
| **Object Storage (Images/Docs)** | Storage + requests + egress | **Yes** | AWS S3 bucket (already in use) |
| **Mobile store accounts (Android + iOS)** | One‑time + annual (platform rules) | **Yes** | Required to publish both apps |
| **In‑app subscriptions (store billing)** | Revenue share / service fee | **Yes** | Required for your subscription model |
| **Email/SMS (optional)** | Usage‑based | Optional | OTP/alerts if enabled |
| **Monitoring & crash reporting** | Usage‑based or monthly | Recommended | Logs, performance, crash tracking |
| **Domain/DNS/SSL** | Annual (domain) + optional monthly (CDN/WAF) | **Yes** | Website needs a domain + HTTPS |

---

## Usage inputs (for later cost calculation if needed)

- **Active users / month:** ____  
- **Map loads / user / day:** ____  
- **Days / month:** 30  
- **Autocomplete searches / route creation:** ____ (pickup + dropoff combined)  
- **Routes created / month:** ____  
- **Route views (map opens) / month:** ____  
- **Images stored (GB):** ____  
- **Image downloads / month (GB egress):** ____  

---

## 1) Google Maps Platform (Frontend)

### APIs used
- **Maps JavaScript API (Dynamic Maps)**: map rendering.
- **Places (Autocomplete)**: pickup/dropoff suggestions.
- **Directions (Routing)**: compute road‑following route polyline.

### Cost drivers & formulas (budgetary)
- **Map loads (Dynamic Maps)**  
  - Monthly map loads ≈ Active users × map loads/user/day × 30  
  - Cost ≈ (map loads / 1,000) × *Dynamic Maps rate*

- **Places Autocomplete**  
  - Autocomplete calls are typically per keystroke/session.  
  - Monthly autocomplete requests ≈ Routes created × autocomplete requests/route  
  - Cost ≈ (requests / 1,000) × *Places rate*

- **Directions / Routing**  
  - Monthly directions calls ≈ Route views (map opens) × 1  
  - Cost ≈ (requests / 1,000) × *Directions/Routes rate*

### Official pricing references (confirm for your region/SKUs)
- Google Maps Platform pricing: `https://developers.google.com/maps/billing-and-pricing/pricing`

> Important: Google billing can include free‑tier/credits or SKU‑specific free usage limits depending on your billing setup. Always verify in your Google Cloud Billing console.

---

## 2) Azure Database (MSSQL)

### Recommended options (choose based on scale)
- **Option A — Azure SQL Database (Single Database)**  
  - Best for most SaaS apps, easiest to start and scale.
- **Option B — Azure SQL Managed Instance**  
  - Best if you need near‑full SQL Server instance features / lift‑and‑shift.

### Cost drivers
- **Compute tier** (DTU or vCore)
- **Storage (GB)**
- **High availability** (zone redundancy), backups retention, read replicas (if used)

### Official pricing reference
- Azure SQL Database pricing: `https://azure.microsoft.com/pricing/details/azure-sql-database/`
- Azure Pricing Calculator: `https://azure.microsoft.com/pricing/calculator/`

---

## 2.1) Backend Hosting (NestJS API)

### Recommended Azure options
- **Option A — Azure App Service (Linux)** *(recommended for current setup)*  
  - Best when you are **not using Docker yet**. Managed hosting, easy deploy, supports autoscale.
- **Option B — Azure Container Apps** *(if you already use Docker)*  
  - Scales on demand; pay based on CPU/RAM usage.
- **Option C — Azure VM** *(least managed)*  
  - You manage OS, patching, scaling; only choose if you need full control.

### Recommended choice (today)
- Since you’re **not using Docker**, choose **Azure App Service (Linux)** for the NestJS API.
- If you later containerize the backend, you can move to **Container Apps** with minimal changes.

### Cost drivers
- **Compute size** (CPU/RAM) + number of instances
- **Autoscale** / peak traffic
- **Bandwidth egress** (downloads, images served from API, etc.)
- Optional: **Redis cache**, **queue**, **background jobs**, **monitoring/logging**

### Official references
- Azure App Service pricing: `https://azure.microsoft.com/pricing/details/app-service/`
- Azure Container Apps pricing: `https://azure.microsoft.com/pricing/details/container-apps/`
- Azure Pricing Calculator: `https://azure.microsoft.com/pricing/calculator/`

---

## 3) AWS S3 (Images/Attachments)

### Typical billing components
- **Storage** (GB‑month)
- **Requests** (PUT/GET)
- **Data transfer out (egress)** if users download images/files

### Rules of thumb (budgetary)
- Storage cost ≈ GB stored × (regional storage rate / GB‑month)
- Request cost is usually small unless you have very high traffic

### Official pricing reference
- Amazon S3 pricing: `https://aws.amazon.com/s3/pricing/`

---

## 4) Payment / Merchant (Optional)

If subscriptions/online payments are enabled, you typically pay:
- **Processor fee** (percentage + fixed fee per successful transaction)
- Possible **chargeback** fees
- Possible **platform** fees depending on provider

### Official references (examples)
- Stripe pricing: `https://stripe.com/pricing`
- PayPal pricing: `https://www.paypal.com/webapps/mpp/merchant-fees`

---

## 5) Email / SMS (Optional)

If the product sends OTPs, route alerts, or notifications:
- **SMS** (per message, varies by country)
- **Email** (per 1,000 emails or per seat depending on provider)

Examples (choose one):
- Twilio SMS: `https://www.twilio.com/pricing`
- SendGrid Email: `https://sendgrid.com/pricing/`

---

## 5.1) Notifications — how they actually work (important clarification)

**Notifications do not “run from the database.”** The database only stores records (users, devices, preferences, schedules).
Notifications are sent by the **backend application** (API) which:

- Reads/writes notification data in **SQL**
- Triggers delivery via:
  - **Mobile push**: **FCM** (Android) + **APNs** (iOS)
  - **SMS** provider (e.g., Twilio) if required
  - **Email** provider (e.g., SendGrid) if required

**Cost impact:**
- Push (FCM/APNs) usually has **no direct per‑message fee**, but you still pay for backend hosting + monitoring.
- SMS/Email typically have **per‑message** or **per‑volume** fees.

---

## 6) Domain / SSL

### Domain (required for production website)
- **Registrar purchase**: required for a custom domain (e.g., `routeiq.com`).
- **Premium domains**: can be higher than standard registrations (depends on the name).
- **Add‑ons (optional)**:
  - **WHOIS privacy**: sometimes included, otherwise small annual fee
  - **Extra DNS features**: usually not required

### DNS / CDN (optional but recommended)
- **DNS provider**: can be your registrar or a dedicated DNS provider.
- **CDN/WAF**: optional but recommended for performance and basic protection.

### SSL (HTTPS)
- **SSL certificate**: typically provided via Let’s Encrypt or included with managed hosting/CDN.

---

## 7) Mobile App Publishing (Android + iOS)

### Store accounts (mandatory for publishing)
- **Google Play Console**: **one‑time** developer registration fee (per organization).
- **Apple Developer Program**: **annual** membership (per organization).

### In‑app subscriptions (platform commissions)
If the app sells **digital subscriptions inside the app**, stores typically require their in‑app billing systems and charge a **service fee**:

- **Apple (auto‑renewable subscriptions)**:
  - Store service fee applies; special programs may reduce it depending on eligibility.
  - Reference: `https://developer.apple.com/app-store/small-business-program/`

- **Google Play (subscriptions)**:
  - Store service fee applies; may vary by program/category.
  - Reference: `https://support.google.com/googleplay/android-developer/answer/112622`

#### How to estimate subscription fees (simple formula)
- Monthly platform fee ≈ \( \text{Subscription revenue in store} \times \text{Store fee %} \)

### Mobile apps (2 apps: Android + iOS) — required items

#### A) Build & publishing requirements (both platforms)
- **App builds**:
  - Android: **AAB** build
  - iOS: **IPA** build
- **Signing**:
  - Android: keystore + Play App Signing setup
  - iOS: certificates + provisioning profiles
- **Store listing assets**:
  - App name, description, keywords
  - App icon, feature graphic(s), screenshots (multiple device sizes)
  - Privacy policy URL + support URL
- **Compliance**:
  - Permissions justification (location, notifications, etc.)
  - Content/age rating
  - App privacy disclosures (especially iOS)
- **Release management**:
  - Testing tracks (internal/closed/open) + production rollout plan

#### B) In‑app subscriptions (required for your model)
- **Product setup in stores**:
  - Subscription products (monthly/yearly), trial/intro offers (if any)
  - Localization and pricing tiers
- **Purchase flow in the app**:
  - iOS: StoreKit integration
  - Android: Google Play Billing integration
- **Receipt/purchase validation (backend)**:
  - Server‑side validation of receipts/tokens
  - Webhooks / real‑time developer notifications handling
  - Subscription state sync (active/cancelled/grace period)
- **Entitlements**:
  - Feature gating based on subscription status
  - Restore purchases flow (iOS/Android)

#### C) Push notifications (if used)
- iOS: APNs configuration
- Android: FCM configuration
- Device token registration endpoints in backend + user preferences

#### D) Analytics / crash reporting (recommended)
- Crash reporting (e.g., Sentry / Firebase Crashlytics)
- Analytics events for signup, subscription, churn, route usage

#### E) QA & testing (required)
- Testing on real devices (Android + iOS)
- Store review checklist testing (permissions, login, subscription purchase/restore)
- Staging environment for safe testing

### Typical mobile release-related costs (common)
- **Code signing & certificates**
  - iOS: certificates/profiles + App Store Connect setup
  - Android: keystore management + Play Console setup
- **CI/CD for mobile builds** (optional but recommended)
  - Examples: GitHub Actions, Bitrise, Codemagic, CircleCI
- **Crash reporting / performance** (optional but recommended)
  - Examples: Sentry, Firebase Crashlytics
- **Push notifications**
  - iOS uses **APNs** (no direct Apple fee)
  - Android commonly uses **FCM** (typically no direct Google fee)
- **Device/testing**
  - Real devices for QA + Apple review edge cases (budget depends on your team)

### Notes
- Store fees are separate from cloud costs (Azure/AWS/Maps).
- If you plan **in‑app subscriptions**, Apple/Google platform commissions apply (depends on product category and eligibility programs).

---

## One‑time / setup costs (optional, but common)

- **Production deployment setup** (Azure/AWS accounts, networking, CI/CD, secrets, monitoring)
- **Merchant onboarding** (KYC/business verification) if payments are enabled
- **Data migration / initial seeding** (if migrating from legacy)

---

## What we need from you (to finalize exact numbers)

Reply with these and I’ll fill the totals with a proper table:
- Expected **active users/month**
- Expected **map opens/day** and **route creations/month**
- Approx **images/month** and average image size (e.g., 300KB–1MB)
- Which payment provider (Stripe/PayPal/other) and expected monthly transaction volume

