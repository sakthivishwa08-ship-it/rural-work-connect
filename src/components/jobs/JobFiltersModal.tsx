import React from 'react';
import { INDIAN_STATES_DISTRICTS, WORK_CATEGORIES } from '../../lib/locations';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export interface FilterState {
  state: string;
  district: string;
  category: string;
  minWage: number;
  maxWage: number;
  workDate: string;
  mealsOnly: boolean;
  sortBy: 'newest' | 'wage_high' | 'wage_low' | 'earliest';
}

interface JobFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const JobFiltersModal: React.FC<JobFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) => {
  const selectedStateObj = INDIAN_STATES_DISTRICTS.find((s) => s.state === filters.state);
  const districtOptions = selectedStateObj ? selectedStateObj.districts : [];

  const handleChange = (field: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Job Listings" maxWidth="md">
      <div className="space-y-4 text-sm text-gray-800">
        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Work Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
          >
            <option value="">All Categories (வேலை வகைகள்)</option>
            {WORK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* State & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => {
                handleChange('state', e.target.value);
                handleChange('district', '');
              }}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
            >
              <option value="">All States</option>
              {INDIAN_STATES_DISTRICTS.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              District
            </label>
            <select
              value={filters.district}
              onChange={(e) => handleChange('district', e.target.value)}
              disabled={!filters.state}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm disabled:opacity-50"
            >
              <option value="">All Districts</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Wage Range */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Daily Wage Range (₹ / day)
            </label>
            <span className="text-xs font-semibold text-brand-700">
              ₹{filters.minWage} - ₹{filters.maxWage}+
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-500">Min Wage</span>
              <input
                type="number"
                min="0"
                step="50"
                value={filters.minWage}
                onChange={(e) => handleChange('minWage', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-xs text-gray-500">Max Wage</span>
              <input
                type="number"
                min="0"
                step="50"
                value={filters.maxWage}
                onChange={(e) => handleChange('maxWage', Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Work Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Work Date
          </label>
          <input
            type="date"
            value={filters.workDate}
            onChange={(e) => handleChange('workDate', e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Meals Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="mealsOnly"
            checked={filters.mealsOnly}
            onChange={(e) => handleChange('mealsOnly', e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
          />
          <label htmlFor="mealsOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
            Only show jobs with free food/meals provided
          </label>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Sort Listings By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'newest', label: 'Newest Listed' },
              { id: 'wage_high', label: 'Wage: High to Low' },
              { id: 'wage_low', label: 'Wage: Low to High' },
              { id: 'earliest', label: 'Earliest Start Date' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleChange('sortBy', option.id)}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  filters.sortBy === option.id
                    ? 'bg-brand-50 border-brand-500 text-brand-800 ring-1 ring-brand-500'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear All Filters
          </Button>
          <Button variant="primary" size="md" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};
