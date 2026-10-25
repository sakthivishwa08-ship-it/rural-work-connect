-- ====================================================================
-- RURAL WORK CONNECT: Row Level Security (RLS) & Access Policies
-- Migration: 20261025000002_rls_and_policies.sql
-- ====================================================================

-- 1. Helper function: Check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper function: Get current user profile ID
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ====================================================================
-- ENABLE RLS ON ALL TABLES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- PROFILES POLICIES
-- ====================================================================
-- Anyone authenticated can view public profiles (sensitive phone/email protected in application layer)
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (is_deactivated = FALSE OR is_admin());

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (is_admin());

-- ====================================================================
-- USER ROLES POLICIES
-- ====================================================================
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- Only admins can insert or update user_roles (prevents privilege escalation)
CREATE POLICY "Only admins can modify user roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ====================================================================
-- WORKER PROFILES POLICIES
-- ====================================================================
CREATE POLICY "Worker profiles are viewable by everyone authenticated"
  ON public.worker_profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Workers can update their own worker profile"
  ON public.worker_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Workers can insert their worker profile"
  ON public.worker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ====================================================================
-- EMPLOYER PROFILES POLICIES
-- ====================================================================
CREATE POLICY "Employer profiles are viewable by everyone authenticated"
  ON public.employer_profiles FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Employers can update their own employer profile"
  ON public.employer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can insert their employer profile"
  ON public.employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ====================================================================
-- SKILLS & WORKER SKILLS
-- ====================================================================
CREATE POLICY "Skills are viewable by all authenticated users"
  ON public.skills FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Worker skills viewable by authenticated users"
  ON public.worker_skills FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Workers can manage their own skills"
  ON public.worker_skills FOR ALL
  TO authenticated
  USING (worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()))
  WITH CHECK (worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()));

-- ====================================================================
-- JOBS POLICIES
-- ====================================================================
-- Anyone authenticated can view published jobs
CREATE POLICY "Published jobs are viewable by authenticated users"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (
    status = 'published' 
    OR status = 'in_progress'
    OR employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Employers can create jobs
CREATE POLICY "Employers can create jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

-- Employers can update their own jobs
CREATE POLICY "Employers can update their own jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  )
  WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Employers can delete their own jobs
CREATE POLICY "Employers can delete their own jobs"
  ON public.jobs FOR DELETE
  TO authenticated
  USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- ====================================================================
-- JOB APPLICATIONS POLICIES
-- ====================================================================
CREATE POLICY "Applications viewable by applicant worker or job employer"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid())
    OR job_id IN (
      SELECT j.id FROM public.jobs j 
      JOIN public.employer_profiles ep ON j.employer_id = ep.id 
      WHERE ep.user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "Workers can create applications"
  ON public.job_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Workers and Employers can update relevant applications"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid())
    OR job_id IN (
      SELECT j.id FROM public.jobs j 
      JOIN public.employer_profiles ep ON j.employer_id = ep.id 
      WHERE ep.user_id = auth.uid()
    )
    OR is_admin()
  );

-- ====================================================================
-- BOOKINGS POLICIES
-- ====================================================================
CREATE POLICY "Bookings viewable only by participants or admin"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid())
    OR employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Employers can initiate bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can update their bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid())
    OR employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    OR is_admin()
  );

-- ====================================================================
-- MESSAGES & CONVERSATIONS POLICIES
-- ====================================================================
CREATE POLICY "Conversations viewable by participants"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Conversation participants can view their participation"
  ON public.conversation_participants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Messages viewable by conversation participants"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Participants can post messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
  );

-- ====================================================================
-- NOTIFICATIONS POLICIES
-- ====================================================================
CREATE POLICY "Users can view and update their own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- ====================================================================
-- REVIEWS POLICIES
-- ====================================================================
CREATE POLICY "Reviews viewable by authenticated users"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (is_flagged = FALSE OR is_admin());

CREATE POLICY "Users can create reviews for their completed bookings"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND b.status = 'completed'
      AND (
        (b.employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()) AND reviewee_id IN (SELECT user_id FROM public.worker_profiles WHERE id = b.worker_id))
        OR
        (b.worker_id IN (SELECT id FROM public.worker_profiles WHERE user_id = auth.uid()) AND reviewee_id IN (SELECT user_id FROM public.employer_profiles WHERE id = b.employer_id))
      )
    )
  );

-- ====================================================================
-- CREDITS & REWARDS POLICIES
-- ====================================================================
CREATE POLICY "Users view their own credit account"
  ON public.credit_accounts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users view their own credit transactions"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- Users cannot insert or modify credit balance directly; handled via secure functions or admin
CREATE POLICY "Only admins or triggers can modify credits"
  ON public.credit_accounts FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ====================================================================
-- REPORTS & SAFETY POLICIES
-- ====================================================================
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view their submitted reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid() OR is_admin());

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users manage their blocked users list"
  ON public.blocked_users FOR ALL
  TO authenticated
  USING (blocker_id = auth.uid())
  WITH CHECK (blocker_id = auth.uid());

CREATE POLICY "Admins manage moderation actions"
  ON public.moderation_actions FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Audit logs viewable only by admins"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (is_admin());
