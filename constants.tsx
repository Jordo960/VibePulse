
import { Meal, User, WeightEntry } from './types';

export const MOCK_USER: User = {
  id: 'user-123',
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatar: "https://picsum.photos/seed/alex/200",
  level: 12,
  isPro: true,
  weight: 85,
  weightGoal: 78,
};

export const MOCK_MEALS: Meal[] = [
  {
    id: '1',
    name: 'Healthy Bowl',
    calories: 420,
    protein: 25,
    carbs: 45,
    fats: 12,
    fibre: 12,
    time: '8:45 AM',
    type: 'Breakfast',
    emoji: '🥑'
  },
  {
    id: '2',
    name: 'Protein Steak',
    calories: 580,
    protein: 55,
    carbs: 10,
    fats: 28,
    fibre: 2,
    time: '1:30 PM',
    type: 'Lunch',
    emoji: '🥩'
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    calories: 200,
    protein: 18,
    carbs: 15,
    fats: 4,
    fibre: 0,
    time: '4:00 PM',
    type: 'Snack',
    emoji: '🫐'
  }
];

export const MOCK_WEIGHT_HISTORY: WeightEntry[] = [
  { date: 'Jan', weight: 92 },
  { date: 'Feb', weight: 89.5 },
  { date: 'Mar', weight: 88 },
  { date: 'Apr', weight: 87.2 },
  { date: 'May', weight: 86.1 },
  { date: 'Jun', weight: 85.0 },
];

export const MACRO_COLORS = {
  protein: '#3b82f6',
  carbs: '#a855f7',
  fats: '#f43f5e',
  fibre: '#10b981', // Emerald Green
};
