import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
    />
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-5 shadow-xs">
      <Skeleton className="h-48 w-full rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-14 rounded-md" />
      </div>
      <div className="flex justify-between pt-4 border-t border-slate-100">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};
