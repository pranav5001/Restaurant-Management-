import React, { useState } from 'react';
import { Lock, Mail, LogIn, Sparkles, Eye, EyeOff, ShieldCheck, Utensils, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stationRole, setStationRole] = useState('MANAGER');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter your login ID and password.');
      return;
    }

    const validLoginId = 'pranavpawar123.rest';
    const validPassword = 'pranav123';

    // Strict credential validation check
    if (email.trim().toLowerCase() !== validLoginId || password.trim() !== validPassword) {
      setErrorMessage('Invalid Login ID or Password. Access denied.');
      return;
    }
    
    setErrorMessage('');
    onLogin({
      email: validLoginId,
      name: 'Pranav Pawar',
      role: stationRole,
      isDemo: false
    });
  };

  const handleDemoLogin = () => {
    onLogin({
      email: 'pranavpawar123.rest',
      name: 'Pranav Pawar',
      role: 'MANAGER',
      isDemo: true
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Main Card */}
      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] mb-1">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Restaurant App</h1>
          <p className="text-xs text-[#94a3b8]">
            Sign in to your account
          </p>
        </div>

        {/* Role Selector */}
        <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-1 flex gap-1 text-xs">
          {['MANAGER', 'EXPEDITOR', 'HEAD CHEF'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setStationRole(role)}
              className={`flex-1 py-2 rounded-md transition-all cursor-pointer font-medium ${
                stationRole === role
                  ? 'bg-[#3b82f6] text-white shadow-sm font-semibold'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/40 text-[#ef4444] p-3 rounded-lg text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Login ID */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#94a3b8]">
              Login ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter Login ID"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[#475569]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#94a3b8]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#3b82f6] text-white text-sm rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all placeholder:text-[#475569]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748b] hover:text-[#f8fafc] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-md transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#334155] w-full" />
          <span className="bg-[#1e293b] px-3 text-[11px] text-[#64748b] uppercase font-medium">
            OR DEMO ACCESS
          </span>
        </div>

        {/* One-Click Demo Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-white hover:bg-[#f1f5f9] text-[#0f172a] py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all shadow border border-[#cbd5e1]"
        >
          <Sparkles className="w-4 h-4 text-[#3b82f6]" />
          <span>Continue as Demo User</span>
        </button>

        <div className="pt-1 text-center flex items-center justify-center space-x-1.5 text-xs text-[#64748b]">
          <ShieldCheck className="w-4 h-4 text-[#10b981]" />
          <span>Strict Authentication Enforced</span>
        </div>
      </div>
    </div>
  );
}
