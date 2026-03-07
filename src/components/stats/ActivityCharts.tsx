import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSession } from "@/types/mountain";
import { defaultActivities } from "@/data/activities";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { cs } from "date-fns/locale";

interface ActivityChartsProps {
  sessions: TimeSession[];
}

export const ActivityCharts = ({ sessions }: ActivityChartsProps) => {
  const categoryData = sessions.reduce((acc, session) => {
    const activity = defaultActivities.find((a) => a.id === session.activity_id);
    if (!activity) return acc;

    const existing = acc.find((item) => item.name === activity.category);
    if (existing) {
      existing.hours += session.duration / 3600;
      existing.points += session.points;
    } else {
      acc.push({
        name: activity.category,
        hours: session.duration / 3600,
        points: session.points,
        color: activity.color,
      });
    }
    return acc;
  }, [] as { name: string; hours: number; points: number; color: string }[]);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySessions = sessions.filter((s) =>
      isSameDay(new Date(s.created_at), date)
    );
    return {
      date: format(date, "EEE", { locale: cs }),
      hours: daySessions.reduce((acc, s) => acc + s.duration / 3600, 0),
      points: daySessions.reduce((acc, s) => acc + s.points, 0),
      sessions: daySessions.length,
    };
  });

  const activityData = sessions.reduce((acc, session) => {
    const activity = defaultActivities.find((a) => a.id === session.activity_id);
    if (!activity) return acc;

    const existing = acc.find((item) => item.name === activity.name);
    if (existing) {
      existing.value += session.duration / 3600;
    } else {
      acc.push({
        name: activity.name,
        value: session.duration / 3600,
        color: activity.color,
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  const COLORS = categoryData.map((d) => d.color);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Čas podle kategorií</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => `${value.toFixed(1)}h`}
              />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rozložení aktivit</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => `${value.toFixed(1)}h`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Pokrok za posledních 7 dní</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Hodiny"
                dot={{ fill: "hsl(var(--primary))" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="points"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                name="Body"
                dot={{ fill: "hsl(var(--secondary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};



