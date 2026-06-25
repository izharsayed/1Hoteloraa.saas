import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, ArrowLeft, KeyRound, RefreshCw, ShieldCheck, Copy, CopyCheck } from 'lucide-react';
import api from '../utils/api.js';

// Role → redirect path mapping (single source of truth)
const ROLE_REDIRECT = {
  SUPER_ADMIN:  '/superadmin',
  TENANT_ADMIN: '/admin',
  MANAGER:      '/',
  RECEPTIONIST: '/rooms',
  CASHIER:      '/pos',
  WAITER:       '/waiter',
  CHEF:         '/kitchen',
  HOUSEKEEPING: '/housekeeping',
  ACCOUNTANT:   '/reports',
};

const demoRoles = [
  {
    name: 'Super Admin',
    email: 'SuperAdmin@hoteloraa.com',
    password: 'superadminsecret',
    color: 'from-purple-600 to-indigo-700',
    badge: 'SA',
    desc: 'Full SaaS control',
  },
  {
    name: 'Tenant Admin',
    email: 'admin@royalpalace.com',
    password: 'password123',
    color: 'from-amber-500 to-yellow-600',
    badge: 'TA',
    desc: 'Property owner',
  },
  {
    name: 'Manager',
    email: 'faisal@royalpalace.com',
    password: 'password123',
    color: 'from-blue-600 to-cyan-600',
    badge: 'MG',
    desc: 'All operations',
  },
  {
    name: 'Receptionist',
    email: 'priya@royalpalace.com',
    password: 'password123',
    color: 'from-teal-500 to-emerald-600',
    badge: 'RC',
    desc: 'Front desk & rooms',
  },
  {
    name: 'Cashier',
    email: 'mustkim@caferoma.com',
    password: 'password123',
    color: 'from-green-500 to-lime-600',
    badge: 'CA',
    desc: 'POS & billing',
  },
  {
    name: 'Waiter',
    email: 'ravi@royalpalace.com',
    password: 'password123',
    color: 'from-orange-500 to-amber-500',
    badge: 'WT',
    desc: 'Tables & orders',
  },
  {
    name: 'Kitchen Staff',
    email: 'tanvir@royalpalace.com',
    password: 'password123',
    color: 'from-red-500 to-orange-600',
    badge: 'KS',
    desc: 'KOT monitor',
  },
  {
    name: 'Housekeeping',
    email: 'sunita@royalpalace.com',
    password: 'password123',
    color: 'from-sky-500 to-blue-500',
    badge: 'HK',
    desc: 'Room cleaning',
  },
  {
    name: 'Accountant',
    email: 'rahul@royalpalace.com',
    password: 'password123',
    color: 'from-violet-500 to-purple-600',
    badge: 'AC',
    desc: 'Reports & inventory',
  },
];

