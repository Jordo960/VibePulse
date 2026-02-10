
import React, { useState } from 'react';
import { MACRO_COLORS } from '../constants.tsx';
import { NutritionalGoals, User } from '../types';

interface ProfileProps {
  user: User;
  goals: NutritionalGoals;
  backendGoals: NutritionalGoals | null;
  lastSynced: string | null;
  onUpdateGoals: (goals: NutritionalGoals) => void;
  onSync: () => Promise<void>;
  onWeightClick: () => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, goals, backendGoals, lastSynced, onUpdateGoals, onSync, onWeightClick, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editForm, setEditForm] = useState<NutritionalGoals>(goals);

  const handleSave = () => {
    onUpdateGoals(editForm);
    setIsEditing(false);
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await onSync();
    setIsSyncing(false);
  };

  const isOutOfSync = backendGoals && (
    backendGoals.calories !== goals.calories ||
    backendGoals.protein !== goals.protein ||
    backendGoals.carbs !== goals.carbs ||
    backendGoals.fats !== goals.fats ||
    backendGoals.fibre !== goals.fibre
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header Profile Responsive */}
      <div className="flex flex-col md:flex-row items-center gap-8 glass p-8 md:p-12 rounded-[3rem] border border-white/10">
        <div className="p-1 rounded-full bg-gradient-to-tr from-primary to-secondary blue-glow shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-8 border-bg-dark">
            <img alt="Avatar" className="w-full h-full object-cover" src={user.avatar} />
          </div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
             <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{user.name}</h1>
             {user.isPro && (
               <span className="inline-flex items-center px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-black uppercase rounded-full violet-glow border border-secondary/30">
                 Pro Member
               </span>
             )}
          </div>
          <p className="text-slate-400 text-lg">Elite Level {user.level} Nutritionist</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
             <Badge icon="verified" label="Identity Verified" />
             <Badge icon="stars" label="Member since 2023" />
          </div>
        </div>
      </div>

      {/* Cloud Sync & Backup Section */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSyncing ? 'bg-primary/20 animate-spin' : 'bg-primary/10 text-primary blue-glow'}`}>
              <span className="material-symbols-outlined text-3xl">{isSyncing ? 'sync' : 'cloud_done'}</span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-black tracking-tight">Cloud Backup</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {lastSynced ? `Last Synced: ${lastSynced}` : 'Never Synced'}
              </p>
              {isOutOfSync && !isSyncing && (
                <p className="text-[10px] text-fats font-black uppercase mt-1 animate-pulse">Changes detected: Sync recommended</p>
              )}
            </div>
          </div>
          <button 
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 transition-all ${isSyncing ? 'bg-white/5 text-slate-500' : 'bg-primary text-white blue-glow hover:scale-105 active:scale-95'}`}
          >
            <span className="material-symbols-outlined text-lg">{isSyncing ? 'sync' : 'cloud_upload'}</span>
            {isSyncing ? 'Syncing...' : 'Sync with Backend'}
          </button>
        </div>
      </div>

      {/* Goal Editor Toggle */}
      <div className="flex items-center justify-between px-4">
        <h3 className="text-xl font-bold tracking-tight">Your Nutrition Targets</h3>
        <button 
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isEditing ? 'bg-primary text-white blue-glow' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
        >
          <span className="material-symbols-outlined text-lg">{isEditing ? 'save' : 'edit'}</span>
          {isEditing ? 'Save Goals' : 'Edit Targets'}
        </button>
      </div>

      {/* Goal Editor View */}
      {isEditing && (
        <div className="glass p-8 rounded-[2rem] border border-primary/30 animate-in fade-in zoom-in duration-300">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <GoalInput 
                label="Calories (kcal)" 
                value={editForm.calories} 
                onChange={(v) => setEditForm({...editForm, calories: Number(v)})} 
                color="secondary"
              />
              <GoalInput 
                label="Protein (g)" 
                value={editForm.protein} 
                onChange={(v) => setEditForm({...editForm, protein: Number(v)})} 
                color="primary"
              />
              <GoalInput 
                label="Carbs (g)" 
                value={editForm.carbs} 
                onChange={(v) => setEditForm({...editForm, carbs: Number(v)})} 
                color="secondary"
              />
              <GoalInput 
                label="Fibre (g)" 
                value={editForm.fibre} 
                onChange={(v) => setEditForm({...editForm, fibre: Number(v)})} 
                color="fibre"
              />
              <GoalInput 
                label="Fats (g)" 
                value={editForm.fats} 
                onChange={(v) => setEditForm({...editForm, fats: Number(v)})} 
                color="fats"
              />
           </div>
        </div>
      )}

      {/* High-level Goals Grid Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GoalCard 
          icon="local_fire_department" 
          label="Daily Goal" 
          value={`${goals.calories} kcal`} 
          progress={75} 
          color="primary" 
        />
        <GoalCard 
          icon="fitness_center" 
          label="Weight Target" 
          value={`${user.weightGoal} kg`} 
          progress={40} 
          color="secondary" 
          onClick={onWeightClick}
        />
        <GoalCard 
          icon="eco" 
          label="Fibre Target" 
          value={`${goals.fibre} g`} 
          progress={Math.min(100, (12/goals.fibre)*100)} 
          color="primary" 
        />
        <GoalCard 
          icon="timer" 
          label="Fast Streak" 
          value="14 Days" 
          progress={90} 
          color="fats" 
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Daily Targets Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold px-2 flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            Macro Targets
          </h3>
          <div className="space-y-4">
            <TargetProgress label="Protein" current={145} total={goals.protein} color={MACRO_COLORS.protein} />
            <TargetProgress label="Carbohydrates" current={210} total={goals.carbs} color={MACRO_COLORS.carbs} />
            <TargetProgress label="Fibre" current={12} total={goals.fibre} color={MACRO_COLORS.fibre} />
            <TargetProgress label="Fats" current={58} total={goals.fats} color={MACRO_COLORS.fats} />
          </div>
        </div>

        {/* Settings Menu Column */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold px-2 flex items-center gap-3">
            <span className="w-8 h-1 bg-secondary rounded-full"></span>
            Settings
          </h3>
          <div className="glass overflow-hidden rounded-[2rem] border border-white/10 divide-y divide-white/5">
            <SettingsItem icon="settings" label="Account Settings" color={MACRO_COLORS.protein} />
            <SettingsItem icon="notifications" label="Reminders & Alerts" color={MACRO_COLORS.carbs} />
            <SettingsItem icon="shield" label="Privacy & Security" color={MACRO_COLORS.carbs} />
            <button 
              onClick={onLogout}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-fats/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-fats/10 flex items-center justify-center group-hover:scale-110 transition-transform text-fats">
                  <span className="material-symbols-outlined">logout</span>
                </div>
                <span className="text-sm font-bold text-fats">Log Out</span>
              </div>
              <span className="material-symbols-outlined text-fats opacity-50 transition-transform group-hover:translate-x-1">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoalInput: React.FC<{ label: string; value: number; onChange: (v: string) => void; color: string }> = ({ label, value, onChange, color }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-black text-white focus:outline-none focus:border-primary/50 transition-all"
    />
  </div>
);

const Badge: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
    <span className="material-symbols-outlined text-sm">{icon}</span>
    {label}
  </div>
);

