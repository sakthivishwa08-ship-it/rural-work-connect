# Rural Work Connect (கிராமப்புற வேலை இணைப்பு)

Rural Work Connect is a production-oriented, full-stack rural daily-wage employment web application built for India. It connects rural workers seeking fair daily wages with verified landowners, contractors, small business owners, and households.

The platform is designed to run seamlessly on low-cost Android smartphones, small screens, and slower mobile internet connections, featuring large touch targets, voice-assisted search, text-to-speech audio readers, bottom navigation, and dual-language primacy (Tamil and English, with architecture for all 22 Eighth Schedule Indian languages).

---

## 1. Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom brand palette (warm greens, sky blues, amber accents)
- **Icons**: Lucide React
- **Backend & Database**: Supabase with PostgreSQL (Tables, Foreign Keys, Triggers, Views)
- **Security & Authorization**: Supabase Row Level Security (RLS) with role-based policies
- **Authentication**: Supabase Auth (Email & Password, verification links, password recovery)
- **Storage**: Supabase Storage (`avatars` and `job-images` buckets)
- **Voice & Accessibility**: Web Speech API for voice search and Text-to-Speech audio reader
- **Offline / Demo Resilience**: Built-in interactive state synchronization engine ensuring 100% functionality even prior to entering Supabase credentials.

---

## 2. File and Folder Structure

```
rural-work-connect/
├── .env.example                       # Environment variables template
├── .env                               # Active configuration file
├── .gitignore                         # Git ignored files
├── index.html                         # Mobile-responsive HTML root with Noto Sans Tamil fonts
├── package.json                       # Dependencies & scripts
├── postcss.config.js                  # PostCSS configuration
├── tailwind.config.js                 # Tailwind CSS theme with brand tokens
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.node.json                 # Node TypeScript configuration
├── vite.config.ts                     # Vite build configuration
├── public/
│   ├── favicon.svg                    # Rural sprout & harvest logo
│   └── site.webmanifest               # PWA web manifest
├── supabase/
│   ├── README.md                      # Detailed browser setup guide for Supabase
│   └── migrations/
│       ├── 20261025000001_initial_schema.sql    # Core tables, enums, triggers, & indexes
│       ├── 20261025000002_rls_and_policies.sql  # Row Level Security (RLS) policies
│       └── 20261025000003_seed_data.sql         # Standard Indian rural work skills seed
└── src/
    ├── main.tsx                       # React root entry point
    ├── App.tsx                        # 27-route master navigation & layout container
    ├── index.css                      # Global styles & touch-friendly base rules
    ├── types/
    │   └── index.ts                   # Strict TypeScript domain interfaces
    ├── lib/
    │   ├── supabase.ts                # Supabase client initializer & connection detector
    │   ├── store.tsx                  # Global state management & persistence engine
    │   ├── mockData.ts                # High-fidelity seed data for Indian rural employment
    │   ├── speech.ts                  # Web Speech API (Voice Search & Text-to-Speech)
    │   └── locations.ts               # Indian states, districts, PIN validation & categories
    ├── i18n/
    │   ├── index.ts                   # i18n context provider & language hook
    │   ├── languagesList.ts           # All 22 Eighth Schedule languages directory
    │   ├── en.ts                      # English dictionary
    │   ├── ta.ts                      # Tamil dictionary (கிராமப்புற வேலை இணைப்பு)
    │   ├── hi.ts                      # Hindi dictionary (ग्रामीण रोजगार संगम)
    │   └── te.ts                      # Telugu dictionary (గ్రామీణ పని కనెక్ట్)
    ├── components/
    │   ├── common/
    │   │   ├── Button.tsx             # 48px touch-target accessible button
    │   │   ├── Badge.tsx              # Contrast status pill
    │   │   ├── Card.tsx               # Reusable card container
    │   │   ├── Modal.tsx              # Responsive dialog & mobile bottom sheet
    │   │   ├── VoiceSearchInput.tsx   # Voice-enabled input with pulsating mic
    │   │   ├── SpeakButton.tsx        # "Listen to Job Details" audio speaker
    │   │   ├── SupabaseStatusBanner.tsx# Top connection status & 1-click role switcher
    │   │   └── EmptyState.tsx         # Helpful empty state illustration & action
    │   ├── layout/
    │   │   ├── Header.tsx             # Responsive header with language selector
    │   │   ├── BottomNav.tsx          # Mobile bottom navigation bar
    │   │   ├── Footer.tsx             # National emergency numbers & legal disclaimers
    │   │   └── RoleSwitcher.tsx       # 1-click dual-role switcher (Worker / Employer)
    │   ├── jobs/
    │   │   ├── JobCard.tsx            # Comprehensive job listing card with audio reader
    │   │   └── JobFiltersModal.tsx    # Multi-criteria filter dialog
    │   ├── workers/
    │   │   └── WorkerCard.tsx         # Worker profile card with availability & wage
    │   └── safety/
    │       ├── SafetyTipsCard.tsx     # 5 Golden Rules for rural worksite safety
    │       └── EmergencyModal.tsx     # Direct dial modal for 112, 181, 14434, 1098
    └── pages/
        ├── LandingPage.tsx            # 1. Landing Page with voice search & categories
        ├── SignUpPage.tsx             # 2. Registration with role & PIN validation
        ├── LoginPage.tsx              # 3. Secure login with 1-click demo accounts
        ├── EmailVerificationPage.tsx  # 4. Email verification status & resend
        ├── PasswordRecoveryPage.tsx   # 5. Forgot password & reset link flow
        ├── WorkerDashboard.tsx        # 6. Worker console with availability toggle
        ├── EmployerDashboard.tsx      # 7. Landowner/Employer hiring console
        ├── AdminDashboard.tsx         # 8. Moderation console & audit logs
        ├── WorkerProfilePage.tsx      # 9. Worker skills, wage, & privacy settings
        ├── EmployerProfilePage.tsx    # 10. Employer worksite & rating profile
        ├── JobSearchPage.tsx          # 11. Search & filter jobs with voice input
        ├── JobDetailsPage.tsx         # 12. Full job details, apply modal, & report
        ├── CreateEditJobPage.tsx      # 13. Job posting form with preview modal
        ├── MyApplicationsPage.tsx     # 14. Worker application history & withdrawal
        ├── ApplicantsManagementPage.tsx# 15. Employer applicant review & hiring
        ├── WorkerDiscoveryPage.tsx    # 16. Search workers & send direct booking
        ├── BookingDetailsHistoryPage.tsx# 17. Booking states, work completion & reviews
        ├── MessagingPage.tsx          # 18. Secure in-app chat with block & abuse report
        ├── NotificationsPage.tsx      # 19. Notifications list & read state
        ├── ReviewsPage.tsx            # 20. Verified community ratings & reviews hub
        ├── CreditsTransactionsPage.tsx# 21. Platform reward credits ledger
        ├── PaymentRecordsPage.tsx     # 22. Recorded cash settlements & gateway status
        ├── SavedJobsPage.tsx          # 23. Bookmarked jobs collection
        ├── ReportsSafetyPage.tsx      # 24. Safety guidelines & incident report form
        ├── SettingsLanguagePage.tsx   # 25. 22 Eighth Schedule language hub & account
        ├── HelpSupportPage.tsx        # 26. FAQ & grievance redressal ticket form
        └── PrivacyTermsPage.tsx       # 27. Terms, DPDP Act privacy & zero-advance rule
```

