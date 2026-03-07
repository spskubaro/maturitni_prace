export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: "total_points" | "total_hours" | "sessions_count" | "mountains_completed" | "streak_days";
    value: number;
  };
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export const achievements: Achievement[] = [
  {
    id: "points_100",
    name: "První kroky",
    description: "Získej 100 bodů",
    icon: "🎯",
    requirement: { type: "total_points", value: 100 },
    tier: "bronze",
  },
  {
    id: "points_500",
    name: "Začátečník",
    description: "Získej 500 bodů",
    icon: "⭐",
    requirement: { type: "total_points", value: 500 },
    tier: "bronze",
  },
  {
    id: "points_1000",
    name: "Pokročilý",
    description: "Získej 1000 bodů",
    icon: "🌟",
    requirement: { type: "total_points", value: 1000 },
    tier: "silver",
  },
  {
    id: "points_5000",
    name: "Expert",
    description: "Získej 5000 bodů",
    icon: "💫",
    requirement: { type: "total_points", value: 5000 },
    tier: "gold",
  },
  {
    id: "points_10000",
    name: "Mistr",
    description: "Získej 10000 bodů",
    icon: "👑",
    requirement: { type: "total_points", value: 10000 },
    tier: "platinum",
  },

  {
    id: "hours_10",
    name: "Prvních 10 hodin",
    description: "Nasbírej 10 hodin aktivity",
    icon: "⏰",
    requirement: { type: "total_hours", value: 10 },
    tier: "bronze",
  },
  {
    id: "hours_50",
    name: "50 hodin",
    description: "Nasbírej 50 hodin aktivity",
    icon: "⏱️",
    requirement: { type: "total_hours", value: 50 },
    tier: "silver",
  },
  {
    id: "hours_100",
    name: "100 hodin",
    description: "Nasbírej 100 hodin aktivity",
    icon: "⌚",
    requirement: { type: "total_hours", value: 100 },
    tier: "gold",
  },
  {
    id: "hours_500",
    name: "500 hodin",
    description: "Nasbírej 500 hodin aktivity",
    icon: "🕐",
    requirement: { type: "total_hours", value: 500 },
    tier: "platinum",
  },

  {
    id: "sessions_10",
    name: "První desítka",
    description: "Dokonči 10 aktivit",
    icon: "📘",
    requirement: { type: "sessions_count", value: 10 },
    tier: "bronze",
  },
  {
    id: "sessions_50",
    name: "Padesátka",
    description: "Dokonči 50 aktivit",
    icon: "📋",
    requirement: { type: "sessions_count", value: 50 },
    tier: "silver",
  },
  {
    id: "sessions_100",
    name: "Stovka",
    description: "Dokonči 100 aktivit",
    icon: "📊",
    requirement: { type: "sessions_count", value: 100 },
    tier: "gold",
  },
  {
    id: "sessions_500",
    name: "Pětistovka",
    description: "Dokonči 500 aktivit",
    icon: "📈",
    requirement: { type: "sessions_count", value: 500 },
    tier: "platinum",
  },

  {
    id: "mountain_1",
    name: "První vrchol",
    description: "Zdolej svou první horu",
    icon: "🏔️",
    requirement: { type: "mountains_completed", value: 1 },
    tier: "bronze",
  },
  {
    id: "mountain_5",
    name: "Horolezec",
    description: "Zdolej 5 hor",
    icon: "⛰️",
    requirement: { type: "mountains_completed", value: 5 },
    tier: "silver",
  },
  {
    id: "mountain_10",
    name: "Alpinista",
    description: "Zdolej 10 hor",
    icon: "🗻",
    requirement: { type: "mountains_completed", value: 10 },
    tier: "gold",
  },
  {
    id: "mountain_20",
    name: "Legenda",
    description: "Zdolej všech 20 hor",
    icon: "🏆",
    requirement: { type: "mountains_completed", value: 20 },
    tier: "platinum",
  },

  {
    id: "streak_3",
    name: "Začátek série",
    description: "3 dny v řadě",
    icon: "🔥",
    requirement: { type: "streak_days", value: 3 },
    tier: "bronze",
  },
  {
    id: "streak_7",
    name: "Týdenní série",
    description: "7 dní v řadě",
    icon: "🔥",
    requirement: { type: "streak_days", value: 7 },
    tier: "silver",
  },
  {
    id: "streak_30",
    name: "Měsíční série",
    description: "30 dní v řadě",
    icon: "🔥",
    requirement: { type: "streak_days", value: 30 },
    tier: "gold",
  },
  {
    id: "streak_100",
    name: "Neuvěřitelná série",
    description: "100 dní v řadě",
    icon: "🔥",
    requirement: { type: "streak_days", value: 100 },
    tier: "platinum",
  },
];
