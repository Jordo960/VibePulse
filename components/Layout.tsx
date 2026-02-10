
import React, { useState } from 'react';
import { Screen } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  hideNav?: boolean;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeScreen, 
  setActiveScreen, 
  hideNav = false,
  theme = 'dark',
  toggleTheme
}) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleToggle = () => {
    setIsRotating(true);
    toggleTheme?.();
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-deep flex flex-col md:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      {!hideNav && (
        <aside className="hidden md:flex flex-col w-64 glass border-r border-slate-200 dark:border-white/10 sticky top-0 h-screen z-50 transition-colors">
          <div className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-secondary to-primary rounded-xl flex items-center justify-center blue-glow">
                  <span className="material-symbols-outlined text-white font-bold">pulse_alert</span>
                </div>
                <span className="text-xl font-extrabold tracking-tighter text-slate-900 dark:text-white">VibePulse</span>
              </div>
            </div>

            <nav className="space-y-2">
              <SidebarLink
                icon="home"
                label="Dashboard"
                active={activeScreen === 'Home'}
                onClick={() => setActiveScreen('Home')}
              />
              <SidebarLink
                icon="description"
                label="Food Log"
                active={activeScreen === 'Log'}
                onClick={() => setActiveScreen('Log')}
              />
              <SidebarLink
                icon="analytics"
                label="Statistics"
                active={activeScreen === 'Stats'}
                onClick={() => setActiveScreen('Stats')}
              />
              <SidebarLink
                icon="person"
                label="My Profile"
                active={activeScreen === 'Me'}
                onClick={() => setActiveScreen('Me')}
              />
            </nav>
          </div>
          
          <div className="mt-auto p-8 space-y-4">
            <button 
              onClick={handleToggle}
              className="w-full py-4 glass border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-700 dark:text-slate-300 hover:scale-[1.02] transition-all group"
            >
              <span className={`material-symbols-outlined theme-toggle-icon ${isRotating ? 'rotate' : ''}`}>
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="text-xs uppercase tracking-widest">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button 
              onClick={() => setActiveScreen('AddMeal')}
              className="w-full py-4 bg-gradient-to-tr from-secondary to-primary rounded-2xl flex items-center justify-center gap-2 font-bold text-white blue-glow hover:scale-[1.02] transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Log Entry
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center px-6 pt-6 pb-2 sticky top-0 bg-bg-light/80 dark:bg-bg-deep/80 backdrop-blur-md z-40 transition-colors">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-secondary to-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm font-bold">pulse_alert</span>
              </div>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white">VibePulse</span>
           </div>
           <div className="flex gap-4 items-center">
              <button onClick={handleToggle} className="text-slate-500 dark:text-slate-400">
                <span className={`material-symbols-outlined theme-toggle-icon ${isRotating ? 'rotate' : ''}`}>
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
              <span className="material-symbols-outlined text-slate-400">notifications</span>
              <span className="material-symbols-outlined text-slate-400">search</span>
           </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-10">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar */}
        {!hideNav && (
          <div className="md:hidden sticky bottom-0 w-full glass border-t border-slate-200 dark:border-white/10 px-8 pt-4 pb-10 flex justify-between items-center rounded-t-[2.5rem] z-50 transition-colors">
            <NavButton
              icon="home"
              label="Home"
              active={activeScreen === 'Home'}
              onClick={() => setActiveScreen('Home')}
            />
            <NavButton
              icon="description"
              label="Log"
              active={activeScreen === 'Log'}
              onClick={() => setActiveScreen('Log')}
            />
            
            <button 
              onClick={() => setActiveScreen('AddMeal')}
              className="flex flex-col items-center gap-1 -mt-12 relative"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-secondary to-primary blue-glow rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-white text-3xl font-bold">add</span>
              </div>
            </button>

            <NavButton
              icon="analytics"
              label="Stats"
              active={activeScreen === 'Stats'}
              onClick={() => setActiveScreen('Stats')}
            />
            <NavButton
              icon="person"
              label="Me"
              active={activeScreen === 'Me'}
              onClick={() => setActiveScreen('Me')}
            />
          </div>
        )}

        <div className="md:hidden absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 dark:bg-white/10 rounded-full z-50 pointer-events-none"></div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
    }`}
  >
    <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary blue-glow"></div>}
  </button>
);

const NavButton: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 group relative transition-colors ${active ? 'text-secondary' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
  >
    {active && <div className="absolute -top-4 w-12 h-1 bg-secondary violet-glow rounded-full"></div>}
    <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default Layout;