---

## 3. Database Schema & Row Level Security (RLS)

All database migrations are located in `supabase/migrations/`:

1. **`20261025000001_initial_schema.sql`**:
   - `profiles` (UUID primary key, full name, phone, email, district, village, state, PIN, verification status)
   - `user_roles` (admin / worker / employer / both)
   - `worker_profiles` (experience, expected daily wage, availability status, skills, completed jobs, rating)
   - `employer_profiles` (business name, employer type, worksite address, rating, verified badge)
   - `skills` & `worker_skills` (standard rural skills directory)
   - `jobs` & `job_skills` (daily wage in numeric(10,2), start time, workers needed/hired, amenities)
   - `job_applications` (status transitions: pending, accepted, rejected, withdrawn)
   - `bookings` (statuses: pending, accepted, in_progress, completed, cancelled, disputed)
   - `conversations`, `conversation_participants`, `messages`
   - `notifications`
   - `reviews` (1 to 5 stars, tags, only permitted after genuine work completion)
   - `credit_accounts` & `credit_transactions` (immutable ledger)
   - `payment_records` (cash, UPI, gateway, amount, status)
   - `reports`, `blocked_users`, `moderation_actions`, `audit_logs`
   - Automatic triggers for timestamps, profile initialization on signup, and rating recalculation.

2. **`20261025000002_rls_and_policies.sql`**:
   - Full PostgreSQL Row Level Security enabled on all 24 tables.
   - Workers can only edit their own applications and profiles.
   - Employers can only edit their own jobs and manage their applicants.
   - Booking participants can only access their relevant bookings.
   - Conversations & messages are restricted to authorized participants.
   - Credit balances, payment statuses, and admin roles cannot be edited by standard users.

3. **`20261025000003_seed_data.sql`**:
   - Pre-seeds 30+ authentic Indian rural trade skills across Agriculture, Construction, Painting, Electrical, Plumbing, Cleaning, Driving, and General Labour.

---

## 4. Connecting Supabase From the Browser

You can configure Supabase entirely through your mobile or desktop browser without installing local database software:

