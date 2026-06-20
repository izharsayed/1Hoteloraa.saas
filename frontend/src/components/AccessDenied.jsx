import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';
import { getCurrentUser, getDefaultRedirect } from '../utils/permissions';

/**
 * AccessDenied — shown when a user navigates to a route they don't have permission for.
 */
function AccessDenied() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const roleLabel = user?.userRole
    ? user.userRole.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
    : 'Unknown';

  const handleGoHome = () => {
    const path = user ? getDefaultRedirect(user.userRole) : '/login';
    navigate(path, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-danger-pale border border-danger/20 flex items-center justify-center mb-6 shadow-sm">
          <ShieldOff className="w-10 h-10 text-danger" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-display font-bold text-charcoal mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-slate mb-1">
          Your role <span className="font-semibold text-navy">({roleLabel})</span> does not have permission to view this page.
        </p>
        <p className="text-xs text-slate/70 mb-8">
          Contact your Tenant Administrator to request access.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-cream bg-white text-slate text-sm font-medium hover:bg-surface-linen hover:text-navy transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-gold text-sm font-medium hover:bg-charcoal transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
