import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSession } from "@/types/mountain";
import { format, startOfWeek, addDays, subWeeks, isSameDay } from "date-fns";
import { cs } from "date-fns/locale";

interface ActivityHeatmapProps {
  sessions: TimeSession[];
}

export const ActivityHeatmap = ({ sessions }: ActivityHeatmapProps) => {
  const weeks = 12;
  const today = new Date();
  const startDate = subWeeks(startOfWeek(today, { weekStartsOn: 1 }), weeks - 1);

  const gridData: { date: Date; count: number; duration: number }[] = [];
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(startDate, week * 7 + day);
      const daySessions = sessions.filter((s) =>
        isSameDay(new Date(s.created_at), date)
      );
      gridData.push({
        date,
        count: daySessions.length,
        duration: daySessions.reduce((acc, s) => acc + s.duration, 0),
      });
    }
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/50";
    if (count === 3) return "bg-primary/70";
    return "bg-primary";
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const days = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivita za posledních {weeks} týdnů</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-6">
            {days.map((day, i) => (
              <div key={i} className="h-3 flex items-center">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1">
              {Array.from({ length: weeks }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  <div className="h-4 text-xs text-muted-foreground text-center">
                    {weekIndex % 4 === 0 &&
                      format(addDays(startDate, weekIndex * 7), "MMM", {
                        locale: cs,
                      })}
                  </div>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const data = gridData[dataIndex];
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getColor(
                          data.count
                        )} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                        title={`${format(data.date, "d. MMM yyyy", {
                          locale: cs,
                        })}\n${data.count} aktivit\n${formatDuration(
                          data.duration
                        )}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Méně</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-primary/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/70" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>Více</span>
        </div>
      </CardContent>
    </Card>
  );
};



