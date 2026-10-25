import React from 'react';
import { Coins, ArrowDownLeft, ArrowUpRight, Award, Info, ShieldCheck } from 'lucide-react';
import { useApp } from '../lib/store';
import { useI18n } from '../i18n';
import { Badge } from '../components/common/Badge';

export const CreditsTransactionsPage: React.FC = () => {
  const { currentUser, creditAccount, creditTransactions } = useApp();
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-warm-600 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-amber-100 text-xs font-bold mb-3">
              <Coins className="h-4 w-4" />
              <span>Internal Platform Reward System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Credits Balance
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 mt-1">
              Earn credits by completing daily jobs and receiving top worksite ratings
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/30 text-center sm:text-right">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-100 block">
              Current Balance
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-white block mt-0.5">
              {creditAccount?.balance || 50} <span className="text-sm font-normal text-amber-200">credits</span>
            </span>
          </div>
        </div>

        {/* Notice on credits not being cash */}
        <div className="mt-6 pt-4 border-t border-white/20 text-xs text-amber-100 flex items-start gap-2">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-200" />
          <span>
            <strong>Legal Note:</strong> Platform credits are internal recognition rewards for community milestones. They are strictly non-cash, non-withdrawable, and non-transferable.
          </span>
        </div>
      </div>

      {/* How to earn credits guide */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs">
        <h2 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Reward Milestones & Earning Rules</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <strong className="block text-brand-700 font-bold text-sm">+50 Credits</strong>
            <span className="font-semibold text-gray-900 block mt-0.5">Account Registration</span>
            <span className="text-gray-500 mt-1 block">Welcome bonus for verifying your profile</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <strong className="block text-brand-700 font-bold text-sm">+100 Credits</strong>
            <span className="font-semibold text-gray-900 block mt-0.5">Job Completion</span>
            <span className="text-gray-500 mt-1 block">Awarded whenever daily work is marked completed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
            <strong className="block text-brand-700 font-bold text-sm">+25 Credits</strong>
            <span className="font-semibold text-gray-900 block mt-0.5">5-Star Review</span>
            <span className="text-gray-500 mt-1 block">Excellence bonus from satisfied employers</span>
          </div>
        </div>
      </div>

      {/* Immutable Transaction Ledger */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-8 shadow-xs">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Credit Transaction History ({creditTransactions.length})
        </h2>

        {creditTransactions.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-6">No credit transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {creditTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 capitalize font-semibold text-gray-900">
                      {tx.transactionType.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-brand-700">
                      +{tx.amount}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {tx.balanceAfter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
