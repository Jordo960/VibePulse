
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Stats from './screens/Stats';
import Profile from './screens/Profile';
import AddMeal from './screens/AddMeal';
import Log from './screens/Log';
import WeightProgress from './screens/WeightProgress';
import Auth from './screens/Auth';
import { Screen, Meal, WeightEntry, NutritionalGoals, User, MealPreset } from './types';
import { MOCK_MEALS, MOCK_WEIGHT_HISTORY, MOCK_USER } from './constants';

const DEFAULT_GOALS: NutritionalGoals = {
  calories: 2000,
  protein: 140,
  carbs: 250,
  fats: 65,
  fibre: 30
};

const DEFAULT_PRESETS: MealPreset[] = [
  { id: 'p1', name: 'Bulletproof Coffee', calories: 250, protein: 1, carbs: 0, fats: 28, fibre: 0, emoji: '☕' },
  { id: 'p2', name: 'Overnight Oats', calories: 350, protein: 12, carbs: 55, fats: 8, fibre: 10, emoji: '🥣' }
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('vibe_pulse_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vibe_pulse_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeScreen, setActiveScreen] = useState<Screen>('Home');
  const [meals, setMeals] = useState<Meal[]>(MOCK_MEALS);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(MOCK_WEIGHT_HISTORY);
  const [waterIntake, setWaterIntake] = useState(3);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [presets, setPresets] = useState<MealPreset[]>(() => {
    const saved = localStorage.getItem('vibe_pulse_presets');
    return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
  });

  const [goals, setGoals] = useState<NutritionalGoals>(() => {
    const saved = localStorage.getItem('vibe_pulse_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  const [backendGoals, setBackendGoals] = useState<NutritionalGoals | null>(() => {
    const saved = localStorage.getItem('vibe_pulse_backend_goals');
    return saved ? JSON.parse(saved) : null;
  });

  const [lastSynced, setLastSynced] = useState<string | null>(() => {
    return localStorage.getItem('vibe_pulse_last_synced');
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vibe_pulse_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('vibe_pulse_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('vibe_pulse_presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    if (backendGoals) {
      localStorage.setItem('vibe_pulse_backend_goals', JSON.stringify(backendGoals));
    }
  }, [backendGoals]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('vibe_pulse_session', JSON.stringify(user));
    setToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
    setActiveScreen('Home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vibe_pulse_session');
    setToast({ message: 'Logged out successfully', type: 'info' });
  };

  const handleAddMeal = (newMeal: Meal, shouldSavePreset?: boolean) => {
    setMeals([newMeal, ...meals]);
    if (shouldSavePreset) {
      const newPreset: MealPreset = {
        id: Math.random().toString(36).substr(2, 9),
        name: newMeal.name,
        calories: newMeal.calories,
        protein: newMeal.protein,
        carbs: newMeal.carbs,
        fats: newMeal.fats,
        fibre: newMeal.fibre,
        emoji: newMeal.emoji
      };
      setPresets([newPreset, ...presets]);
    }
    setToast({ message: `${newMeal.name} added to your log!`, type: 'success' });
    setActiveScreen('Home');
  };

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
    setToast({ message: 'Meal removed', type: 'info' });
  };

  const handleAddPreset = (preset: MealPreset) => {
    setPresets([preset, ...presets]);
    setToast({ message: `Preset "${preset.name}" created!`, type: 'success' });
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
    setToast({ message: 'Preset deleted', type: 'info' });
  };

  const handleAddWeight = (weight: number) => {
    const newEntry = { date: new Date().toLocaleDateString('en-US', { month: 'short' }), weight };
    setWeightHistory([...weightHistory, newEntry]);
    setToast({ message: `Weight logged: ${weight}kg`, type: 'success' });
  };

  const handleUpdateGoals = (newGoals: NutritionalGoals) => {
    setGoals(newGoals);
    setToast({ message: 'Nutrition goals updated locally!', type: 'success' });
  };

  const handleSyncGoals = async () => {
    try {
      setToast({ message: 'Syncing with cloud...', type: 'info' });
      await new Promise(resolve => setTimeout(resolve, 1500));
      const now = new Date().toLocaleString();
      setBackendGoals({ ...goals });
      setLastSynced(now);
      localStorage.setItem('vibe_pulse_last_synced', now);
      setToast({ message: 'Successfully synced with backend!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Sync failed. Check connection.', type: 'error' });
    }
  };

  if (!currentUser) {
    return (
      <>
        {toast && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[80%] max-w-sm pointer-events-none transition-all duration-300">
            <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md border animate-bounce ${
              toast.type === 'success' ? 'bg-primary/20 border-primary/30' : 'bg-white/10 border-white/20'
            }`}>
              <span className="text-xs font-bold text-white">{toast.message}</span>
            </div>
          </div>
        )}
        <Auth onLogin={handleLogin} />
      </>
    );
  }

  const dailyTotals = {
    protein: meals.reduce((acc, m) => acc + m.protein, 0),
    carbs: meals.reduce((acc, m) => acc + m.carbs, 0),
    fats: meals.reduce((acc, m) => acc + m.fats, 0),
    fibre: meals.reduce((acc, m) => acc + m.fibre, 0),
    calories: meals.reduce((acc, m) => acc + m.calories, 0),
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return (
          <Dashboard 
            meals={meals} 
            onDeleteMeal={handleDeleteMeal}
            waterIntake={waterIntake}
            onWaterChange={setWaterIntake}
            goals={goals}
            onWeightClick={() => setActiveScreen('WeightProgress')}
          />
        );
      case 'Log':
        return (
          <Log 
            meals={meals} 
            presets={presets}
            onDeleteMeal={handleDeleteMeal} 
            onAddClick={() => setActiveScreen('AddMeal')}
            onDeletePreset={handleDeletePreset}
            onAddPreset={handleAddPreset}
          />
        );
      case 'Stats':
        return <Stats meals={meals} goals={goals} />;
      case 'Me':
        return (
          <Profile 
            user={currentUser}
            goals={goals} 
            backendGoals={backendGoals}
            lastSynced={lastSynced}
            onUpdateGoals={handleUpdateGoals}
            onSync={handleSyncGoals}
            onLogout={handleLogout}
            onWeightClick={() => setActiveScreen('WeightProgress')} 
          />
        );
      case 'AddMeal':
        return (
          <AddMeal 
            onBack={() => setActiveScreen('Home')} 
            onLog={handleAddMeal}
            goals={goals}
            dailyTotals={dailyTotals}
            presets={presets}
          />
        );
      case 'WeightProgress':
        return <WeightProgress weightHistory={weightHistory} onAddWeight={handleWeightEntry => handleAddWeight(handleWeightEntry)} onBack={() => setActiveScreen('Me')} />;
      default:
        return <Dashboard meals={meals} onDeleteMeal={handleDeleteMeal} waterIntake={waterIntake} onWaterChange={setWaterIntake} goals={goals} onWeightClick={() => setActiveScreen('WeightProgress')} />;
    }
  };

  const isFullScreen = ['AddMeal', 'WeightProgress'].includes(activeScreen);

  return (
    <Layout 
      activeScreen={activeScreen} 
      setActiveScreen={setActiveScreen}
      hideNav={isFullScreen}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {toast && (
        <div className="fixed md:absolute top-16 left-1/2 -translate-x-1/2 z-[100] w-[80%] max-w-sm pointer-events-none transition-all duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md border animate-bounce ${
            toast.type === 'success' ? 'bg-primary/20 border-primary/30' : 
            toast.type === 'error' ? 'bg-fats/20 border-fats/30' : 
            'bg-white/10 dark:bg-white/10 border-white/20 dark:border-white/20'
          }`}>
            <span className="material-symbols-outlined text-sm font-bold">
              {toast.type === 'success' ? 'check_circle' : 
               toast.type === 'error' ? 'error' : 'sync'}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{toast.message}</span>
          </div>
        </div>
      )}
      {renderScreen()}
    </Layout>
  );
};

export default App;