const GoalCard: React.FC<{ 
  icon: string; 
  label: string; 
  value: string; 
  progress: number; 
  color: 'primary' | 'secondary' | 'fats';
  onClick?: () => void;
}> = ({ icon, label, value, progress, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-3xl bg-white/5 border border-${color}/20 backdrop-blur-xl group transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-white/10 active:scale-95 hover:border-white/30' : ''}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className={`text-[10px] text-${color} font-black uppercase tracking-widest`}>Ongoing</span>
    </div>
    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-black mt-1 tracking-tight">{value}</p>
    <div className="w-full h-1.5 bg-slate-900/50 rounded-full mt-4 overflow-hidden">
      <div 
        className={`h-full bg-${color} transition-all duration-700`} 
        style={{ width: `${progress}%`, boxShadow: `0 0 12px var(--${color})` }}
      ></div>
    </div>
  </div>
);

const TargetProgress: React.FC<{
  label: string;
  current: number;
  total: number;
  color: string;
}> = ({ label, current, total, color }) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/5 shadow-sm group hover:bg-white/10 transition-all">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-black">{current}g <span className="text-slate-500 font-normal">/ {total}g</span></span>
    </div>
    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-700 ease-out" 
        style={{ width: `${Math.min((current / total) * 100, 100)}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}66` }}
      ></div>
    </div>
  </div>
);

const SettingsItem: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
  <button className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className="material-symbols-outlined text-slate-600 transition-transform group-hover:translate-x-1">chevron_right</span>
  </button>
);

export default Profile;
