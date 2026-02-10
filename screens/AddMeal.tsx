
import React, { useState, useMemo } from 'react';
import { Meal, NutritionalGoals, MealPreset } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { MACRO_COLORS } from '../constants';

interface AddMealProps {
  onBack: () => void;
  onLog: (meal: Meal, shouldSavePreset?: boolean) => void;
  goals: NutritionalGoals;
  dailyTotals: { protein: number; carbs: number; fats: number; fibre: number; calories: number };
  presets: MealPreset[];
}

const CATEGORIZED_FOODS = [
  {
    category: 'High Protein',
    items: [
      { name: 'Chicken Breast', p: 31, c: 0, f: 4, fi: 0, e: '🍗' },
      { name: 'Salmon Fillet', p: 25, c: 0, f: 15, fi: 0, e: '🐟' },
      { name: 'Greek Yogurt', p: 18, c: 10, f: 0, fi: 0, e: '🥣' },
      { name: 'Hard Boiled Egg', p: 6, c: 0.6, f: 5, fi: 0, e: '🥚' },
    ]
  },
  {
    category: 'Healthy Carbs',
    items: [
      { name: 'Brown Rice', p: 3, c: 25, f: 1, fi: 3.5, e: '🍚' },
      { name: 'Quinoa Bowl', p: 4, c: 21, f: 2, fi: 2.8, e: '🥗' },
      { name: 'Sweet Potato', p: 2, c: 20, f: 0, fi: 3.3, e: '🍠' },
      { name: 'Banana', p: 1, c: 23, f: 0.3, fi: 2.6, e: '🍌' },
    ]
  },
  {
    category: 'Healthy Fats',
    items: [
      { name: 'Half Avocado', p: 2, c: 9, f: 15, fi: 7, e: '🥑' },
      { name: 'Handful Almonds', p: 6, c: 6, f: 14, fi: 3.5, e: '🥜' },
      { name: 'Olive Oil (tbsp)', p: 0, c: 0, f: 14, fi: 0, e: '🫒' },
      { name: 'Chia Seeds', p: 5, c: 12, f: 9, fi: 10, e: '🌱' },
    ]
  }
];

