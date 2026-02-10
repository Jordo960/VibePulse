
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    // Simulate OAuth Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLogin({
      ...MOCK_USER,
      name: provider === 'Google' ? 'Google User' : 'Apple User',
      email: `${provider.toLowerCase()}@example.com`
    });
    setIsLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate successful auth
    onLogin({
      ...MOCK_USER,
      name: mode === 'signup' ? name : email.split('@')[0],
      email: email,
      level: mode === 'signup' ? 1 : 12, // New users start at lvl 1
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[140px] animate-pulse"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-secondary to-primary rounded-[2.5rem] flex items-center justify-center blue-glow mx-auto mb-6 transform hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-white text-6xl font-bold">pulse_alert</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">VibePulse</h1>
          <p className="text-slate-400 font-medium tracking-wide">Elevate your nutrition performance.</p>
        </div>

        <div className="glass p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          <div className="flex gap-2 p-1.5 bg-white/5 rounded-[1.5rem] mb-8 border border-white/5">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-primary text-white blue-glow shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-primary text-white blue-glow shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white focus:outline-none focus:border-primary/50 transition-all placeholder-slate-700 font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">alternate_email</span>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white focus:outline-none focus:border-primary/50 transition-all placeholder-slate-700 font-medium"
                  placeholder="alex@vibepulse.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                {mode === 'login' && <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Forgot?</button>}
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-5 text-white focus:outline-none focus:border-primary/50 transition-all placeholder-slate-700 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/5 border-white/20 text-primary focus:ring-primary focus:ring-offset-bg-deep w-4 h-4"
                />
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Keep me signed in</span>
              </label>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-white text-bg-dark rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 shadow-xl"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">{mode === 'login' ? 'login' : 'person_add'}</span>
                  {mode === 'login' ? 'Enter Dashboard' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-10 text-center">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10"></div>
            <span className="relative z-10 bg-[#161d2f] px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Connect With</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Standard Google Button */}
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all group"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
              <span className="text-sm font-bold text-slate-900">Google</span>
            </button>

            {/* Standard Apple Button */}
            <button 
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-black border border-white/20 hover:bg-zinc-900 active:scale-95 transition-all group"
            >
              {/* Replaced Material Symbol 'apple' with a proper SVG to fix double text issue */}
              <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white group-hover:scale-110 transition-transform">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-31.4-57.3-92.1-57.7-92zM289.1 80c19.8-25.2 18.1-54.3 11.6-74.5-21.2 1-46.1 14.8-59.2 31.2-14.8 17.6-27.3 47.7-19 70.3 24.3 1.9 46.8-2.6 66.6-27z"/>
              </svg>
              <span className="text-sm font-bold text-white">Apple</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-xs text-slate-500 font-medium">
          By continuing, you agree to our <span className="text-slate-300 underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">Terms of Service</span> and <span className="text-slate-300 underline underline-offset-4 cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
