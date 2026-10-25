import React, { useState } from 'react';
import { Database, CheckCircle, Info, ExternalLink, ChevronDown, UserCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../../lib/store';
import { Modal } from './Modal';
import { Button } from './Button';

export const SupabaseStatusBanner: React.FC = () => {
  const { isConfiguredWithSupabase, currentUser, loginAsDemoUser, isAdmin } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-emerald-950 text-white text-xs px-3 py-2 border-b border-emerald-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isConfiguredWithSupabase ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/40">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Supabase Connected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/40">
              <Database className="h-3.5 w-3.5" />
              <span>Demo Mode (Supabase not connected)</span>
            </span>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="text-gray-300 hover:text-white underline inline-flex items-center gap-1 ml-1 cursor-pointer transition-colors"
          >
            <Info className="h-3 w-3" />
            <span>Connection Instructions</span>
          </button>
        </div>

        {/* Quick Demo Role Switcher for instant testing */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-medium transition-all"
            >
              <UserCheck className="h-3.5 w-3.5 text-brand-400" />
              <span>Test as: <strong className="text-white">{currentUser?.fullName.split(' ')[0] || 'User'} ({currentUser?.role})</strong></span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showDemoSelector && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-1.5 z-50 text-left">
                <div className="text-[11px] font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => {
                    loginAsDemoUser('worker');
                    setShowDemoSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-900/40 text-gray-200 hover:text-white flex items-center justify-between"
                >
                  <span>Ramanathan (Worker - Mason)</span>
                  <span className="text-[10px] text-brand-400">Worker</span>
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser('employer');
                    setShowDemoSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-900/40 text-gray-200 hover:text-white flex items-center justify-between"
                >
                  <span>Sundaram (Farmer / Landowner)</span>
                  <span className="text-[10px] text-sky-400">Employer</span>
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser('both');
                    setShowDemoSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-900/40 text-gray-200 hover:text-white flex items-center justify-between"
                >
                  <span>Arulraj (Contractor & Worker)</span>
                  <span className="text-[10px] text-purple-400">Both Roles</span>
                </button>
                <button
                  onClick={() => {
                    loginAsDemoUser('admin');
                    setShowDemoSelector(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-900/40 text-red-200 hover:text-white flex items-center justify-between"
                >
                  <span>District Labour Officer</span>
                  <span className="text-[10px] text-red-400">Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supabase Instructions Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Supabase Backend Integration Status"
        maxWidth="lg"
      >
        <div className="space-y-4 text-sm text-gray-700">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-600" />
              <span>Current Status: {isConfiguredWithSupabase ? 'Active Supabase Connection' : 'Interactive Demo Mode Active'}</span>
            </h4>
            <p className="text-gray-600 text-xs">
              {isConfiguredWithSupabase
                ? 'Your project is successfully reading and writing directly to your live PostgreSQL database on Supabase.'
                : 'Supabase credentials are not yet set in your environment variables. The platform is currently running with high-fidelity pre-seeded data, allowing all features (applications, bookings, chat, reviews, payments, credits) to be tested without errors.'}
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-1.5">How to connect your own Supabase project:</h5>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-600">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 underline font-medium inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="h-3 w-3" />
                </a>.
              </li>
              <li>
                Open Supabase <strong>SQL Editor</strong> and execute the 3 migration files included in this project under:
                <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-[11px] text-gray-800">
                  1. supabase/migrations/20261025000001_initial_schema.sql<br />
                  2. supabase/migrations/20261025000002_rls_and_policies.sql<br />
                  3. supabase/migrations/20261025000003_seed_data.sql
                </div>
              </li>
              <li>
                Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from Supabase Project Settings -&gt; API.
              </li>
              <li>
                Add them into your environment variables or <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">.env</code>:
                <pre className="bg-gray-900 text-emerald-400 p-2 rounded mt-1 font-mono text-[11px] overflow-x-auto">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
                </pre>
              </li>
              <li>
                Restart or redeploy the application. The banner will immediately change to green "Supabase Connected"!
              </li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
