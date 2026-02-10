
import React from 'react';
import ProgressRing from '../components/ProgressRing';
import { MACRO_COLORS } from '../constants.tsx';
import { Meal, NutritionalGoals } from '../types';

interface DashboardProps {
  meals: Meal[];
  onDeleteMeal: (id: string) => void;
  waterIntake: number;
  onWaterChange: (val: number) => void;
  goals: NutritionalGoals;
  onWeightClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, onDeleteMeal, waterIntake, onWaterChange, goals, onWeightClick }) => {
  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);
  const goalCalories = goals.calories;
  const progressPercent = Math.min((totalCalories / goalCalories) * 100, 100);

  const proteinTotal = meals.reduce((acc, curr) => acc + curr.protein, 0);
  const carbsTotal = meals.reduce((acc, curr) => acc + curr.carbs, 0);
  const fatsTotal = meals.reduce((acc, curr) => acc + curr.fats, 0);
  const fibreTotal = meals.reduce((acc, curr) => acc + curr.fibre, 0);
  const netCarbsTotal = Math.max(0, carbsTotal - fibreTotal);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary & Macros */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8 glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 transition-colors">
            <div className="relative group cursor-pointer transition-transform active:scale-95 shrink-0">
              <ProgressRing percentage={progressPercent} color="#a855f7" size={240}>
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{totalCalories.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs md:text-sm mt-0.5 uppercase tracking-widest font-bold">kcal used</span>
                </div>
              </ProgressRing>
              <div className="absolute -top-4 -right-4 md:top-4 md:right-0 bg-white dark:bg-bg-dark border border-secondary/30 px-3 py-1 rounded-full violet-glow shadow-sm">
                <span className="text-secondary text-xs font-black">{Math.max(goalCalories - totalCalories, 0)} kcal left</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div>
                <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Daily Progress</h2>
                <p className="text-slate-400 text-sm">You've consumed {progressPercent.toFixed(0)}% of your daily goal.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <MacroCard 
                  label="Protein" 
                  value={`${proteinTotal}g`} 
                  goal={`${goals.protein}g`} 
                  progress={(proteinTotal / goals.protein) * 100} 
                  color={MACRO_COLORS.protein} 
                />
                <MacroCard 
                  label="Carbs" 
                  value={`${carbsTotal}g`} 
                  subText={`Net: ${netCarbsTotal}g`}
                  goal={`${goals.carbs}g`} 
                  progress={(carbsTotal / goals.carbs) * 100} 
                  color={MACRO_COLORS.carbs} 
                />
                <MacroCard 
                  label="Fats" 
                  value={`${fatsTotal}g`} 
                  goal={`${goals.fats}g`} 
                  progress={(fatsTotal / goals.fats) * 100} 
                  color={MACRO_COLORS.fats} 
                />
                <MacroCard 
                  label="Fibre" 
                  value={`${fibreTotal}g`} 
                  goal={`${goals.fibre}g`} 
                  progress={(fibreTotal / goals.fibre) * 100} 
                  color={MACRO_COLORS.fibre} 
                />
              </div>
            </div>
          </div>

          {/* Meals Section Responsive Grid */}
          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Today's Meals</h3>
                <p className="text-slate-500 text-xs mt-1">Breakdown of your nutrition log</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meals.length === 0 ? (
                <div className="md:col-span-2 py-10 text-center text-slate-500 text-sm italic">No meals logged today</div>
              ) : (
                meals.map(meal => (
                  <div key={meal.id} className="p-4 rounded-2xl flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 group transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800/80 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">{meal.emoji}</div>
                      <div>
                        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{meal.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{meal.type} • {meal.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-200 block">{meal.calories} kcal</span>
                        <div className="flex gap-1 mt-1 justify-end">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary" title="Protein" style={{ opacity: meal.protein > 0 ? 1 : 0.2 }}></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-secondary" title="Carbs" style={{ opacity: meal.carbs > 0 ? 1 : 0.2 }}></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-fats" title="Fats" style={{ opacity: meal.fats > 0 ? 1 : 0.2 }}></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Fibre" style={{ opacity: meal.fibre > 0 ? 1 : 0.2 }}></div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMeal(meal.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-fats/10 text-fats flex items-center justify-center transition-all hover:bg-fats/20"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Widgets & Secondary Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Weight Action Card */}
          <button 
            onClick={onWeightClick}
            className="w-full glass p-8 rounded-[2.5rem] border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent text-left hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Weight</h3>
                <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary violet-glow group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">monitor_weight</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">Track your body progress and reach your goal faster.</p>
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <span>Go to tracking</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/20 transition-colors"></div>
          </button>

          {/* Hydration Widget */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hydration</h3>
                <p className="text-xs text-slate-500">{waterIntake} / 8 glasses daily</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary blue-glow">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => onWaterChange(i + 1 === waterIntake ? i : i + 1)}
                  className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                    i < waterIntake ? 'bg-primary blue-glow shadow-primary/20 scale-105' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${i < waterIntake ? 'text-white fill-1' : 'text-slate-400 dark:text-slate-600'}`}>
                    opacity
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity/Quick Stats Widget */}
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Daily Insights</h3>
            <div className="space-y-4">
              <InsightItem icon="bolt" label="Active Energy" value="450 kcal" color="primary" />
              <InsightItem icon="steps" label="Steps taken" value="8,420" color="secondary" />
              <InsightItem icon="bedtime" label="Sleep quality" value="82%" color="fats" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MacroCard: React.FC<{
  label: string;
  value: string;
  subText?: string;
  goal: string;
  progress: number;
  color: string;
}> = ({ label, value, subText, goal, progress, color }) => (
  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-start backdrop-blur-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}></div>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-200 uppercase tracking-widest">{label}</span>
    </div>
    <div className="w-full h-1 bg-slate-300 dark:bg-slate-900/50 rounded-full mb-3 overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-700" 
        style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      ></div>
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
      {subText && <span className="text-[9px] font-bold text-primary uppercase">{subText}</span>}
      <span className="text-[10px] text-slate-500 font-bold uppercase">of {goal}</span>
    </div>
  </div>
);

const InsightItem: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-4 group">
    <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} group-hover:scale-110 transition-transform`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
    <span className="material-symbols-outlined text-slate-600 text-sm">chevron_right</span>
  </div>
);

export default Dashboard;
