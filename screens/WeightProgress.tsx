
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';
import { WeightEntry } from '../types';
import { MOCK_USER } from '../constants';

interface WeightProgressProps {
  weightHistory: WeightEntry[];
  onAddWeight: (weight: number) => void;
  onBack: () => void;
}

const WeightProgress: React.FC<WeightProgressProps> = ({ weightHistory, onAddWeight, onBack }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [newWeight, setNewWeight] = useState(MOCK_USER.weight.toString());

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const initialWeight = weightHistory[0]?.weight || 0;
  const totalChange = currentWeight - initialWeight;

  const handleSave = () => {
    onAddWeight(Number(newWeight));
    setIsLogging(false);
  };

  return (
    <div className="flex flex-col h-full bg-bg-dark relative">
      {/* App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-white/5 rounded-full transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center">Weight Progress</h2>
        <div className="size-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Interactive Weight Log Modal-ish View */}
        {isLogging && (
          <div className="mx-4 mb-4 p-6 rounded-3xl bg-primary/10 border border-primary/30 backdrop-blur-2xl animate-in slide-in-from-top duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-primary">Log Weight</h3>
                <button onClick={() => setIsLogging(false)} className="material-symbols-outlined text-slate-500">close</button>
             </div>
             <div className="flex items-center gap-4 mb-6">
                <input 
                  autoFocus
                  type="number" 
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-6 px-4 text-4xl font-black text-white w-full text-center focus:ring-primary focus:border-primary"
                />
                <span className="text-2xl font-bold text-slate-500">KG</span>
             </div>
             <button 
               onClick={handleSave}
               className="w-full bg-primary py-4 rounded-2xl font-black uppercase tracking-widest text-white blue-glow transition-transform active:scale-95"
             >
               Save Entry
             </button>
          </div>
        )}

        {/* Hero Stats Card */}
        <div className="p-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden backdrop-blur-xl group cursor-pointer" onClick={() => setIsLogging(true)}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-1">
                <p className="text-slate-400 text-sm font-medium">Current Weight</p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-white text-5xl font-bold tracking-tighter transition-all group-hover:text-primary">{currentWeight}</h1>
                  <span className="text-primary text-xl font-bold">kg</span>
                </div>
              </div>
              <div className="size-14 rounded-xl bg-primary/20 flex items-center justify-center blue-glow border border-primary/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">monitor_weight</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="flex flex-col">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Target Weight</p>
                <p className="text-white text-xl font-semibold">{MOCK_USER.weightGoal}.0 kg</p>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Overall Change</p>
                <p className={`${totalChange <= 0 ? 'text-primary' : 'text-fats'} text-xl font-semibold`}>
                  {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-bold px-1">Weight Timeline</h3>
          </div>
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistory}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  fill="url(#weightGrad)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Milestones */}
        <div className="px-4 pt-6">
          <h3 className="text-white text-lg font-bold mb-4 px-1">Weight Milestones</h3>
          <div className="relative space-y-4">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/10"></div>
            <Milestone label="Starting Point" sub={`Started at ${initialWeight}kg`} date="JAN 10" completed />
            <Milestone 
              label="Goal In Sight" 
              sub={`Only ${Math.abs(currentWeight - MOCK_USER.weightGoal).toFixed(1)}kg to go!`} 
              date="PROGRESS" 
              completed={false} 
              isTarget 
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {!isLogging && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-6 z-[60]">
          <button 
            onClick={() => setIsLogging(true)}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
            Log Current Weight
          </button>
        </div>
      )}
    </div>
  );
};

const Milestone: React.FC<{ label: string; sub: string; date: string; completed: boolean; isTarget?: boolean }> = ({ label, sub, date, completed, isTarget }) => (
  <div className={`flex gap-4 relative transition-all duration-300 ${!completed && !isTarget ? 'opacity-40' : ''}`}>
    <div className={`z-10 size-10 rounded-full flex items-center justify-center shrink-0 border-4 border-bg-dark transition-colors ${completed ? 'bg-primary' : isTarget ? 'bg-secondary' : 'bg-slate-800'}`}>
      <span className="material-symbols-outlined text-white text-[20px]">{completed ? 'check' : isTarget ? 'flag' : 'lock'}</span>
    </div>
    <div className={`flex-1 p-4 rounded-xl bg-white/5 border transition-all ${isTarget ? 'border-secondary/30 bg-secondary/5' : 'border-white/10'}`}>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-white font-bold text-sm">{label}</h4>
        <span className="text-slate-500 text-[10px] font-medium uppercase">{date}</span>
      </div>
      <p className="text-slate-300 text-xs">{sub}</p>
    </div>
  </div>
);

export default WeightProgress;
