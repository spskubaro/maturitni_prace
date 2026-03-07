export const TIME = {
  NOTIFICATION_INTERVAL_MS: 30 * 60 * 1000,
  NOTIFICATION_INTERVAL_MINUTES: 30,
  TIMER_UPDATE_INTERVAL_MS: 1000,
  MIN_SESSION_DURATION_SECONDS: 60,
  SECONDS_IN_HOUR: 3600,
  SECONDS_IN_MINUTE: 60,
  MINUTES_IN_HOUR: 60,
  HOURS_IN_DAY: 24,
  DAYS_IN_WEEK: 7,
} as const;

export const POINTS = {
  STUDY: 100,
  WORK: 80,
  EXERCISE: 120,
  READING: 90,
  MEDITATION: 110,
  CODING: 100,
  MUSIC: 70,
  LANGUAGE: 95,
  COOKING: 60,
  CLEANING: 50,
} as const;

export const MOUNTAIN_POINTS = {
  EVEREST: 10000,
  K2: 9500,
  KANGCHENJUNGA: 9000,
  LHOTSE: 8500,
  MAKALU: 8000,
  CHO_OYU: 7500,
  DHAULAGIRI: 7000,
  MANASLU: 6500,
  NANGA_PARBAT: 6000,
  ANNAPURNA: 5500,
  GASHERBRUM_I: 5000,
  BROAD_PEAK: 4500,
  GASHERBRUM_II: 4000,
  SHISHAPANGMA: 3500,
  MONT_BLANC: 3000,
  KILIMANJARO: 2500,
  DENALI: 2000,
  ELBRUS: 1500,
  ACONCAGUA: 1000,
  MATTERHORN: 500,
} as const;

export const UI = {
  PROGRESS_BAR_HEIGHT: 8,
  CHART_HEIGHT: 300,
  TOAST_DURATION_SHORT: 3000,
  TOAST_DURATION_NORMAL: 5000,
  TOAST_DURATION_LONG: 10000,
  ANIMATION_DURATION_MS: 300,
  MOBILE_MAX_WIDTH: 640,
  TABLET_MAX_WIDTH: 1024,
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  ACTIVITY_NAME_MAX_LENGTH: 100,
  ACTIVITY_NOTES_MAX_LENGTH: 500,
} as const;

export const STORAGE_KEYS = {
  TIMER_STATE: "climbflow_timer_state",
  THEME: "theme",
  SOUND_ENABLED: "climbflow_sound_enabled",
  NOTIFICATIONS_ENABLED: "notificationsEnabled",
  ONBOARDING_COMPLETED: "onboardingCompleted",
  SESSION_LOADED: "timerLoadedInSession",
} as const;

export const TABLES = {
  PROFILES: "profiles",
  USER_PROGRESS: "user_progress",
  TIME_SESSIONS: "time_sessions",
  PLANNED_ACTIVITIES: "planned_activities",
} as const;

export const MOTIVATIONAL_MESSAGES = {
  SESSION_COMPLETE: [
    "Skvělá práce!",
    "Výborně!",
    "Pokračuj dál!",
    "Jsi šampion!",
    "Úžasné!",
  ],
  MOUNTAIN_COMPLETE: [
    "Zdolal jsi horu!",
    "Vrchol dosažen!",
    "Gratulujeme k výstupu!",
    "Další hora za tebou!",
  ],
  DAILY_GOAL_REACHED: [
    "Denní cíl splněn!",
    "Dnes jsi exceloval!",
    "100 procent splněno!",
  ],
  STREAK_MILESTONE: [
    "Máš skvělou sérii!",
    "Konzistence je klíč!",
    "Neuvěřitelná série!",
  ],
} as const;

export const ACTIVITY_CATEGORIES = {
  EDUCATION: "Vzdělávání",
  PRODUCTIVITY: "Produktivita",
  HEALTH: "Zdraví",
  CREATIVITY: "Kreativita",
  HOUSEHOLD: "Domácnost",
} as const;

export function getRandomMessage(messages: readonly string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / TIME.SECONDS_IN_HOUR);
  const minutes = Math.floor((seconds % TIME.SECONDS_IN_HOUR) / TIME.SECONDS_IN_MINUTE);
  const secs = seconds % TIME.SECONDS_IN_MINUTE;

  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function calculatePoints(durationSeconds: number, pointsPerHour: number): number {
  const hours = durationSeconds / TIME.SECONDS_IN_HOUR;
  return Math.round(hours * pointsPerHour);
}