1. Visit [supabase.com](https://supabase.com) and create a free project (recommended region: `ap-south-1` Mumbai).
2. Go to **Project Settings** -> **API**.
3. Copy **Project URL** and **anon public key**.
4. In your `.env` or Bolt environment settings, set:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. In Supabase Dashboard, click **SQL Editor** -> **New query**.
6. Copy and paste the 3 SQL migration files in order:
   - `supabase/migrations/20261025000001_initial_schema.sql`
   - `supabase/migrations/20261025000002_rls_and_policies.sql`
   - `supabase/migrations/20261025000003_seed_data.sql`
7. Click **Run** for each.
8. Under **Storage**, create two public buckets: `avatars` and `job-images`.

---

## 5. Configuring Email Verification

1. In Supabase Dashboard, navigate to **Authentication** -> **Providers** -> **Email**.
2. Ensure **Enable Email Provider** is toggled **ON**.
3. Under **Confirm email**:
   - Turn **ON** "Confirm email" for production to require workers and employers to verify their email before accessing unverified features.
4. Under **URL Configuration**:
   - Set **Site URL** to your Bolt.new or deployment domain (e.g. `https://your-app.bolt.new`).
   - Add `http://localhost:5173` and your production URL to **Redirect URLs**.

---

## 6. Provisioning an Initial Administrator

Per strict security specifications, administrator registration is not exposed to the public. To promote a user to administrator:

1. Register an account through the app (e.g., `admin@ruralworkconnect.in`).
2. Run this single SQL query in your Supabase SQL Editor:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM public.profiles WHERE email = 'admin@ruralworkconnect.in'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
3. That account will now have administrative authorization, accessing the moderation queue, account suspension tools, and audit logs at `/admin`.

---

## 7. Running or Previewing the Application

### In Bolt.new / Browser:
1. Open or fork the project directory directly in [Bolt.new](https://bolt.new).
2. Bolt automatically installs packages and launches Vite on port `5173`.
3. The interactive Supabase banner at the top shows:
   - **Green Badge** when live Supabase credentials are configured.
   - **Amber Badge (Interactive Demo Mode)** when credentials have not yet been added. In Demo Mode, all 27 pages, state transitions, bookings, chat, and reviews are completely interactive with persistent local storage.

### Local Development (Optional):
```bash
npm install
npm run dev
```

---

## 8. Publishing & Deployment Workflow

1. **Deploying via Bolt.new**: Tap the **"Deploy"** or **"Publish"** button in the top right header of Bolt.
2. **Deploying via Vercel / Netlify**:
   - Connect your GitHub repository.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Set Environment Variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 9. Fully Implemented Features Matrix

| Feature | Status | Details |
|---|---|---|
| **Multi-Role Authentication** | ✅ Verified | Worker, Employer, Both, and Admin roles with session persistence |
| **Dual-Role Switcher** | ✅ Verified | Seamless toggle between Worker Mode and Employer Mode without duplicate accounts |
| **Worker Profiles & Skills** | ✅ Verified | Wages, experience, travel radius, availability toggle, custom skills addition |
| **Privacy Safeguards** | ✅ Verified | Automatic concealment of phone numbers, emails, and exact addresses from search |
| **Job Posting System** | ✅ Verified | Complete posting, editing, wage validation, amenities, preview modal |
| **Job Discovery & Search** | ✅ Verified | Voice input, district/state filters, wage sliders, categories, sort by wage/date |
| **Applications Workflow** | ✅ Verified | Apply with message, duplicate prevention, withdrawal, employer acceptance |
| **Direct Worker Booking** | ✅ Verified | Direct employer request, accept/reject, state transitions, completion flow |
| **Completed Work Reviews** | ✅ Verified | 1 to 5 stars, tags, strictly permitted only after confirmed job completion |
| **In-App Messaging** | ✅ Verified | Realtime chat between active participants with user blocking and abuse reporting |
| **Reward Credits Ledger** | ✅ Verified | Non-cash platform points for milestones (+50 signup, +100 job, +25 review) |
| **Payments Module** | ✅ Verified | Worksite cash receipts & UPI tracking with honest "Not Configured" gateway status |
| **Safety & Moderation** | ✅ Verified | Abuse reports queue, admin warning/suspension/ban actions, audit logs |
| **National Helplines** | ✅ Verified | 1-click dial modal for 112, 181, 14434, and 1098 |
| **Eighth Schedule Languages** | ✅ Verified | Selector for all 22 Indian languages; Tamil, Hindi, Telugu & English active |
| **Speech Accessibility** | ✅ Verified | Web Speech API voice search and Text-to-Speech audio announcement reader |
| **Mobile-First UX** | ✅ Verified | Min 48px touch targets, mobile bottom navigation, responsive on low-cost Androids |
