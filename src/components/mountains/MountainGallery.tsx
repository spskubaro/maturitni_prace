import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MountainSilhouette } from "@/components/dashboard/MountainSilhouette";
import { mountains } from "@/data/mountains";
import { Mountain } from "@/types/mountain";
import { Mountain as MountainIcon, Grid3x3, List } from "lucide-react";

interface MountainGalleryProps {
  currentMountainId: string;
  completedMountains: string[];
  totalPoints: number;
  currentMountainPoints: number;
  mountainProgress?: Record<string, number>;
  onSelectMountain: (mountainId: string) => void;
}

export const MountainGallery = ({
  currentMountainId,
  completedMountains,
  totalPoints,
  currentMountainPoints,
  mountainProgress,
  onSelectMountain,
}: MountainGalleryProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortedMountains = [...mountains].sort(
    (a, b) => a.pointsRequired - b.pointsRequired
  );

  const currentMountain = mountains.find(m => m.id === currentMountainId);

  const difficultyOrder = ['easy', 'medium', 'hard', 'extreme'];

  const calculateProgress = (mountain: Mountain) => {
    if (completedMountains.includes(mountain.id)) return 100;
    const pts = mountain.id === currentMountainId
      ? currentMountainPoints
      : (mountainProgress?.[mountain.id] ?? 0);
    return Math.min(100, (pts / mountain.pointsRequired) * 100);
  };

  const canSelect = (mountain: Mountain) => {
    if (mountain.id === currentMountainId) return false;
    
    if (!currentMountain) return false;

    const currentDifficultyIndex = difficultyOrder.indexOf(currentMountain.difficulty);
    const targetDifficultyIndex = difficultyOrder.indexOf(mountain.difficulty);

    if (mountain.difficulty === currentMountain.difficulty) return true;

    if (targetDifficultyIndex < currentDifficultyIndex) return true;

    return false;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MountainIcon className="w-5 h-5" />
            Galerie hor
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Zdolej všech {mountains.length} světových vrcholů! Aktuálně máš{" "}
          <span className="font-semibold text-primary">{totalPoints} bodů</span> a zdolal jsi{" "}
          <span className="font-semibold text-green-500">
            {completedMountains.length} {completedMountains.length === 1 ? "horu" : "hor"}
          </span>
          .
        </p>
      </CardHeader>
      <CardContent>
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {sortedMountains.map((mountain) => {
            const progress = calculateProgress(mountain);
            const isCompleted = completedMountains.includes(mountain.id);
            const isCurrent = mountain.id === currentMountainId;
            const selectable = canSelect(mountain);

            return (
              <MountainSilhouette
                key={mountain.id}
                mountain={mountain}
                progress={progress}
                isCompleted={isCompleted}
                isCurrent={isCurrent}
                onClick={selectable ? () => onSelectMountain(mountain.id) : undefined}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};


