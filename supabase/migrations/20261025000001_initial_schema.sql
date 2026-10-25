-- ====================================================================
-- RURAL WORK CONNECT: Production Database Schema Migration
-- Migration: 20261025000001_initial_schema.sql
-- ====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. ENUMS & DOMAINS
-- ====================================================================
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('worker', 'employer', 'both', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE worker_availability_status AS ENUM ('available', 'busy', 'unavailable');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status_type AS ENUM ('draft', 'published', 'in_progress', 'paused', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status_type AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_type AS ENUM ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'disputed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_reason_type AS ENUM (
    'fraudulent_listing',
    'suspicious_payment',
    'harassment_threats',
    'abusive_messages',
    'discrimination',
    'misleading_wage_description',
    'prohibited_exploitation',
    'fake_impersonation',
    'unsafe_worksite',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status_type AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE moderation_action_type AS ENUM ('warn', 'remove_job', 'suspend_account', 'ban_account', 'dismiss');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 2. USER PROFILES & ROLES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  role user_role_type NOT NULL DEFAULT 'worker',
  preferred_language VARCHAR(20) NOT NULL DEFAULT 'en',
  avatar_url TEXT,
  state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
  district VARCHAR(100) NOT NULL,
  village_or_town VARCHAR(150) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_deactivated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(state, district, pincode);

-- User Role Table (for strict multi-role / admin authority)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_role UNIQUE (user_id, role)
);

-- ====================================================================
-- 3. WORKER PROFILES & SKILLS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_years NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
  expected_daily_wage NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
  availability_status worker_availability_status NOT NULL DEFAULT 'available',
  available_hours_type VARCHAR(50) NOT NULL DEFAULT 'Full Day (8 hrs)',
  travel_radius_km INTEGER NOT NULL DEFAULT 15,
  bio TEXT,
  completed_jobs_count INTEGER NOT NULL DEFAULT 0,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  total_reviews_count INTEGER NOT NULL DEFAULT 0,
  -- Privacy settings
  show_phone_publicly BOOLEAN NOT NULL DEFAULT FALSE,
  show_email_publicly BOOLEAN NOT NULL DEFAULT FALSE,
  show_exact_address_publicly BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worker_profiles_availability ON public.worker_profiles(availability_status);
CREATE INDEX IF NOT EXISTS idx_worker_profiles_wage ON public.worker_profiles(expected_daily_wage);

-- Standard Skills Directory
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'wrench',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

-- Worker Skills Junction
CREATE TABLE IF NOT EXISTS public.worker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  custom_skill_name VARCHAR(100),
  proficiency_level VARCHAR(30) DEFAULT 'Experienced',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_worker_skill UNIQUE (worker_id, skill_id, custom_skill_name)
);

-- Worker Schedule / Availability Slots
CREATE TABLE IF NOT EXISTS public.worker_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  available_date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  shift_type VARCHAR(50) NOT NULL DEFAULT 'Full Day',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_worker_date UNIQUE (worker_id, available_date)
);

-- ====================================================================
-- 4. EMPLOYER PROFILES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_or_individual_name VARCHAR(150) NOT NULL,
  employer_type VARCHAR(80) NOT NULL DEFAULT 'Farmer / Landowner', 
  worksite_address TEXT NOT NULL,
  description TEXT,
  preferred_contact_method VARCHAR(50) NOT NULL DEFAULT 'in_app',
  is_identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
  completed_hires_count INTEGER NOT NULL DEFAULT 0,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  total_reviews_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. JOBS & JOB APPLICATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  workers_needed INTEGER NOT NULL DEFAULT 1 CHECK (workers_needed > 0),
  workers_hired INTEGER NOT NULL DEFAULT 0,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  village_or_town VARCHAR(150) NOT NULL,
  worksite_address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  work_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '07:30:00',
  duration_days INTEGER NOT NULL DEFAULT 1 CHECK (duration_days > 0),
  daily_wage NUMERIC(10, 2) NOT NULL CHECK (daily_wage >= 0),
  payment_terms VARCHAR(80) NOT NULL DEFAULT 'Daily Cash at end of work',
  meals_provided BOOLEAN NOT NULL DEFAULT FALSE,
  accommodation_provided BOOLEAN NOT NULL DEFAULT FALSE,
  transport_provided BOOLEAN NOT NULL DEFAULT FALSE,
  equipment_requirements TEXT,
  gender_preference VARCHAR(30) DEFAULT 'Any',
  gender_preference_reason TEXT,
  status job_status_type NOT NULL DEFAULT 'published',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  application_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(state, district, pincode);
CREATE INDEX IF NOT EXISTS idx_jobs_work_date ON public.jobs(work_date);

