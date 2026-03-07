import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDay } from "date-fns";
import { Calendar, Zap } from "lucide-react";
import { TimeSession } from "@/types/mountain";

interface AdvancedStatsProps {
  sessions: TimeSession[];
}

export const AdvancedStats = ({ sessions }: AdvancedStatsProps) => {
  const avgSessionLength = useMemo(() => {
    if (sessions.length === 0) return 0;
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    return totalDuration / sessions.length / 60; // v minutach
  }, [sessions]);

  const bestDay = useMemo(() => {
    const dayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const dayData = Array(7).fill(0).map((_, i) => ({
      day: dayNames[i],
      hours: 0,
    }));

    sessions.forEach((session) => {
      const dayIndex = getDay(new Date(session.created_at));
      dayData[dayIndex].hours += session.duration / 3600;
    });

    const sorted = [...dayData].sort((a, b) => b.hours - a.hours);
    return sorted[0];
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Průměrná session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {avgSessionLength.toFixed(0)} min
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              V průměru strávíš {avgSessionLength.toFixed(0)} minut na jedné aktivitě
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Nejlepší den
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {bestDay?.day || "—"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {bestDay?.hours > 0 
                ? `Celkem ${bestDay.hours.toFixed(1)} hodin strávených v tento den`
                : "Zatím nemáš žádné aktivity"
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

