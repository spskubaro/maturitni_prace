import { Mountain } from "@/types/mountain";
import { mountains } from "@/data/mountains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MountainSelectorProps {
  currentMountainId: string;
  currentMountainPoints: number;
  completedMountains: string[];
  mountainProgress: Record<string, number>;
  onSelectMountain: (mountainId: string) => void;
}

export const MountainSelector = ({
  currentMountainId,
  currentMountainPoints,
  completedMountains,
  mountainProgress,
  onSelectMountain,
}: MountainSelectorProps) => {
  const sortedMountains = [...mountains].sort(
    (a, b) => a.pointsRequired - b.pointsRequired
  );

  const currentMountain = mountains.find(m => m.id === currentMountainId);

  const difficultyOrder = ['easy', 'medium', 'hard', 'extreme'];

  const canSelect = (mountain: Mountain) => {
    if (mountain.id === currentMountainId) return false;
    
    if (!currentMountain) return false;

    const currentDifficultyIndex = difficultyOrder.indexOf(currentMountain.difficulty);
    const targetDifficultyIndex = difficultyOrder.indexOf(mountain.difficulty);

    if (mountain.difficulty === currentMountain.difficulty) return true;

    if (targetDifficultyIndex < currentDifficultyIndex) return true;

    return false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success text-white";
      case "medium":
        return "bg-primary text-primary-foreground";
      case "hard":
        return "bg-accent text-accent-foreground";
      case "extreme":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getMountainPoints = (mountain: Mountain) => {
    if (completedMountains.includes(mountain.id)) return mountain.pointsRequired;
    if (mountain.id === currentMountainId) return currentMountainPoints;
    return mountainProgress[mountain.id] ?? 0;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Výběr hory</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {sortedMountains.map((mountain) => {
              const selectable = canSelect(mountain);
              const completed = completedMountains.includes(mountain.id);
              const isCurrent = mountain.id === currentMountainId;
              const pointsOnMountain = getMountainPoints(mountain);
              const progressPercent = Math.min(
                100,
                (pointsOnMountain / mountain.pointsRequired) * 100
              );

              return (
                <div
                  key={mountain.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : selectable
                      ? "border-border hover:border-primary/50 cursor-pointer"
                      : "border-border opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (selectable) {
                      onSelectMountain(mountain.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground">
                          {mountain.name}
                        </h4>
                        {completed && (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        )}
                        {!selectable && !isCurrent && !completed && (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {mountain.height}m
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(mountain.difficulty)}`}>
                          {mountain.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {mountain.country}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mountain.pointsRequired} bodů k dokončení
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Napracováno</span>
                          <span className="font-semibold whitespace-nowrap">
                            {Math.max(0, Math.floor(pointsOnMountain))} / {mountain.pointsRequired}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {selectable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMountain(mountain.id);
                        }}
                      >
                        Vybrat
                      </Button>
                    )}
                    {isCurrent && !completed && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled
                      >
                        Aktuální
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


