import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  WorkerProfile,
  EmployerProfile,
  Job,
  JobApplication,
  Booking,
  PaymentRecord,
  Conversation,
  ChatMessage,
  NotificationItem,
  Review,
  CreditAccount,
  CreditTransaction,
  SafetyReport,
  ModerationAction,
  AuditLog,
  ActiveRoleMode,
  UserRole,
  JobStatus,
  ApplicationStatus,
  BookingStatus,
  ReportReason,
  ModerationActionType,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_WORKER_PROFILES,
  INITIAL_EMPLOYER_PROFILES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_CREDIT_ACCOUNTS,
  INITIAL_CREDIT_TRANSACTIONS,
  INITIAL_REPORTS,
  INITIAL_MODERATION_ACTIONS,
  INITIAL_AUDIT_LOGS,
} from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

interface AppContextType {
  // Current user & mode
  currentUser: UserProfile | null;
  currentWorkerProfile: WorkerProfile | null;
  currentEmployerProfile: EmployerProfile | null;
  activeRoleMode: ActiveRoleMode;
  setActiveRoleMode: (mode: ActiveRoleMode) => void;
  switchRoleMode: () => void;
  isAdmin: boolean;
  isConfiguredWithSupabase: boolean;

  // Auth actions
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    role: UserRole;
    preferredLanguage: string;
    state: string;
    district: string;
    villageOrTown: string;
    pincode: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateWorkerProfile: (updates: Partial<WorkerProfile>) => Promise<void>;
  updateEmployerProfile: (updates: Partial<EmployerProfile>) => Promise<void>;
  loginAsDemoUser: (role: 'worker' | 'employer' | 'both' | 'admin') => void;

