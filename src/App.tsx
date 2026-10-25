import React, { useState, useEffect } from 'react';
import { useApp } from './lib/store';
import { SupabaseStatusBanner } from './components/common/SupabaseStatusBanner';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { EmergencyModal } from './components/safety/EmergencyModal';

// 27 Pages
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { PasswordRecoveryPage } from './pages/PasswordRecoveryPage';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { EmployerProfilePage } from './pages/EmployerProfilePage';
import { JobSearchPage } from './pages/JobSearchPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { CreateEditJobPage } from './pages/CreateEditJobPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ApplicantsManagementPage } from './pages/ApplicantsManagementPage';
import { WorkerDiscoveryPage } from './pages/WorkerDiscoveryPage';
import { BookingDetailsHistoryPage } from './pages/BookingDetailsHistoryPage';
import { MessagingPage } from './pages/MessagingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CreditsTransactionsPage } from './pages/CreditsTransactionsPage';
import { PaymentRecordsPage } from './pages/PaymentRecordsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ReportsSafetyPage } from './pages/ReportsSafetyPage';
import { SettingsLanguagePage } from './pages/SettingsLanguagePage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';

export const App: React.FC = () => {
  const { currentUser, activeRoleMode, isAdmin } = useApp();

  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [navParams, setNavParams] = useState<any>({});
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Navigate function with params and auto scroll-to-top
  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is logged in and visits landing initially, let's keep landing accessible or switch to dashboard
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} onOpenEmergency={() => setIsEmergencyModalOpen(true)} />;
      case 'signup':
        return <SignUpPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'email-verification':
        return <EmailVerificationPage onNavigate={navigate} />;
      case 'password-recovery':
        return <PasswordRecoveryPage onNavigate={navigate} />;
      case 'worker-dashboard':
        return <WorkerDashboard onNavigate={navigate} onOpenEmergency={() => setIsEmergencyModalOpen(true)} />;
      case 'employer-dashboard':
        return <EmployerDashboard onNavigate={navigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={navigate} />;
      case 'worker-profile':
        return <WorkerProfilePage onNavigate={navigate} workerId={navParams.workerId} />;
      case 'employer-profile':
        return <EmployerProfilePage onNavigate={navigate} />;
      case 'job-search':
        return (
          <JobSearchPage
            onNavigate={navigate}
            initialQuery={navParams.query}
            initialCategory={navParams.category}
          />
        );
      case 'job-details':
        return <JobDetailsPage onNavigate={navigate} jobId={navParams.jobId || 'job-1'} />;
      case 'create-job':
        return <CreateEditJobPage onNavigate={navigate} jobToEditId={navParams.jobId} />;
      case 'applications':
        return <MyApplicationsPage onNavigate={navigate} />;
      case 'applicants':
        return <ApplicantsManagementPage onNavigate={navigate} jobId={navParams.jobId} />;
      case 'worker-discovery':
        return <WorkerDiscoveryPage onNavigate={navigate} />;
      case 'bookings':
        return <BookingDetailsHistoryPage onNavigate={navigate} />;
      case 'messaging':
        return <MessagingPage onNavigate={navigate} initialConversationId={navParams.conversationId} />;
      case 'notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case 'reviews':
        return <ReviewsPage />;
      case 'credits':
        return <CreditsTransactionsPage />;
      case 'payments':
        return <PaymentRecordsPage />;
      case 'saved-jobs':
        return <SavedJobsPage onNavigate={navigate} />;
      case 'safety':
        return (
          <ReportsSafetyPage
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            reportedJobId={navParams.reportedJobId}
            reportedJobTitle={navParams.jobTitle}
            reportedUserId={navParams.reportedUserId}
            reportedUserName={navParams.reportedUserName}
          />
        );
      case 'settings':
        return <SettingsLanguagePage onNavigate={navigate} />;
      case 'help':
        return <HelpSupportPage onOpenEmergency={() => setIsEmergencyModalOpen(true)} />;
      case 'privacy':
        return <PrivacyTermsPage />;
      default:
        return <LandingPage onNavigate={navigate} onOpenEmergency={() => setIsEmergencyModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-brand-500 selection:text-white pb-16 lg:pb-0">
      {/* 1. Supabase Status Banner */}
      <SupabaseStatusBanner />

      {/* 2. Dual-Role Switcher (if user role is 'both') */}
      <RoleSwitcher />

      {/* 3. Header Navigation */}
      <Header onNavigate={navigate} currentPage={currentPage} />

      {/* 4. Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* 5. Emergency Contacts Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* 6. Footer */}
      <Footer onNavigate={navigate} />

      {/* 7. Mobile Bottom Navigation (for Android phones) */}
      <BottomNav onNavigate={navigate} currentPage={currentPage} />
    </div>
  );
};
