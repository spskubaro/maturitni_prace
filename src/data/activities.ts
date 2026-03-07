import { Activity } from "@/types/mountain";
import { POINTS, ACTIVITY_CATEGORIES } from "@/config/constants";

export const defaultActivities: Activity[] = [
  {
    id: "study",
    name: "Studium",
    category: ACTIVITY_CATEGORIES.EDUCATION,
    pointsPerHour: POINTS.STUDY,
    color: "hsl(210, 80%, 45%)",
  },
  {
    id: 'work',
    name: "Práce",
    category: ACTIVITY_CATEGORIES.PRODUCTIVITY,
    pointsPerHour: POINTS.WORK,
    color: "hsl(150, 40%, 50%)",
  },
  {
    id: "exercise",
    name: "Cviceni",
    category: ACTIVITY_CATEGORIES.HEALTH,
    pointsPerHour: POINTS.EXERCISE,
    color: "hsl(30, 90%, 60%)",
  },
  {
    id: "reading",
    name: "Cteni",
    category: ACTIVITY_CATEGORIES.EDUCATION,
    pointsPerHour: POINTS.READING,
    color: "hsl(280, 60%, 55%)",
  },
  {
    id: "meditation",
    name: "Meditace",
    category: ACTIVITY_CATEGORIES.HEALTH,
    pointsPerHour: POINTS.MEDITATION,
    color: "hsl(180, 50%, 50%)",
  },
  {
    id: "coding",
    name: "Programovani",
    category: ACTIVITY_CATEGORIES.EDUCATION,
    pointsPerHour: POINTS.CODING,
    color: "hsl(200, 70%, 50%)",
  },
  {
    id: "music",
    name: "Hudba",
    category: ACTIVITY_CATEGORIES.CREATIVITY,
    pointsPerHour: POINTS.MUSIC,
    color: "hsl(340, 75%, 55%)",
  },
  {
    id: "language",
    name: "Jazyky",
    category: ACTIVITY_CATEGORIES.EDUCATION,
    pointsPerHour: POINTS.LANGUAGE,
    color: "hsl(45, 85%, 55%)",
  },
];