-- Job Skills Required
CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  custom_skill_name VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  status application_status_type NOT NULL DEFAULT 'pending',
  proposed_wage NUMERIC(10, 2),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_job_application UNIQUE (job_id, worker_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_worker ON public.job_applications(worker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.job_applications(status);

-- Saved / Bookmarked Jobs
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_saved_job UNIQUE (user_id, job_id)
);

-- ====================================================================
-- 6. BOOKINGS & PAYMENTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '08:00:00',
  duration_days INTEGER NOT NULL DEFAULT 1,
  agreed_wage NUMERIC(10, 2) NOT NULL CHECK (agreed_wage >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  work_location TEXT NOT NULL,
  work_description TEXT NOT NULL,
  status booking_status_type NOT NULL DEFAULT 'pending',
  completion_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_employer ON public.bookings(employer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Payment Records
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
  status payment_status_type NOT NULL DEFAULT 'pending',
  provider_reference VARCHAR(150),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 7. MESSAGING & NOTIFICATIONS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_conversation_participant UNIQUE (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);

-- In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  link_url TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id, is_read);

-- ====================================================================
-- 8. REVIEWS & RATINGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_booking_reviewer UNIQUE (booking_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON public.reviews(reviewee_id);

-- ====================================================================
-- 9. CREDITS & REWARDS SYSTEM
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.credit_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 50 CHECK (balance >= 0),
  total_earned INTEGER NOT NULL DEFAULT 50 CHECK (total_earned >= 0),
  total_spent INTEGER NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  transaction_type VARCHAR(50) NOT NULL, -- 'signup_bonus', 'job_completed', 'five_star_review', 'referral', 'feature_boost'
  description TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON public.credit_transactions(user_id, created_at);

-- ====================================================================
-- 10. SAFETY, REPORTS, BLOCKED USERS & MODERATION
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  reason report_reason_type NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  status report_status_type NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_block_pair UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  target_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  action moderation_action_type NOT NULL,
  moderator_id UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  contact_phone VARCHAR(20),
  status VARCHAR(40) NOT NULL DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 11. AUTOMATIC TRIGGERS & FUNCTIONS
-- ====================================================================

-- Function: update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_timestamp ON public.profiles;
CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_worker_profiles_timestamp ON public.worker_profiles;
CREATE TRIGGER update_worker_profiles_timestamp BEFORE UPDATE ON public.worker_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_employer_profiles_timestamp ON public.employer_profiles;
CREATE TRIGGER update_employer_profiles_timestamp BEFORE UPDATE ON public.employer_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_jobs_timestamp ON public.jobs;
CREATE TRIGGER update_jobs_timestamp BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_bookings_timestamp ON public.bookings;
CREATE TRIGGER update_bookings_timestamp BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function: create initial credit account and profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role_type;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'worker')::user_role_type;
  
  -- Create profile
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    role,
    preferred_language,
    district,
    village_or_town,
    pincode,
    state
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    v_role,
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
    COALESCE(NEW.raw_user_meta_data->>'district', 'Madurai'),
    COALESCE(NEW.raw_user_meta_data->>'village_or_town', 'Alanganallur'),
    COALESCE(NEW.raw_user_meta_data->>'pincode', '625501'),
    COALESCE(NEW.raw_user_meta_data->>'state', 'Tamil Nadu')
  );

  -- Create role entry
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role);

  -- Create worker profile if worker or both
  IF v_role = 'worker' OR v_role = 'both' THEN
    INSERT INTO public.worker_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  -- Create employer profile if employer or both
  IF v_role = 'employer' OR v_role = 'both' THEN
    INSERT INTO public.employer_profiles (
      user_id,
      business_or_individual_name,
      worksite_address
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Employer'),
      COALESCE(NEW.raw_user_meta_data->>'village_or_town', 'Main Worksite')
    );
  END IF;

  -- Create credit account with 50 welcome credits
  INSERT INTO public.credit_accounts (user_id, balance, total_earned, total_spent)
  VALUES (NEW.id, 50, 50, 0);

  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    balance_after,
    transaction_type,
    description
  ) VALUES (
    NEW.id,
    50,
    50,
    'signup_bonus',
    'Welcome bonus for registering on Rural Work Connect'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Recalculate average ratings and completed count on review submit
CREATE OR REPLACE FUNCTION public.handle_new_review()
RETURNS TRIGGER AS $$
DECLARE
  v_avg_rating NUMERIC(3,2);
  v_count INTEGER;
BEGIN
  -- Check if reviewee is worker
  SELECT COALESCE(AVG(rating), 0.00), COUNT(*)
  INTO v_avg_rating, v_count
  FROM public.reviews
  WHERE reviewee_id = NEW.reviewee_id;

  -- Update worker profile if exists
  UPDATE public.worker_profiles
  SET average_rating = v_avg_rating,
      total_reviews_count = v_count
  WHERE user_id = NEW.reviewee_id;

  -- Update employer profile if exists
  UPDATE public.employer_profiles
  SET average_rating = v_avg_rating,
      total_reviews_count = v_count
  WHERE user_id = NEW.reviewee_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_review();
