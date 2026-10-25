# Rural Work Connect - Supabase Backend Setup

This document provides step-by-step instructions for connecting and configuring Supabase for **Rural Work Connect** directly from your mobile browser or desktop.

---

## 1. Create a Free Supabase Project

1. Open your browser and navigate to [https://supabase.com](https://supabase.com).
2. Sign in or create a free account.
3. Tap **"New Project"**.
4. Choose an organization, enter a project name: `rural-work-connect`.
5. Set a strong database password and select the region nearest to India (e.g. `ap-south-1` Mumbai or `ap-southeast-1` Singapore).
6. Tap **"Create new project"** and wait ~2 minutes for it to provision.

---

## 2. Obtain API Keys & Configure Environment

1. In your Supabase Dashboard, click on **Settings** (gear icon) -> **API**.
2. Copy the following values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **anon / public key** (safe for browser use)
3. In your project, set them in your `.env` or in Bolt.new environment variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. **Never expose the `service_role` secret key** in the browser or frontend code.

---

## 3. Run the Database Migrations

You can run the SQL schema directly inside the browser using Supabase's SQL Editor:

1. In Supabase Dashboard, click **SQL Editor** in the left sidebar.
2. Click **"New query"**.
3. Open and copy the contents of `supabase/migrations/20261025000001_initial_schema.sql` and paste it into the editor, then click **Run** (green button).
4. Create a second query, paste the contents of `supabase/migrations/20261025000002_rls_and_policies.sql`, and click **Run**.
5. Create a third query, paste the contents of `supabase/migrations/20261025000003_seed_data.sql`, and click **Run**.

All tables, Row Level Security (RLS) policies, triggers, and skill categories are now ready!

---

## 4. Configure Authentication & Email Verification

1. Go to **Authentication** -> **Providers** -> **Email**.
2. Make sure **"Enable Email Provider"** is turned ON.
3. Under **"Confirm email"**:
   - Turn **ON** "Confirm email" for production to require email verification.
   - For rapid testing or demo purposes, you can toggle it off if desired.
4. Under **URL Configuration**:
   - Set **Site URL** to your Bolt.new or deployed URL (e.g., `https://your-app.bolt.new`).
   - Add `http://localhost:5173` and your production URL to **Redirect URLs**.

---

## 5. Storage Buckets (For Profile Pictures & Job Photos)

1. In Supabase Dashboard, click **Storage** -> **New bucket**.
2. Create a bucket named `avatars` with **Public bucket** set to ON.
3. Create a bucket named `job-images` with **Public bucket** set to ON.

---

## 6. Provisioning the Initial Administrator

Per strict security guidelines, administrator privileges cannot be granted by public registration. To promote an account to admin:

1. Register an account through the app sign-up page (e.g., `admin@ruralworkconnect.in`).
2. Go to **SQL Editor** in your Supabase dashboard and run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM public.profiles WHERE email = 'admin@ruralworkconnect.in'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
3. When that user logs in, they will automatically gain access to the **Admin Dashboard** (`/admin`), moderation queue, audit logs, and system metrics.

---

## 7. Built-in Offline / Demo Mode Fallback

If you run the app before configuring Supabase credentials, the application automatically enters **Demo Mode**:
- Full interactivity without crashes or blank screens.
- Pre-loaded with realistic Indian rural employment jobs, verified profiles, active bookings, simulated messaging, reviews, and credits ledger.
- Persistent banner shows connection status and allows instant testing.
