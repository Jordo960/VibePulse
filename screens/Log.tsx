
import React, { useState } from 'react';
import { Meal, MealPreset } from '../types';

interface LogProps {
  meals: Meal[];
  presets: MealPreset[];
  onDeleteMeal: (id: string) => void;
  onAddClick: () => void;
  onDeletePreset: (id: string) => void;
  onAddPreset: (preset: MealPreset) => void;
}

const Log: React.FC<LogProps> = ({ 
  meals, 
  presets, 
  onDeleteMeal, 
  onAddClick, 
  onDeletePreset,
  onAddPreset
}) => {
  const [activeTab, setActiveTab] = useState<'History' | 'Presets'>('History');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [newPreset, setNewPreset] = useState({ name: '', p: '', c: '', f: '', fi: '', emoji: '🍱' });

  const handleCreatePreset = () => {
    if (!newPreset.name) return;
    const calories = (Number(newPreset.p) * 4) + (Number(newPreset.c) * 4) + (Number(newPreset.f) * 9);
    onAddPreset({
      id: Math.random().toString(36).substr(2, 9),
      name: newPreset.name,
      protein: Number(newPreset.p) || 0,
      carbs: Number(newPreset.c) || 0,
      fats: Number(newPreset.f) || 0,
      fibre: Number(newPreset.fi) || 0,
      calories: Math.round(calories),
      emoji: newPreset.emoji
    });
    setNewPreset({ name: '', p: '', c: '', f: '', fi: '', emoji: '🍱' });
    setIsCreatingPreset(false);
  };

  return (
    <div className="px-6 pt-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Log & Recipes</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your history and custom meal templates</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
            <button 
              onClick={() => setActiveTab('History')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'History' ? 'bg-primary text-white blue-glow shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('Presets')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Presets' ? 'bg-secondary text-white violet-glow shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
            >
              Presets
            </button>
          </div>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-2xl font-bold blue-glow hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="hidden sm:inline">Log Meal</span>
          </button>
        </div>
      </div>

      {activeTab === 'History' ? (
        <section className="space-y-4">
          {meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 glass rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/10">
              <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-400">
                <span className="material-symbols-outlined text-4xl">fastfood</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No meals logged yet</h3>
              <p className="text-slate-500 text-sm mb-8 text-center px-6">Every fitness journey starts with the first bite logged.</p>
              <button 
                onClick={onAddClick}
                className="px-8 py-4 bg-gradient-to-tr from-secondary to-primary rounded-2xl font-black text-white blue-glow hover:scale-105 transition-all uppercase tracking-widest text-xs"
              >
                Log Your First Meal
              </button>
            </div>
          ) : (
            meals.map(meal => (
              <div key={meal.id} className="p-5 glass rounded-3xl flex justify-between items-center group border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {meal.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{meal.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {meal.type} • {meal.time}
                      </span>
                      <div className="flex gap-1">
                        {meal.fibre > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter border border-emerald-500/20">
                            {meal.fibre}g Fibre
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-tighter border border-secondary/20">
                          {Math.max(0, meal.carbs - meal.fibre)}g Net Carb
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-white">{meal.calories} kcal</div>
                    <div className="flex gap-1.5 mt-1 justify-end">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" title={`Protein: ${meal.protein}g`} style={{ opacity: meal.protein > 0 ? 1 : 0.1 }}></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-secondary" title={`Total Carbs: ${meal.carbs}g`} style={{ opacity: meal.carbs > 0 ? 1 : 0.1 }}></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-fats" title={`Fats: ${meal.fats}g`} style={{ opacity: meal.fats > 0 ? 1 : 0.1 }}></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={`Fibre: ${meal.fibre}g`} style={{ opacity: meal.fibre > 0 ? 1 : 0.1 }}></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteMeal(meal.id)} 
                    className="w-10 h-10 rounded-full bg-fats/10 text-fats flex items-center justify-center hover:bg-fats/20 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Meal Presets</h3>
            {!isCreatingPreset && (
              <button 
                onClick={() => setIsCreatingPreset(true)}
                className="text-xs font-black text-secondary uppercase tracking-widest hover:underline"
              >
                + Create New Preset
              </button>
            )}
          </div>

          {isCreatingPreset && (
            <div className="p-8 glass rounded-[2rem] border border-secondary/30 animate-in slide-in-from-top-4 duration-300 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Preset Name</label>
                  <input 
                    value={newPreset.name}
                    onChange={(e) => setNewPreset({...newPreset, name: e.target.value})}
                    placeholder="e.g. My Bulletproof Coffee"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="w-full sm:w-32 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emoji</label>
                  <input 
                    value={newPreset.emoji}
                    onChange={(e) => setNewPreset({...newPreset, emoji: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-center text-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prot (g)</label>
                  <input type="number" value={newPreset.p} onChange={(e) => setNewPreset({...newPreset, p: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Carb (g)</label>
                  <input type="number" value={newPreset.c} onChange={(e) => setNewPreset({...newPreset, c: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fat (g)</label>
                  <input type="number" value={newPreset.f} onChange={(e) => setNewPreset({...newPreset, f: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fibre (g)</label>
                  <input type="number" value={newPreset.fi} onChange={(e) => setNewPreset({...newPreset, fi: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsCreatingPreset(false)} className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-widest text-xs">Cancel</button>
                <button 
                  onClick={handleCreatePreset}
                  disabled={!newPreset.name}
                  className="flex-[2] py-3 bg-secondary text-white rounded-xl font-bold uppercase tracking-widest text-xs violet-glow disabled:opacity-50"
                >
                  Save Preset
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-10 text-center col-span-2">You haven't created any custom presets yet.</p>
            ) : (
              presets.map(preset => (
                <div key={preset.id} className="p-5 glass rounded-3xl flex items-center justify-between border border-slate-200 dark:border-white/10 hover:border-secondary/50 group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {preset.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{preset.name}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {preset.protein}P • {preset.carbs}C ({Math.max(0, preset.carbs - preset.fibre)} Net) • {preset.fibre}Fi • {preset.calories} Kcal
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeletePreset(preset.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-fats hover:bg-fats/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Log;