  // Jobs
  jobs: Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'employerId' | 'employerName'>) => Promise<{ success: boolean; job?: Job; error?: string }>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<{ success: boolean; error?: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; error?: string }>;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;

  // Applications
  applications: JobApplication[];
  applyForJob: (jobId: string, proposedWage?: number, message?: string) => Promise<{ success: boolean; error?: string }>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;

  // Bookings
  bookings: Booking[];
  createDirectBooking: (data: {
    workerId: string;
    workDate: string;
    startTime: string;
    durationDays: number;
    agreedWage: number;
    workLocation: string;
    workDescription: string;
  }) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, notes?: string) => Promise<void>;

  // Payments
  payments: PaymentRecord[];
  recordPayment: (bookingId: string, amount: number, method: 'cash' | 'upi' | 'online_gateway') => Promise<void>;

  // Messaging & Notifications
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  startOrGetConversation: (otherUserId: string, jobId?: string) => string;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reviews
  reviews: Review[];
  submitReview: (bookingId: string, rating: number, feedback: string, tags: string[]) => Promise<{ success: boolean; error?: string }>;

  // Credits
  creditAccount: CreditAccount | null;
  creditTransactions: CreditTransaction[];

  // Safety & Moderation
  reports: SafetyReport[];
  submitReport: (report: {
    reportedUserId?: string;
    jobId?: string;
    reason: ReportReason;
    description: string;
    evidenceUrls?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  moderationActions: ModerationAction[];
  blockedUserIds: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  resolveReportByAdmin: (reportId: string, action: ModerationActionType, notes: string) => Promise<void>;
  auditLogs: AuditLog[];
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`rwc_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`rwc_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage save error', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core State
  const [users, setUsers] = useState<UserProfile[]>(() => loadFromStorage('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const storedId = localStorage.getItem('rwc_current_user_id');
    const allUsers = loadFromStorage('users', INITIAL_USERS);
    return allUsers.find((u: UserProfile) => u.id === storedId) || allUsers[0]; // default to worker Ramanathan
  });

  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>(() =>
    loadFromStorage('worker_profiles', INITIAL_WORKER_PROFILES)
  );
  const [employerProfiles, setEmployerProfiles] = useState<EmployerProfile[]>(() =>
    loadFromStorage('employer_profiles', INITIAL_EMPLOYER_PROFILES)
  );
  const [activeRoleMode, setActiveRoleModeState] = useState<ActiveRoleMode>(() => {
    return (localStorage.getItem('rwc_active_mode') as ActiveRoleMode) || 'worker';
  });

  // Entities
  const [jobs, setJobs] = useState<Job[]>(() => loadFromStorage('jobs', INITIAL_JOBS));
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => loadFromStorage('saved_jobs', ['job-1']));
  const [applications, setApplications] = useState<JobApplication[]>(() =>
    loadFromStorage('applications', INITIAL_APPLICATIONS)
  );
  const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage('bookings', INITIAL_BOOKINGS));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadFromStorage('payments', INITIAL_PAYMENTS));
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadFromStorage('conversations', INITIAL_CONVERSATIONS)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadFromStorage('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));
  const [creditAccounts, setCreditAccounts] = useState<Record<string, CreditAccount>>(() =>
    loadFromStorage('credit_accounts', INITIAL_CREDIT_ACCOUNTS)
  );
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(() =>
    loadFromStorage('credit_transactions', INITIAL_CREDIT_TRANSACTIONS)
  );
  const [reports, setReports] = useState<SafetyReport[]>(() => loadFromStorage('reports', INITIAL_REPORTS));
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>(() =>
    loadFromStorage('moderation_actions', INITIAL_MODERATION_ACTIONS)
  );
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => loadFromStorage('blocked_users', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS));

  // Sync to local storage
  useEffect(() => saveToStorage('users', users), [users]);
  useEffect(() => saveToStorage('worker_profiles', workerProfiles), [workerProfiles]);
  useEffect(() => saveToStorage('employer_profiles', employerProfiles), [employerProfiles]);
  useEffect(() => saveToStorage('jobs', jobs), [jobs]);
  useEffect(() => saveToStorage('saved_jobs', savedJobIds), [savedJobIds]);
  useEffect(() => saveToStorage('applications', applications), [applications]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('payments', payments), [payments]);
  useEffect(() => saveToStorage('conversations', conversations), [conversations]);
  useEffect(() => saveToStorage('messages', messages), [messages]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('credit_accounts', creditAccounts), [creditAccounts]);
  useEffect(() => saveToStorage('credit_transactions', creditTransactions), [creditTransactions]);
  useEffect(() => saveToStorage('reports', reports), [reports]);
  useEffect(() => saveToStorage('moderation_actions', moderationActions), [moderationActions]);
  useEffect(() => saveToStorage('blocked_users', blockedUserIds), [blockedUserIds]);
  useEffect(() => saveToStorage('audit_logs', auditLogs), [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rwc_current_user_id', currentUser.id);
      if (currentUser.role === 'worker') {
        setActiveRoleModeState('worker');
      } else if (currentUser.role === 'employer') {
        setActiveRoleModeState('employer');
      }
    }
  }, [currentUser]);

  const setActiveRoleMode = (mode: ActiveRoleMode) => {
    setActiveRoleModeState(mode);
    localStorage.setItem('rwc_active_mode', mode);
  };

  const switchRoleMode = () => {
    const next = activeRoleMode === 'worker' ? 'employer' : 'worker';
    setActiveRoleMode(next);
  };

  const currentWorkerProfile = currentUser
    ? workerProfiles.find((wp) => wp.userId === currentUser.id) || null
    : null;

  const currentEmployerProfile = currentUser
    ? employerProfiles.find((ep) => ep.userId === currentUser.id) || null
    : null;

  const isAdmin = currentUser?.role === 'admin';

  // Auth Operations
  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'TestPass123!',
        });
        if (error) return { success: false, error: error.message };
        // Fetch profile
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (prof) {
          setCurrentUser(prof);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login error, falling back to local store', err);
      }
    }

    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }
    return { success: false, error: 'User not found. Try one of the demo accounts or register below.' };
  };

  const signUp = async (data: {
    fullName: string;
    phone: string;
    email: string;
    password?: string;
    role: UserRole;
    preferredLanguage: string;
    state: string;
    district: string;
    villageOrTown: string;
    pincode: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const newId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      role: data.role,
      preferredLanguage: data.preferredLanguage,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.fullName)}`,
      state: data.state,
      district: data.district,
      villageOrTown: data.villageOrTown,
      pincode: data.pincode,
      isVerified: false,
      isDeactivated: false,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    if (data.role === 'worker' || data.role === 'both') {
      const newWp: WorkerProfile = {
        id: `wp-${Date.now()}`,
        userId: newId,
        experienceYears: 1.0,
        expectedDailyWage: 600,
        availabilityStatus: 'available',
        availableHoursType: 'Full Day',
        travelRadiusKm: 15,
        bio: 'Ready for daily wage work in agriculture and general labour.',
        skills: ['General Physical Labour', 'Farm & Yard Clearing'],
        completedJobsCount: 0,
        averageRating: 0,
        totalReviewsCount: 0,
        showPhonePublicly: false,
        showEmailPublicly: false,
        showExactAddressPublicly: false,
        createdAt: new Date().toISOString(),
      };
      setWorkerProfiles((prev) => [newWp, ...prev]);
    }

    if (data.role === 'employer' || data.role === 'both') {
      const newEp: EmployerProfile = {
        id: `ep-${Date.now()}`,
        userId: newId,
        businessOrIndividualName: data.fullName,
        employerType: 'Farmer / Landowner',
        worksiteAddress: `${data.villageOrTown}, ${data.district}`,
        description: 'Providing daily-wage employment opportunities.',
        preferredContactMethod: 'in_app',
        isIdentityVerified: false,
        completedHiresCount: 0,
        averageRating: 0,
        totalReviewsCount: 0,
        createdAt: new Date().toISOString(),
      };
      setEmployerProfiles((prev) => [newEp, ...prev]);
    }

    // Initialize Credit Account with 50 Welcome bonus
    const newCreditAccount: CreditAccount = {
      id: `ca-${Date.now()}`,
      userId: newId,
      balance: 50,
      totalEarned: 50,
      totalSpent: 0,
      updatedAt: new Date().toISOString(),
    };
    setCreditAccounts((prev) => ({ ...prev, [newId]: newCreditAccount }));

    const newTx: CreditTransaction = {
      id: `ctx-${Date.now()}`,
      userId: newId,
      amount: 50,
      balanceAfter: 50,
      transactionType: 'signup_bonus',
      description: 'Welcome bonus for registering on Rural Work Connect',
      createdAt: new Date().toISOString(),
    };
    setCreditTransactions((prev) => [newTx, ...prev]);

    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('rwc_current_user_id');
    setCurrentUser(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const updateWorkerProfile = async (updates: Partial<WorkerProfile>) => {
    if (!currentWorkerProfile) return;
    const updated = { ...currentWorkerProfile, ...updates };
    setWorkerProfiles((prev) => prev.map((wp) => (wp.id === currentWorkerProfile.id ? updated : wp)));
  };

  const updateEmployerProfile = async (updates: Partial<EmployerProfile>) => {
    if (!currentEmployerProfile) return;
    const updated = { ...currentEmployerProfile, ...updates };
    setEmployerProfiles((prev) => prev.map((ep) => (ep.id === currentEmployerProfile.id ? updated : ep)));
  };

  const loginAsDemoUser = (role: 'worker' | 'employer' | 'both' | 'admin') => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
      if (role === 'worker') setActiveRoleMode('worker');
      if (role === 'employer') setActiveRoleMode('employer');
    }
  };

  // Job Actions
  const createJob = async (
    jobData: Omit<Job, 'id' | 'createdAt' | 'employerId' | 'employerName'>
  ): Promise<{ success: boolean; job?: Job; error?: string }> => {
    if (!currentUser || !currentEmployerProfile) {
      return { success: false, error: 'Only employers can create job listings.' };
    }

    if (jobData.dailyWage < 100) {
      return { success: false, error: 'Daily wage must be at least ₹100/day.' };
    }

    if (!jobData.title.trim() || !jobData.description.trim()) {
      return { success: false, error: 'Job title and description are required.' };
    }

    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      employerId: currentEmployerProfile.id,
      employerName: currentEmployerProfile.businessOrIndividualName,
      employerType: currentEmployerProfile.employerType,
      employerRating: currentEmployerProfile.averageRating,
      employerVerified: currentEmployerProfile.isIdentityVerified,
      workersHired: 0,
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);

    // Add audit log
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actionType: 'CREATE_JOB',
      entityType: 'JOB',
      entityId: newJob.id,
      details: { title: newJob.title, wage: newJob.dailyWage, location: newJob.villageOrTown },
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    return { success: true, job: newJob };
  };

  const updateJob = async (id: string, updates: Partial<Job>): Promise<{ success: boolean; error?: string }> => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j)));
    return { success: true };
  };

  const deleteJob = async (id: string): Promise<{ success: boolean; error?: string }> => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    return { success: true };
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
  };

  // Applications
  const applyForJob = async (
    jobId: string,
    proposedWage?: number,
    message?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !currentWorkerProfile) {
      return { success: false, error: 'Only registered workers can apply for jobs.' };
    }

    // Check duplicate
    const exists = applications.find((a) => a.jobId === jobId && a.workerId === currentWorkerProfile.id);
    if (exists) {
      return { success: false, error: 'You have already submitted an application for this job.' };
    }

    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) {
      return { success: false, error: 'Job not found.' };
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      jobCategory: targetJob.category,
      jobWage: targetJob.dailyWage,
      jobWorkDate: targetJob.workDate,
      jobLocation: `${targetJob.villageOrTown}, ${targetJob.district}`,
      workerId: currentWorkerProfile.id,
      workerName: currentUser.fullName,
      workerPhone: currentWorkerProfile.showPhonePublicly ? currentUser.phone : undefined,
      workerDistrict: currentUser.district,
      workerRating: currentWorkerProfile.averageRating,
      workerExperience: currentWorkerProfile.experienceYears,
      workerSkills: currentWorkerProfile.skills,
      status: 'pending',
      proposedWage: proposedWage || targetJob.dailyWage,
      message,
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Send notification to employer
    const empUser = users.find((u) => {
      const ep = employerProfiles.find((p) => p.id === targetJob.employerId);
      return ep ? u.id === ep.userId : false;
    });

    if (empUser) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: empUser.id,
        title: 'New Application Received',
        body: `${currentUser.fullName} applied for your job "${targetJob.title}".`,
        linkUrl: '/applicants',
        type: 'application',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return { success: true };
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status, updatedAt: new Date().toISOString() } : app))
    );

    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    const targetJob = jobs.find((j) => j.id === targetApp.jobId);
    if (!targetJob) return;

    // Notify worker
    const workerProf = workerProfiles.find((wp) => wp.id === targetApp.workerId);
    if (workerProf) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientId: workerProf.userId,
        title: status === 'accepted' ? 'Application Accepted!' : `Application ${status}`,
        body: `Your application for "${targetJob.title}" has been ${status}.`,
        linkUrl: status === 'accepted' ? '/bookings' : '/applications',
        type: 'application',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    // If accepted, automatically generate confirmed booking!
    if (status === 'accepted') {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        employerId: targetJob.employerId,
        employerName: targetJob.employerName,
        workerId: targetApp.workerId,
        workerName: targetApp.workerName,
        workDate: targetJob.workDate,
        startTime: targetJob.startTime,
        durationDays: targetJob.durationDays,
        agreedWage: targetApp.proposedWage || targetJob.dailyWage,
        totalAmount: (targetApp.proposedWage || targetJob.dailyWage) * targetJob.durationDays,
        workLocation: targetJob.worksiteAddress,
        workDescription: targetJob.description,
        status: 'accepted',
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [newBooking, ...prev]);

      // Create initial recorded payment entry
      const newPay: PaymentRecord = {
        id: `pay-${Date.now()}`,
        bookingId: newBooking.id,
        jobTitle: targetJob.title,
        workerName: targetApp.workerName,
        employerName: targetJob.employerName,
        amount: newBooking.totalAmount,
        currency: 'INR',
        paymentMethod: 'cash',
        status: 'pending',
        notes: `Agreed cash payment at worksite upon job completion (${targetJob.paymentTerms})`,
        createdAt: new Date().toISOString(),
      };
      setPayments((prev) => [newPay, ...prev]);

      // Update workers hired counter
      setJobs((prev) =>
        prev.map((j) => (j.id === targetJob.id ? { ...j, workersHired: j.workersHired + 1 } : j))
      );
    }
  };

  // Direct Bookings
  const createDirectBooking = async (data: {
    workerId: string;
    workDate: string;
    startTime: string;
    durationDays: number;
    agreedWage: number;
    workLocation: string;
    workDescription: string;
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
    if (!currentUser || !currentEmployerProfile) {
      return { success: false, error: 'Only employers can request bookings.' };
    }

    const worker = workerProfiles.find((w) => w.id === data.workerId);
    if (!worker) return { success: false, error: 'Worker profile not found.' };

    const workerUser = users.find((u) => u.id === worker.userId);
    const workerName = workerUser?.fullName || 'Worker';

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      employerId: currentEmployerProfile.id,
      employerName: currentEmployerProfile.businessOrIndividualName,
      workerId: data.workerId,
      workerName: workerName,
      workDate: data.workDate,
      startTime: data.startTime,
      durationDays: data.durationDays,
      agreedWage: data.agreedWage,
      totalAmount: data.agreedWage * data.durationDays,
      workLocation: data.workLocation,
      workDescription: data.workDescription,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send notification to worker
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientId: worker.userId,
      title: 'New Booking Request!',
      body: `${currentEmployerProfile.businessOrIndividualName} sent you a work booking request for ${data.workDate}.`,
      linkUrl: '/bookings',
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus, notes?: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status, completionNotes: notes || b.completionNotes, updatedAt: new Date().toISOString() } : b
      )
    );

    const b = bookings.find((item) => item.id === bookingId);
    if (!b) return;

    // When status changes to completed, award platform credits!
    if (status === 'completed') {
      const worker = workerProfiles.find((wp) => wp.id === b.workerId);
      if (worker) {
        // Increment completed jobs count
        setWorkerProfiles((prev) =>
          prev.map((wp) => (wp.id === worker.id ? { ...wp, completedJobsCount: wp.completedJobsCount + 1 } : wp))
        );

        // Award 100 Credits to worker
        const wUserId = worker.userId;
        const currentBal = creditAccounts[wUserId]?.balance || 0;
        const nextBal = currentBal + 100;

        setCreditAccounts((prev) => ({
          ...prev,
          [wUserId]: {
            id: prev[wUserId]?.id || `ca-${Date.now()}`,
            userId: wUserId,
            balance: nextBal,
            totalEarned: (prev[wUserId]?.totalEarned || 0) + 100,
            totalSpent: prev[wUserId]?.totalSpent || 0,
            updatedAt: new Date().toISOString(),
          },
        }));

        const newTx: CreditTransaction = {
          id: `ctx-${Date.now()}`,
          userId: wUserId,
          amount: 100,
          balanceAfter: nextBal,
          transactionType: 'job_completed',
          description: `Reward for successfully completing work: "${b.workDescription.slice(0, 30)}..."`,
          referenceId: b.id,
          createdAt: new Date().toISOString(),
        };
        setCreditTransactions((prev) => [newTx, ...prev]);
      }
    }
  };

  // Payment Recording
  const recordPayment = async (bookingId: string, amount: number, method: 'cash' | 'upi' | 'online_gateway') => {
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      bookingId,
      amount,
      currency: 'INR',
      paymentMethod: method,
      status: 'paid',
      notes: `Payment recorded via ${method.toUpperCase()} by employer`,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setPayments((prev) => [newPay, ...prev]);
  };

  // Messaging
  const sendMessage = async (conversationId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: content.trim(), lastMessageAt: new Date().toISOString() } : c
      )
    );
  };

  const startOrGetConversation = (otherUserId: string, jobId?: string): string => {
    if (!currentUser) return '';

    const existing = conversations.find(
      (c) => c.participantIds.includes(currentUser.id) && c.participantIds.includes(otherUserId)
    );

    if (existing) return existing.id;

    const otherUser = users.find((u) => u.id === otherUserId);
    const newConvId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      jobId,
      participantIds: [currentUser.id, otherUserId],
      otherUserId,
      otherUserName: otherUser?.fullName || 'User',
      otherUserRole: otherUser?.role || 'worker',
      otherUserAvatar: otherUser?.avatarUrl,
      lastMessage: 'Conversation started',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConvId;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Reviews
  const submitReview = async (
    bookingId: string,
    rating: number,
    feedback: string,
    tags: string[]
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Must be logged in to review' };

    const b = bookings.find((item) => item.id === bookingId);
    if (!b) return { success: false, error: 'Booking not found' };

    if (b.status !== 'completed') {
      return { success: false, error: 'Reviews are only permitted for completed work.' };
    }

    const isWorker = currentWorkerProfile && b.workerId === currentWorkerProfile.id;
    const isEmployer = currentEmployerProfile && b.employerId === currentEmployerProfile.id;

    if (!isWorker && !isEmployer) {
      return { success: false, error: 'You are not a participant in this booking.' };
    }

    // Determine reviewee
    let revieweeId = '';
    let revieweeName = '';
    let reviewerRole: 'worker' | 'employer' = 'worker';

    if (isWorker) {
      reviewerRole = 'worker';
      const ep = employerProfiles.find((p) => p.id === b.employerId);
      revieweeId = ep ? ep.userId : '';
      revieweeName = b.employerName;
    } else {
      reviewerRole = 'employer';
      const wp = workerProfiles.find((p) => p.id === b.workerId);
      revieweeId = wp ? wp.userId : '';
      revieweeName = b.workerName;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      bookingId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.fullName,
      reviewerRole,
      revieweeId,
      revieweeName,
      rating,
      feedback,
      tags,
      isFlagged: false,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Mark reviewed on booking
    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId
          ? {
              ...item,
              hasWorkerReviewed: isWorker ? true : item.hasWorkerReviewed,
              hasEmployerReviewed: isEmployer ? true : item.hasEmployerReviewed,
            }
          : item
      )
    );

    // Recalculate average rating for reviewee
    const allUserReviews = [...reviews, newRev].filter((r) => r.revieweeId === revieweeId);
    const avg = allUserReviews.reduce((sum, r) => sum + r.rating, 0) / allUserReviews.length;

    setWorkerProfiles((prev) =>
      prev.map((wp) =>
        wp.userId === revieweeId
          ? { ...wp, averageRating: Number(avg.toFixed(1)), totalReviewsCount: allUserReviews.length }
          : wp
      )
    );

    setEmployerProfiles((prev) =>
      prev.map((ep) =>
        ep.userId === revieweeId
          ? { ...ep, averageRating: Number(avg.toFixed(1)), totalReviewsCount: allUserReviews.length }
          : ep
      )
    );

    return { success: true };
  };

  // Safety & Moderation
  const submitReport = async (report: {
    reportedUserId?: string;
    jobId?: string;
    reason: ReportReason;
    description: string;
    evidenceUrls?: string[];
  }): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Must be logged in to submit a report' };

    const newReport: SafetyReport = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.fullName,
      reportedUserId: report.reportedUserId,
      jobId: report.jobId,
      reason: report.reason,
      description: report.description,
      evidenceUrls: report.evidenceUrls,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    return { success: true };
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
  };

  const resolveReportByAdmin = async (reportId: string, action: ModerationActionType, notes: string) => {
    if (!isAdmin || !currentUser) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'resolved',
              adminNotes: notes,
              resolvedBy: currentUser.id,
              resolvedAt: new Date().toISOString(),
            }
          : r
      )
    );

    const targetRep = reports.find((r) => r.id === reportId);
    if (!targetRep) return;

    const newMod: ModerationAction = {
      id: `mod-${Date.now()}`,
      reportId,
      targetUserId: targetRep.reportedUserId || '',
      targetJobId: targetRep.jobId,
      action,
      moderatorId: currentUser.id,
      moderatorName: currentUser.fullName,
      reason: notes,
      createdAt: new Date().toISOString(),
    };
    setModerationActions((prev) => [newMod, ...prev]);

    // If action is remove_job, delete job
    if (action === 'remove_job' && targetRep.jobId) {
      setJobs((prev) => prev.filter((j) => j.id !== targetRep.jobId));
    }

    // If ban or suspend, update user profile
    if ((action === 'ban_account' || action === 'suspend_account') && targetRep.reportedUserId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetRep.reportedUserId ? { ...u, isDeactivated: true } : u))
      );
    }
  };

  const currentCreditAccount = currentUser ? creditAccounts[currentUser.id] || null : null;
  const userTransactions = currentUser
    ? creditTransactions.filter((tx) => tx.userId === currentUser.id)
    : [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentWorkerProfile,
        currentEmployerProfile,
        activeRoleMode,
        setActiveRoleMode,
        switchRoleMode,
        isAdmin,
        isConfiguredWithSupabase: isSupabaseConfigured,
        login,
        signUp,
        logout,
        updateUserProfile,
        updateWorkerProfile,
        updateEmployerProfile,
        loginAsDemoUser,
        jobs,
        createJob,
        updateJob,
        deleteJob,
        savedJobIds,
        toggleSaveJob,
        applications,
        applyForJob,
        updateApplicationStatus,
        bookings,
        createDirectBooking,
        updateBookingStatus,
        payments,
        recordPayment,
        conversations,
        messages,
        sendMessage,
        startOrGetConversation,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        reviews,
        submitReview,
        creditAccount: currentCreditAccount,
        creditTransactions: userTransactions,
        reports,
        submitReport,
        moderationActions,
        blockedUserIds,
        blockUser,
        unblockUser,
        resolveReportByAdmin,
        auditLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