const AddMeal: React.FC<AddMealProps> = ({ onBack, onLog, goals, dailyTotals, presets }) => {
  const [formData, setFormData] = useState({
    name: '',
    protein: '',
    carbs: '',
    fat: '',
    fibre: '',
    emoji: '🥗'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealType, setMealType] = useState<Meal['type']>('Lunch');
  const [saveAsPreset, setSaveAsPreset] = useState(false);

  const pendingMacros = useMemo(() => ({
    protein: Number(formData.protein) || 0,
    carbs: Number(formData.carbs) || 0,
    fats: Number(formData.fat) || 0,
    fibre: Number(formData.fibre) || 0,
    calories: (Number(formData.protein) * 4) + (Number(formData.carbs) * 4) + (Number(formData.fat) * 9)
  }), [formData]);

  const handleQuickAdd = (food: any) => {
    setFormData({
      name: food.name,
      protein: food.p?.toString() || food.protein?.toString() || '0',
      carbs: food.c?.toString() || food.carbs?.toString() || '0',
      fat: food.f?.toString() || food.fats?.toString() || '0',
      fibre: food.fi?.toString() || food.fibre?.toString() || '0',
      emoji: food.e || food.emoji || '🍱'
    });
  };

  const handleSmartAnalyze = async () => {
    if (!formData.name.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following food and provide estimated nutritional values including FIBRE: "${formData.name}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "The standardized name of the food." },
              calories: { type: Type.NUMBER, description: "Total calories." },
              protein: { type: Type.NUMBER, description: "Protein in grams." },
              carbs: { type: Type.NUMBER, description: "Carbohydrates in grams." },
              fats: { type: Type.NUMBER, description: "Fats in grams." },
              fibre: { type: Type.NUMBER, description: "Fibre in grams." },
              emoji: { type: Type.STRING, description: "A single representative emoji." }
            },
            required: ["name", "calories", "protein", "carbs", "fats", "fibre", "emoji"],
          }
        }
      });

      const result = JSON.parse(response.text);
      setFormData({
        name: result.name,
        protein: result.protein.toString(),
        carbs: result.carbs.toString(),
        fat: result.fats.toString(),
        fibre: result.fibre.toString(),
        emoji: result.emoji
      });
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setError("Failed to analyze food. Please try again or enter manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name && pendingMacros.calories === 0) return;
    onLog({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Custom Entry',
      calories: Math.round(pendingMacros.calories),
      protein: pendingMacros.protein,
      carbs: pendingMacros.carbs,
      fats: pendingMacros.fats,
      fibre: pendingMacros.fibre,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: mealType,
      emoji: formData.emoji
    }, saveAsPreset);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-6 mb-10">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Log Nutrition</h1>
          <p className="text-slate-400 text-sm">Fuel your body with VibePulse Intelligence</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Side: Form & Quick Selection */}
        <div className="lg:col-span-7 space-y-10">
          {/* Smart AI Search */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
              AI Smart Log
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full group">
                <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold ${isAnalyzing ? 'animate-spin' : ''}`}>
                  {isAnalyzing ? 'sync' : 'search'}
                </span>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleSmartAnalyze()}
                  className={`w-full glass border border-slate-200 dark:border-white/10 rounded-2xl py-5 pl-14 pr-4 text-base focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 ${isAnalyzing ? 'opacity-50 cursor-wait' : ''}`} 
                  placeholder="Analyze with AI (e.g., 'bowl of oats with chia seeds')" 
                  type="text" 
                  disabled={isAnalyzing}
                />
              </div>
              <button 
                onClick={handleSmartAnalyze}
                disabled={isAnalyzing || !formData.name.trim()}
                className={`w-full sm:w-auto px-8 h-16 rounded-2xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center gap-2 font-black text-white blue-glow active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-lg">{isAnalyzing ? 'sync' : 'psychology'}</span>
                <span className="uppercase tracking-widest text-xs">Analyze</span>
              </button>
            </div>
            {error && <p className="text-fats text-xs font-bold px-2">{error}</p>}
          </section>

          {/* User Presets */}
          {presets.length > 0 && (
            <section>
              <h3 className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bookmark_star</span>
                Your Presets
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {presets.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => handleQuickAdd(preset)}
                    className="px-5 py-4 rounded-2xl glass border border-secondary/20 flex items-center gap-3 whitespace-nowrap hover:border-secondary/50 hover:bg-secondary/5 active:scale-95 transition-all group min-w-[160px]"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{preset.emoji}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{preset.name}</p>
                      <p className="text-[9px] text-slate-500 font-black uppercase">{preset.protein}P • {preset.carbs}C • {preset.fats}F • {preset.fibre}Fi</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Categorized Quick Add */}
          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">fastfood</span>
              Common Foods
            </h3>
            <div className="space-y-6">
              {CATEGORIZED_FOODS.map(cat => (
                <div key={cat.category}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">{cat.category}</p>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {cat.items.map(food => (
                      <button 
                        key={food.name}
                        onClick={() => handleQuickAdd(food)}
                        className="px-5 py-4 rounded-2xl glass border border-slate-200 dark:border-white/10 flex items-center gap-3 whitespace-nowrap hover:border-primary/30 dark:hover:border-primary/50 hover:bg-primary/5 active:scale-95 transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{food.e}</span>
                        <div className="text-left">
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{food.name}</p>
                          <p className="text-[9px] text-slate-500 font-black uppercase">{food.p}P • {food.c}C • {food.f}F • {food.fi}Fi</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Manual Entry Form */}
          <section className="space-y-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-fats">edit_note</span>
                  Manual Nutrients
                </h3>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type as any)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        mealType === type ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {/* Updated color props to match keys in MACRO_COLORS */}
               <MacroInput label="Protein" sub="Muscle" color="protein" value={formData.protein} onChange={(v) => setFormData({...formData, protein: v})} />
               <MacroInput label="Carbs" sub="Energy" color="carbs" value={formData.carbs} onChange={(v) => setFormData({...formData, carbs: v})} />
               <MacroInput label="Fats" sub="Health" color="fats" value={formData.fat} onChange={(v) => setFormData({...formData, fat: v})} />
               <MacroInput label="Fibre" sub="Gut" color="fibre" value={formData.fibre} onChange={(v) => setFormData({...formData, fibre: v})} />
             </div>

             <div className="flex items-center gap-3 px-2 pt-2">
                <input 
                  type="checkbox" 
                  id="save-preset"
                  checked={saveAsPreset}
                  onChange={(e) => setSaveAsPreset(e.target.checked)}
                  className="rounded bg-white/5 border-slate-200 dark:border-white/20 text-secondary focus:ring-secondary w-5 h-5"
                />
                <label htmlFor="save-preset" className="text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                  Save this meal as a Preset for later
                </label>
             </div>
          </section>
        </div>

        {/* Right Side: Impact Visualization & Summary */}
        <div className="lg:col-span-5 space-y-8">
           <div className={`glass p-8 rounded-[2.5rem] border transition-all duration-500 sticky top-10 border-slate-200 dark:border-white/10 shadow-xl`}>
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Meal Impact</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Real-time daily budget preview</p>
                 </div>
                 <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
                    {formData.emoji}
                 </div>
              </div>

              {/* Real-time Impact Bars */}
              <div className="space-y-6 mb-10">
                <ImpactBar 
                  label="Daily Calories" 
                  current={dailyTotals.calories} 
                  pending={pendingMacros.calories} 
                  goal={goals.calories} 
                  color="#a855f7" 
                  unit="kcal"
                />
                <ImpactBar 
                  label="Protein" 
                  current={dailyTotals.protein} 
                  pending={pendingMacros.protein} 
                  goal={goals.protein} 
                  color={MACRO_COLORS.protein} 
                  unit="g"
                />
                <ImpactBar 
                  label="Carbohydrates" 
                  current={dailyTotals.carbs} 
                  pending={pendingMacros.carbs} 
                  goal={goals.carbs} 
                  color={MACRO_COLORS.carbs} 
                  subText={`Net: ${Math.max(0, (dailyTotals.carbs + pendingMacros.carbs) - (dailyTotals.fibre + pendingMacros.fibre))}g`}
                  unit="g"
                />
                <ImpactBar 
                  label="Fibre" 
                  current={dailyTotals.fibre} 
                  pending={pendingMacros.fibre} 
                  goal={goals.fibre} 
                  color={MACRO_COLORS.fibre} 
                  unit="g"
                />
                <ImpactBar 
                  label="Fats" 
                  current={dailyTotals.fats} 
                  pending={pendingMacros.fats} 
                  goal={goals.fats} 
                  color={MACRO_COLORS.fats} 
                  unit="g"
                />
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">New Total</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{(dailyTotals.calories + pendingMacros.calories).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated kcal</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Metabolic Rate</p>
                    <p className={`text-2xl font-black text-emerald-500`}>
                       {Math.round((dailyTotals.fibre + pendingMacros.fibre) / ((dailyTotals.carbs + pendingMacros.carbs) || 1) * 100)}%
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Fibre-to-Carb Ratio</p>
                 </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!formData.name && pendingMacros.calories === 0}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all transform active:scale-95 shadow-lg ${
                  (!formData.name && pendingMacros.calories === 0) 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-primary text-white blue-glow hover:scale-[1.02] hover:-translate-y-1'
                }`}
              >
                <span className="material-symbols-outlined text-xl">check_circle</span>
                Confirm & Log Meal
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const MacroInput: React.FC<{
  label: string;
  sub: string;
  color: keyof typeof MACRO_COLORS;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, sub, color, value, onChange }) => (
  <div className={`p-4 rounded-3xl glass border border-slate-200 dark:border-white/10 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all flex flex-col items-center text-center group`}>
    <label className="text-[10px] font-black tracking-tight block text-slate-900 dark:text-white mb-1 uppercase tracking-[0.1em]">{label}</label>
    <div className="flex items-center justify-center gap-1">
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none p-0 w-12 text-center text-2xl font-black focus:ring-0 text-slate-900 dark:text-white placeholder-slate-200 dark:placeholder-slate-800" 
        placeholder="0" 
        type="number" 
      />
      <span className="text-[10px] font-bold text-slate-400">g</span>
    </div>
    <div className={`w-4 h-1 rounded-full mt-2 transition-all duration-300 opacity-30 group-focus-within:opacity-100 group-focus-within:w-8`} style={{ backgroundColor: MACRO_COLORS[color] }}></div>
  </div>
);

const ImpactBar: React.FC<{
  label: string;
  current: number;
  pending: number;
  goal: number;
  color: string;
  subText?: string;
  unit: string;
}> = ({ label, current, pending, goal, color, subText, unit }) => {
  const currentWidth = Math.min((current / goal) * 100, 100);
  const pendingWidth = Math.min((pending / goal) * 100, 100 - currentWidth);
  const isOver = (current + pending) > goal;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
        <div className="flex gap-2">
           <span>{label}</span>
           {subText && <span className="text-primary normal-case">{subText}</span>}
        </div>
        <span className={isOver ? 'text-fats' : ''}>
          {Math.round(current + pending)} / {goal} {unit}
        </span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900/50 rounded-full overflow-hidden relative shadow-inner">
        {/* Current Progress */}
        <div 
          className="h-full absolute left-0 top-0 transition-all duration-500 opacity-60" 
          style={{ width: `${currentWidth}%`, backgroundColor: color }}
        ></div>
        {/* Pending Progress */}
        <div 
          className="h-full absolute top-0 transition-all duration-500 animate-pulse border-l border-white/20" 
          style={{ 
            left: `${currentWidth}%`, 
            width: `${pendingWidth}%`, 
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}`
          }}
        ></div>
        {/* Over Goal Indicator */}
        {isOver && (
          <div 
            className="h-full absolute right-0 top-0 bg-fats opacity-30 animate-ping"
            style={{ width: `${((current + pending - goal) / goal) * 100}%` }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AddMeal;
