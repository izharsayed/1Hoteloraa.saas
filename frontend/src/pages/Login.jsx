import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
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

function Login() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [activeRole, setActiveRole]     = useState(null); // which demo button is spinning

  // Logout toast
  const [showToast, setShowToast] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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

  const anyLoading = loading || activeRole !== null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cream select-none relative overflow-hidden font-sans">

      {/* Background Architectural Blueprint Line Art */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          fill="none"
          className="opacity-[0.06] text-navy"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        >
          <rect x="150" y="150" width="500" height="500" strokeWidth="1.5" strokeDasharray="none" />
          <rect x="160" y="160" width="480" height="480" />
          <line x1="450" y1="150" x2="450" y2="650" strokeWidth="1.2" strokeDasharray="none" />
          <line x1="150" y1="400" x2="450" y2="400" />
          <rect x="180" y="180" width="100" height="80" />
          <circle cx="230" cy="220" r="20" />
          <line x1="280" y1="200" x2="330" y2="200" />
          <rect x="490" y="280" width="120" height="150" strokeWidth="1.2" strokeDasharray="none" />
          <rect x="500" y="290" width="45" height="30" />
          <rect x="555" y="290" width="45" height="30" />
          <line x1="490" y1="340" x2="610" y2="340" />
          <circle cx="350" cy="520" r="30" />
          <rect x="330" y="470" width="40" height="15" rx="4" />
          <rect x="330" y="555" width="40" height="15" rx="4" />
          <path d="M 450 480 A 80 80 0 0 1 530 560" strokeWidth="0.8" />
          <line x1="450" y1="480" x2="450" y2="560" />
          <line x1="450" y1="560" x2="530" y2="560" />
          <path d="M 450 220 A 60 60 0 0 0 390 160" strokeWidth="0.8" />
          <line x1="450" y1="220" x2="450" y2="160" />
          <line x1="450" y1="160" x2="390" y2="160" />
        </svg>
      </div>

      {/* Logout success toast */}
      {showToast && (
        <div className="absolute top-6 right-6 z-50 bg-white border border-border-cream/80 text-charcoal px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-stone-200/50 animate-slideIn">
          <span className="text-xs font-semibold">Logged out successfully</span>
          <div className="w-5 h-5 bg-[#1E9E6A]/10 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-[#1E9E6A] stroke-[3px]" />
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white border border-border-cream rounded-[2rem] p-8 md:p-10 shadow-xl shadow-stone-200/40 flex flex-col items-center">

          {/* Brand Header */}
          <img src="/logo.png" alt="Hoteloraa Logo" className="h-11 w-auto object-contain mb-3 select-none" />
          <span className="px-3.5 py-0.5 border border-[#D4AF37] text-[9px] font-bold text-[#D4AF37] rounded-full tracking-widest uppercase mb-4 bg-white select-none">
            Staff Portal
          </span>

          <h3 className="font-display font-medium text-3xl text-charcoal tracking-tight mt-1 mb-1">Welcome Back!</h3>
          <p className="text-slate text-xs font-semibold text-center mb-6">Sign in to your property management software</p>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-danger-pale border border-danger/20 rounded-xl text-danger text-[11px] font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Login Form */}
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
              <a href="#forgot" className="text-charcoal hover:underline text-[11px] font-semibold">
                Forgot Password?
              </a>
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

          {/* Demo Role Grid — 3 columns */}
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
                  {/* Color top bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${role.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  {/* Badge / Spinner */}
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

        </div>
      </div>
    </div>
  );
}

export default Login;
