
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import ProgressRing from '../components/ProgressRing';
import { MACRO_COLORS } from '../constants.tsx';
import { Meal, NutritionalGoals } from '../types';

interface StatsProps {
  meals: Meal[];
  goals: NutritionalGoals;
}

const weeklyData = [
  { name: 'Mon', kcal: 1800, carbs: 180, fibre: 25 },
  { name: 'Tue', kcal: 2200, carbs: 210, fibre: 30 },
  { name: 'Wed', kcal: 1950, carbs: 160, fibre: 18 },
  { name: 'Thu', kcal: 2400, carbs: 280, fibre: 45 },
  { name: 'Fri', kcal: 2140, carbs: 200, fibre: 32 },
  { name: 'Sat', kcal: 2800, carbs: 320, fibre: 20 },
  { name: 'Sun', kcal: 2100, carbs: 190, fibre: 35 },
];

const Stats: React.FC<StatsProps> = ({ meals, goals }) => {
  const [viewMode, setViewMode] = useState<'Calories' | 'Metabolic'>('Calories');

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Deep dive into your nutrition performance</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl md:w-auto border border-slate-200 dark:border-white/10">
          <button 
            onClick={() => setViewMode('Calories')}
            className={`flex-1 md:w-32 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Calories' ? 'bg-primary text-white blue-glow rounded-xl' : 'text-slate-500'}`}
          >
            Calories
          </button>
          <button 
            onClick={() => setViewMode('Metabolic')}
            className={`flex-1 md:w-32 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'Metabolic' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] rounded-xl' : 'text-slate-500'}`}
          >
            Metabolic
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {viewMode === 'Calories' ? 'Weekly Intake' : 'Metabolic Efficiency (Carb vs Fibre)'}
              </span>
              <h2 className="text-4xl font-black mt-2 tracking-tighter text-slate-900 dark:text-white">
                {viewMode === 'Calories' ? '2,140' : '86%'} 
                <span className="text-base font-normal text-slate-500 italic lowercase tracking-normal ml-2">
                  {viewMode === 'Calories' ? 'avg kcal' : 'health score'}
                </span>
              </h2>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${viewMode === 'Calories' ? 'bg-primary blue-glow' : 'bg-secondary violet-glow'}`}></div>
                <span className="text-xs font-bold text-slate-400">{viewMode === 'Calories' ? 'Target' : 'Carbs'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${viewMode === 'Calories' ? 'bg-secondary violet-glow' : 'bg-emerald-500 shadow-emerald-500/50 shadow-md'}`}></div>
                <span className="text-xs font-bold text-slate-400">{viewMode === 'Calories' ? 'Actual' : 'Fibre'}</span>
              </div>
            </div>
          </div>

          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'Calories' ? (
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorKcal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)', color: '#0f172a'}} 
                    cursor={{stroke: 'rgba(148,163,184,0.1)', strokeWidth: 2}}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Area type="monotone" dataKey="kcal" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorKcal)" />
                </AreaChart>
              ) : (
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)'}}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="carbs" fill={MACRO_COLORS.carbs} radius={[6, 6, 0, 0]} name="Total Carbs (g)" />
                  <Bar dataKey="fibre" fill={MACRO_COLORS.fibre} radius={[6, 6, 0, 0]} name="Fibre (g)" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Distribution Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 flex flex-col items-center backdrop-blur-xl transition-colors">
             <h3 className="text-lg font-bold mb-6 w-full text-slate-900 dark:text-white">Goal Distribution</h3>
             <div className="relative w-48 h-48 mb-6 group">
                <ProgressRing percentage={100} size={192} strokeWidth={16} color="#3b82f6">
                   <div className="text-center group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-black block tracking-tight text-slate-900 dark:text-white">Active</span>
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Plan</span>
                   </div>
                </ProgressRing>
             </div>
             <div className="w-full space-y-4">
               <StatItem label="Protein Goal" percentage={`${goals.protein}g`} color={MACRO_COLORS.protein} />
               <StatItem label="Carbs Goal" percentage={`${goals.carbs}g`} color={MACRO_COLORS.carbs} />
               <StatItem label="Fibre Goal" percentage={`${goals.fibre}g`} color={MACRO_COLORS.fibre} />
               <StatItem label="Fats Goal" percentage={`${goals.fats}g`} color={MACRO_COLORS.fats} />
             </div>
          </div>

          <div className="space-y-4">
             <InsightCard 
                icon="eco" 
                label="Gut Health" 
                value="High Fibre Intake" 
                change="+15%" 
                color={MACRO_COLORS.fibre} 
             />
             <InsightCard 
                icon="bolt" 
                label="Net Carb Load" 
                value="Stable Glycemic" 
                change="-5%" 
                color={MACRO_COLORS.carbs} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; percentage: string; color: string }> = ({ label, percentage, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
    </div>
    <span className="text-sm font-black" style={{ color }}>{percentage}</span>
  </div>
);

const InsightCard: React.FC<{ 
  icon: string; 
  label: string; 
  value: string; 
  change: string; 
  color: string 
}> = ({ icon, label, value, change, color }) => (
  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-white/10 transition-all border-l-4 shadow-sm" style={{ borderLeftColor: color }}>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}1A`, color }}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{label}</h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase">{value}</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-sm font-black block" style={{ color }}>{change}</span>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">vs last week</p>
    </div>
  </div>
);

export default Stats;