// ─── Sub-component: Step 2 — Request Reset Code ──────────────────────────────
function ForgotStep({ onBack, onCodeReceived }) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [result, setResult]   = useState(null); // { resetToken, userName, email, expiresIn }
  const [copied, setCopied]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.forgotPassword(email);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.resetToken) {
      navigator.clipboard.writeText(result.resetToken).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // If we got a token, show the "code reveal" screen
  if (result) {
    return (
      <div className="w-full flex flex-col items-center gap-5 animate-fadeIn">
        {/* Success header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1">
            <ShieldCheck className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h4 className="font-display font-semibold text-lg text-charcoal">Reset Code Generated</h4>
          <p className="text-slate text-[11px] leading-relaxed max-w-[280px]">
            {result.userName
              ? `Hello ${result.userName}! Your one-time reset code is below.`
              : 'If that email is registered, a code has been generated.'}
          </p>
        </div>

        {result.resetToken ? (
          <>
            {/* Token display box */}
            <div className="w-full bg-navy/5 border border-navy/20 rounded-2xl p-4 flex flex-col items-center gap-2">
              <p className="text-[10px] font-bold text-slate/70 uppercase tracking-widest">Your Reset Code</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-black text-[#0B1F3A] tracking-[0.3em] select-all">
                  {result.resetToken}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy code"
                  className="p-1.5 rounded-lg bg-white border border-border-cream hover:border-gold/50 text-slate hover:text-gold transition-all active:scale-95"
                >
                  {copied
                    ? <CopyCheck className="w-4 h-4 text-emerald-500" />
                    : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate/60">
                ⏱ Expires in <span className="font-bold text-amber-600">{result.expiresIn || '15 minutes'}</span>
              </p>
            </div>

            {/* Dev note */}
            <div className="w-full bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-[10px] text-amber-700 leading-relaxed">
              <strong>Note:</strong> In production, this code would be sent to <span className="font-mono font-bold">{result.email}</span> via email. Copy the code above and use it on the next step.
            </div>

            <button
              type="button"
              onClick={() => onCodeReceived(result.resetToken)}
              className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#142d50] text-white rounded-full font-bold text-xs tracking-wider transition-all shadow-md active:scale-[0.98] uppercase flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Use This Code to Reset Password
            </button>
          </>
        ) : (
          // Email not found — generic message shown
          <div className="w-full bg-slate-50 border border-border-cream rounded-2xl p-4 text-center text-[11px] text-slate leading-relaxed">
            If an account with that email exists, a reset code would be sent there.
          </div>
        )}

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-1">
          <KeyRound className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
        </div>
        <h4 className="font-display font-semibold text-lg text-charcoal">Forgot Password?</h4>
        <p className="text-slate text-[11px] leading-relaxed max-w-[280px]">
          Enter your email address and we'll generate a secure reset code for you.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 bg-danger-pale border border-danger/20 rounded-xl text-danger text-[11px] font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
            <Mail className="w-4 h-4" />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-cream rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold text-charcoal placeholder-slate/50 transition-all"
            placeholder="Your registered email address"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#142d50] disabled:bg-[#0B1F3A]/70 text-white rounded-full font-bold text-xs tracking-wider transition-all shadow-md active:scale-[0.98] uppercase flex items-center justify-center gap-2"
        >
          {loading
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Code...</>
            : <><KeyRound className="w-4 h-4" /> Generate Reset Code</>}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Sign In
      </button>
    </div>
  );
}

// ─── Sub-component: Step 3 — Reset Password ──────────────────────────────────
function ResetStep({ prefillToken, onBack, onSuccess }) {
  const [token, setToken]               = useState(prefillToken || '');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPass, setConfirmPass]   = useState('');
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const passwordsMatch = newPassword && confirmPass && newPassword === confirmPass;
  const passwordStrength = newPassword.length >= 8
    ? (newPassword.match(/[A-Z]/) && newPassword.match(/[0-9]/) ? 'strong' : 'medium')
    : newPassword.length >= 6 ? 'weak' : '';

  const strengthColors = { weak: 'bg-red-400', medium: 'bg-amber-400', strong: 'bg-emerald-500' };
  const strengthLabels = { weak: 'Weak', medium: 'Medium', strong: 'Strong' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.resetPassword(token.trim().toUpperCase(), newPassword, confirmPass);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1">
          <Lock className="w-7 h-7 text-emerald-500" strokeWidth={1.5} />
        </div>
        <h4 className="font-display font-semibold text-lg text-charcoal">Set New Password</h4>
        <p className="text-slate text-[11px] leading-relaxed max-w-[280px]">
          Enter your reset code and choose a strong new password.
        </p>
      </div>

      {error && (
        <div className="w-full p-3 bg-danger-pale border border-danger/20 rounded-xl text-danger text-[11px] font-bold text-center">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-3">
        {/* Reset token input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
            <KeyRound className="w-4 h-4" />
          </span>
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-cream rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono text-sm font-black text-charcoal placeholder-slate/40 tracking-widest transition-all text-center uppercase"
            placeholder="RESET CODE"
            maxLength={8}
            autoFocus={!prefillToken}
          />
        </div>

        {/* New Password */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
            <Lock className="w-4 h-4" />
          </span>
          <input
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full pl-11 pr-11 py-3.5 bg-white border border-border-cream rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold text-charcoal placeholder-slate/50 transition-all"
            placeholder="New password (min. 6 characters)"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-navy transition-colors"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password strength bar */}
        {newPassword && (
          <div className="px-1 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {['weak', 'medium', 'strong'].map((level, i) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    (passwordStrength === 'weak' && i === 0) ||
                    (passwordStrength === 'medium' && i <= 1) ||
                    (passwordStrength === 'strong' && i <= 2)
                      ? strengthColors[passwordStrength]
                      : 'bg-border-cream'
                  }`}
                />
              ))}
            </div>
            <span className={`text-[10px] font-bold ${
              passwordStrength === 'strong' ? 'text-emerald-600'
              : passwordStrength === 'medium' ? 'text-amber-600'
              : 'text-red-500'
            }`}>
              {strengthLabels[passwordStrength]}
            </span>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
            <Lock className="w-4 h-4" />
          </span>
          <input
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            autoComplete="new-password"
            className={`w-full pl-11 pr-11 py-3.5 bg-white border rounded-full focus:outline-none text-xs font-semibold text-charcoal placeholder-slate/50 transition-all ${
              confirmPass
                ? passwordsMatch
                  ? 'border-emerald-400 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300'
                  : 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-300'
                : 'border-border-cream focus:border-gold focus:ring-1 focus:ring-gold'
            }`}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-navy transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {/* Match indicator */}
          {confirmPass && (
            <div className={`absolute inset-y-0 right-10 flex items-center ${passwordsMatch ? 'text-emerald-500' : 'text-red-400'}`}>
              {passwordsMatch
                ? <Check className="w-3.5 h-3.5" strokeWidth={3} />
                : <span className="text-[10px] font-bold">✗</span>}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !passwordsMatch}
          className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#142d50] disabled:bg-[#0B1F3A]/50 text-white rounded-full font-bold text-xs tracking-wider transition-all shadow-md active:scale-[0.98] uppercase flex items-center justify-center gap-2 mt-1"
        >
          {loading
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Resetting Password...</>
            : <><ShieldCheck className="w-4 h-4" /> Reset Password</>}
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Forgot Password
      </button>
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
function Login() {
  const navigate = useNavigate();

  // View state: 'login' | 'forgot' | 'reset'
  const [view, setView] = useState('login');

  // Login form
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [activeRole, setActiveRole]     = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null); // { type: 'success'|'info', message }

  useEffect(() => {
    // Only show the "logged out" toast if the user was explicitly redirected
    // after a logout action (detected via ?loggedOut=1 query param).
    const params = new URLSearchParams(window.location.search);
    if (params.get('loggedOut') === '1') {
      setToast({ type: 'success', message: 'Logged out successfully' });
      // Clean the URL so it doesn't persist on refresh
      window.history.replaceState({}, '', window.location.pathname);
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Pre-fill token from forgot step
  const [prefillToken, setPrefillToken] = useState('');

  /** Redirect helper using the role map */
  const redirectByRole = (userRole) => {
    const path = ROLE_REDIRECT[userRole] || '/';
    navigate(path);
  };

  /** Manual form submit */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await api.login(email, password);
      redirectByRole(session.user.userRole);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /** One-click demo role login */
  const handleRoleSelect = async (role) => {
    setError('');
    setActiveRole(role.name);
    setEmail(role.email);
    setPassword(role.password);
    try {
      const session = await api.login(role.email, role.password);
      redirectByRole(session.user.userRole);
    } catch (err) {
      setError(err.message || `Could not log in as ${role.name}. Make sure the backend is running.`);
    } finally {
      setActiveRole(null);
    }
  };

  // Called when reset succeeds
  const handleResetSuccess = () => {
    setView('login');
    setToast({ type: 'success', message: '✅ Password reset! Please sign in with your new password.' });
    setTimeout(() => setToast(null), 6000);
  };

  // Called when code is received → go to step 3
  const handleCodeReceived = (token) => {
    setPrefillToken(token);
    setView('reset');
  };

  const anyLoading = loading || activeRole !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream select-none relative overflow-hidden font-sans">

      {/* Premium Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{ backgroundImage: "url('/login_bg.png')" }}
      />
      {/* Luxury Color Overlay for Contrast & Glassmorphism Blur */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-navy/50 via-navy/15 to-gold/20 backdrop-blur-[2px]" />

      {/* Toast */}
      {toast && (
        <div className="absolute top-6 right-6 z-50 bg-white border border-border-cream/80 text-charcoal px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-stone-200/50 animate-slideIn">
          <span className="text-xs font-semibold">{toast.message}</span>
          <div className="w-5 h-5 bg-[#1E9E6A]/10 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-[#1E9E6A] stroke-[3px]" />
          </div>
        </div>
      )}

      {/* Main Card with Premium Glassmorphism */}
      <div className="w-full max-w-[440px] z-10 transition-all duration-500 hover:scale-[1.01]">
        <div className="bg-white/85 backdrop-blur-lg border border-white/40 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-navy/10 flex flex-col items-center">

          {/* Brand Header — always visible */}
          <img src="/logo.png" alt="Hoteloraa Logo" className="h-11 w-auto object-contain mb-3 select-none" />
          <span className="px-3.5 py-0.5 border border-[#D4AF37] text-[9px] font-bold text-[#D4AF37] rounded-full tracking-widest uppercase mb-4 bg-white select-none">
            Staff Portal
          </span>

          {/* ── STEP 1: Normal Login ──────────────────────────────────────── */}
          {view === 'login' && (
            <>
              <h3 className="font-display font-medium text-3xl text-charcoal tracking-tight mt-1 mb-1">Welcome Back!</h3>
              <p className="text-slate text-xs font-semibold text-center mb-6">Sign in to your property management software</p>

              {error && (
                <div className="w-full mb-4 p-3 bg-danger-pale border border-danger/20 rounded-xl text-danger text-[11px] font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="w-full space-y-4">
                {/* Email */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-border-cream rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold text-charcoal placeholder-slate/50 transition-all"
                    placeholder="Email address"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate/60">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3.5 bg-white border border-border-cream rounded-full focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-xs font-semibold text-charcoal placeholder-slate/50 transition-all"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-navy transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember me & forgot */}
                <div className="flex items-center justify-between text-xs font-bold text-charcoal pt-1 pb-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border-cream text-navy focus:ring-gold accent-gold cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 font-semibold text-slate cursor-pointer text-[11px]">
                      Remember Me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setError(''); setView('forgot'); }}
                    className="text-[11px] font-semibold text-charcoal hover:text-gold hover:underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={anyLoading}
                  className="w-full py-3.5 bg-[#0B1F3A] hover:bg-[#142d50] disabled:bg-[#0B1F3A]/70 text-white rounded-full font-bold text-xs tracking-wider transition-all shadow-md active:scale-[0.98] uppercase"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative w-full my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-cream/80"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-slate font-bold uppercase tracking-widest text-[9px]">
                    Quick Demo Access
                  </span>
                </div>
              </div>

              {/* Demo Role Grid */}
              <div className="grid grid-cols-3 gap-2 w-full">
                {demoRoles.map((role) => {
                  const isThisLoading = activeRole === role.name;
                  return (
                    <button
                      key={role.name}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      disabled={anyLoading}
                      title={`Login as ${role.name}\n${role.email}`}
                      className="relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border border-border-cream bg-white hover:shadow-md hover:-translate-y-0.5 hover:border-gold/40 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${role.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                      {isThisLoading ? (
                        <div className="w-8 h-8 rounded-xl border-2 border-slate/20 border-t-slate/60 animate-spin mt-1" />
                      ) : (
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white text-[10px] font-black mt-1 shadow-sm`}>
                          {role.badge}
                        </div>
                      )}
                      <span className="text-[11px] font-bold text-charcoal leading-tight text-center">{role.name}</span>
                      <span className="text-[9px] text-slate/70 leading-tight text-center">{role.desc}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[9px] text-slate/40 text-center mt-3">
                Click any role card to instantly log in · All passwords: <span className="font-mono">password123</span>
              </p>
            </>
          )}

          {/* ── STEP 2: Forgot Password ───────────────────────────────────── */}
          {view === 'forgot' && (
            <ForgotStep
              onBack={() => setView('login')}
              onCodeReceived={handleCodeReceived}
            />
          )}

          {/* ── STEP 3: Reset Password ────────────────────────────────────── */}
          {view === 'reset' && (
            <ResetStep
              prefillToken={prefillToken}
              onBack={() => setView('forgot')}
              onSuccess={handleResetSuccess}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;
