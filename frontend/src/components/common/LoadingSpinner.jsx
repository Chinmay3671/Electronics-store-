import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-semibold text-slate-600">{text}</p>}
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 animate-pulse shadow-sm">
      <div className="w-full h-48 bg-slate-100 rounded-xl" />
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-5 bg-slate-200 rounded w-4/5" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-9 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, actionText, actionLink, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-slate-200 rounded-2xl my-6 shadow-sm">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && (
        actionLink ? (
          <a
            href={actionLink}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm"
          >
            {actionText}
          </a>
        ) : (
          <button
            onClick={onAction}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-md border ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};

export default LoadingSpinner;
