import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSession } from "@/types/mountain";
import { defaultActivities } from "@/data/activities";
import { Award, Clock, TrendingUp, Target } from "lucide-react";

interface StatsOverviewProps {
  sessions: TimeSession[];
  totalPoints: number;
}

export const StatsOverview = ({ sessions, totalPoints }: StatsOverviewProps) => {
  let totalTime = 0;
  for (let i = 0; i < sessions.length; i++) {
    totalTime = totalTime + sessions[i].duration;
  }
  
  const totalHours = Math.floor(totalTime / 3600);
  const remainingSeconds = totalTime % 3600;
  const totalMinutes = Math.floor(remainingSeconds / 60);

  const categoryStats: Record<string, { time: number; points: number }> = {};
  
  for (const session of sessions) {
    let activity = null;
    for (const act of defaultActivities) {
      if (act.id === session.activity_id) {
        activity = act;
        break;
      }
    }
    
    if (!activity) continue;

    if (!categoryStats[activity.category]) {
      categoryStats[activity.category] = { time: 0, points: 0 };
    }
    categoryStats[activity.category].time += session.duration;
    categoryStats[activity.category].points += session.points;
  }

  let topCategory: [string, { time: number; points: number }] | null = null;
  let maxTime = 0;
  for (const [category, stats] of Object.entries(categoryStats)) {
    if (stats.time > maxTime) {
      maxTime = stats.time;
      topCategory = [category, stats];
    }
  }

  const stats = [
    {
      title: "Celkové body",
      value: totalPoints.toLocaleString(),
      icon: Award,
      color: "text-primary",
    },
    {
      title: "Celkový čas",
      value: `${totalHours}h ${totalMinutes}m`,
      icon: Clock,
      color: "text-secondary",
    },
    {
      title: "Počet aktivit",
      value: sessions.length.toString(),
      icon: Target,
      color: "text-accent",
    },
    {
      title: "Top kategorie",
      value: topCategory ? topCategory[0] : "Žádná",
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
