
export interface Macro {
  current: number;
  goal: number;
}

export interface DailyStats {
  calories: Macro;
  protein: Macro;
  carbs: Macro;
  fats: Macro;
  fibre: Macro;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fibre: number;
  time: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  emoji: string;
}

export interface MealPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fibre: number;
  emoji: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  isPro: boolean;
  weight: number;
  weightGoal: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fibre: number;
}

export type Screen = 'Home' | 'Log' | 'Stats' | 'Me' | 'AddMeal' | 'WeightProgress' | 'Auth';
