import React, { useState } from 'react';
import { Star, CheckCircle, ShieldCheck, Filter } from 'lucide-react';
import { useApp } from '../lib/store';
import { Badge } from '../components/common/Badge';

export const ReviewsPage: React.FC = () => {
  const { reviews } = useApp();
  const [filterRating, setFilterRating] = useState<number>(0);

  const filtered = reviews.filter((r) => {
    if (filterRating > 0 && r.rating !== filterRating) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Community Ratings & Reviews
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Verified worksite reviews submitted exclusively by real workers and employers upon genuine job completion
        </p>
      </div>

      {/* Filter by star rating */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterRating(0)}
          className={`px-3 py-1.5 rounded-full font-bold border transition-colors ${
            filterRating === 0
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map((stars) => (
          <button
            key={stars}
            onClick={() => setFilterRating(stars)}
            className={`px-3 py-1.5 rounded-full font-bold border transition-colors flex items-center gap-1 ${
              filterRating === stars
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{stars} Stars</span>
            <Star className="h-3 w-3 fill-current" />
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs text-xs sm:text-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-gray-900 block text-base">
                  {rev.reviewerName}
                </span>
                <span className="text-xs text-gray-400 capitalize">
                  Reviewing {rev.revieweeName} ({rev.reviewerRole === 'worker' ? 'as Worker' : 'as Employer'})
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{rev.rating}.0 / 5.0</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              "{rev.feedback}"
            </p>

            <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-gray-400 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {rev.tags.map((t) => (
                  <Badge key={t} variant="brand" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>
              <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
