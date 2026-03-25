// ─────────────────────────────────────────────────────────
// Skeleton Loader Components
// ─────────────────────────────────────────────────────────

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-4" />
      <div className="h-4 bg-gray-100 rounded-lg w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded-lg w-4/5 mb-6" />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded-lg w-20" />
        <div className="h-8 bg-gray-100 rounded-lg w-16" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-6" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-50 rounded w-1/4" />
          </div>
          <div className="h-6 bg-gray-100 rounded-full w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="h-10 bg-gray-200 rounded-xl w-1/4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <SkeletonTable />
    </div>
  );
}
