// Rural Work Connect TypeScript Type Definitions

export type UserRole = 'worker' | 'employer' | 'both' | 'admin';
export type ActiveRoleMode = 'worker' | 'employer';
export type WorkerAvailabilityStatus = 'available' | 'busy' | 'unavailable';
export type JobStatus = 'draft' | 'published' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'cancelled';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'cash' | 'upi' | 'online_gateway';

export type ReportReason =
  | 'fraudulent_listing'
  | 'suspicious_payment'
  | 'harassment_threats'
  | 'abusive_messages'
  | 'discrimination'
  | 'misleading_wage_description'
  | 'prohibited_exploitation'
  | 'fake_impersonation'
  | 'unsafe_worksite'
  | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';
export type ModerationActionType = 'warn' | 'remove_job' | 'suspend_account' | 'ban_account' | 'dismiss';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  preferredLanguage: string;
  avatarUrl?: string;
  state: string;
  district: string;
  villageOrTown: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isDeactivated: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  user?: UserProfile;
  experienceYears: number;
  expectedDailyWage: number;
  availabilityStatus: WorkerAvailabilityStatus;
  availableHoursType: string;
  travelRadiusKm: number;
  bio?: string;
  skills: string[];
  completedJobsCount: number;
  averageRating: number;
  totalReviewsCount: number;
  showPhonePublicly: boolean;
  showEmailPublicly: boolean;
  showExactAddressPublicly: boolean;
  createdAt: string;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  user?: UserProfile;
  businessOrIndividualName: string;
  employerType: string;
  worksiteAddress: string;
  description?: string;
  preferredContactMethod: string;
  isIdentityVerified: boolean;
  completedHiresCount: number;
  averageRating: number;
  totalReviewsCount: number;
  createdAt: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerType?: string;
  employerRating?: number;
  employerVerified?: boolean;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  workersNeeded: number;
  workersHired: number;
  state: string;
  district: string;
  villageOrTown: string;
  worksiteAddress: string;
  pincode: string;
  workDate: string;
  startTime: string;
  durationDays: number;
  dailyWage: number;
  paymentTerms: string;
  mealsProvided: boolean;
  accommodationProvided: boolean;
  transportProvided: boolean;
  equipmentRequirements?: string;
  genderPreference: 'Any' | 'Male' | 'Female';
  genderPreferenceReason?: string;
  status: JobStatus;
  images: string[];
  applicationDeadline?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  jobCategory?: string;
  jobWage?: number;
  jobWorkDate?: string;
  jobLocation?: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  workerDistrict?: string;
  workerRating: number;
  workerExperience: number;
  workerSkills?: string[];
  status: ApplicationStatus;
  proposedWage?: number;
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  jobId?: string;
  jobTitle?: string;
  employerId: string;
  employerName: string;
  employerPhone?: string;
  workerId: string;
  workerName: string;
  workerPhone?: string;
  workDate: string;
  startTime: string;
  durationDays: number;
  agreedWage: number;
  totalAmount: number;
  workLocation: string;
  workDescription: string;
  status: BookingStatus;
  completionNotes?: string;
  hasWorkerReviewed?: boolean;
  hasEmployerReviewed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  jobTitle?: string;
  workerName?: string;
  employerName?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  providerReference?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  jobId?: string;
  jobTitle?: string;
  bookingId?: string;
  participantIds: string[];
  otherUserId: string;
  otherUserName: string;
  otherUserRole: string;
  otherUserAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  linkUrl?: string;
  type: 'application' | 'booking' | 'review' | 'system' | 'safety';
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'worker' | 'employer';
  revieweeId: string;
  revieweeName: string;
  rating: number; // 1 to 5
  feedback?: string;
  tags: string[];
  isFlagged: boolean;
  createdAt: string;
}

export interface CreditAccount {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  transactionType: 'signup_bonus' | 'job_completed' | 'five_star_review' | 'referral' | 'feature_boost';
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedUserId?: string;
  reportedUserName?: string;
  jobId?: string;
  jobTitle?: string;
  reason: ReportReason;
  description: string;
  evidenceUrls?: string[];
  status: ReportStatus;
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ModerationAction {
  id: string;
  reportId?: string;
  targetUserId: string;
  targetUserName?: string;
  targetJobId?: string;
  action: ModerationActionType;
  moderatorId: string;
  moderatorName?: string;
  reason: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorName?: string;
  actionType: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}
