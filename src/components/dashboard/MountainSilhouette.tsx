import { Mountain } from "@/types/mountain";
import { cn } from "@/lib/utils";

interface MountainIllustrationProps {
  mountainId: string;
  className?: string;
}

export function MountainIllustration({ mountainId, className = "" }: MountainIllustrationProps) {
  const illustrations: Record<string, JSX.Element> = {
    matterhorn: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 8 L35 65 L20 65 L15 70 L105 70 L100 65 L85 65 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 8 L50 30 M60 8 L70 28"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M45 45 L55 35 L65 48 L75 40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M30 65 L40 55 L50 60 L60 50 L70 58 L80 52 L90 65"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    aconcagua: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M55 12 L25 65 L10 70 L110 70 L95 65 L70 20 L65 25 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 12 L48 28 L58 25 L70 20"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 50 L45 42 L55 48 L65 40 L75 50"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    denali: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M50 15 L20 60 L10 70 L110 70 L100 60 L85 35 L75 45 L65 30 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 15 L45 30 L55 28"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M65 30 L60 40 L70 38 L85 35"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M30 55 L45 48 L60 55 L75 50 L90 58"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    elbrus: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M35 18 L15 60 L8 70 L112 70 L105 60 L85 18 L70 35 L60 30 L50 35 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="35"
          cy="22"
          rx="8"
          ry="4"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.2"
        />
        <ellipse
          cx="85"
          cy="22"
          rx="8"
          ry="4"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.2"
        />
        <path
          d="M28 35 L42 30 M78 35 L92 30"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 50 L40 45 L55 52 L70 45 L85 52 L95 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    kilimanjaro: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M40 20 L45 18 L55 18 L60 15 L65 18 L75 18 L80 20 L100 55 L110 70 L10 70 L20 55 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 25 L55 22 L65 25"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 40 L50 35 L60 38 L70 35 L85 40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 55 L45 50 L60 53 L75 50 L95 55"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    "mont-blanc": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M55 12 L30 50 L20 52 L10 70 L110 70 L100 52 L90 50 L75 25 L68 35 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 12 L50 25 L60 22 L68 35"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 45 L48 40 L58 45 L68 42 L80 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    shishapangma: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M45 15 L55 12 L65 15 L70 18 L95 60 L105 70 L15 70 L25 60 L50 18 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 12 L52 22 L58 20 L55 30"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M40 40 L52 35 L62 40 L72 36 L82 42"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    "gasherbrum-ii": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 10 L40 45 L30 48 L15 70 L105 70 L90 48 L80 45 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 10 L55 25 L65 22"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M42 42 L52 38 L60 42 L68 38 L78 42"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 60 L45 55 L60 58 L75 55 L95 60"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    "broad-peak": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M30 20 L45 15 L60 18 L75 15 L90 20 L105 65 L110 70 L10 70 L15 65 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 15 L48 28 L58 25 L60 18"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M60 18 L62 28 L72 25 L75 15"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 50 L45 45 L60 48 L75 45 L95 50"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    "gasherbrum-i": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M55 8 L35 50 L25 55 L15 70 L105 70 L95 55 L85 50 L75 20 L68 30 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 8 L52 22 L62 18 L68 30"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M40 45 L52 40 L62 45 L72 42 L80 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    annapurna: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M25 25 L40 18 L55 22 L60 15 L65 22 L80 18 L95 25 L108 70 L12 70 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 15 L55 30 L65 28"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 40 L50 35 L60 40 L70 35 L85 40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M22 55 L40 50 L60 54 L80 50 L98 55"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    "nanga-parbat": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 8 L30 55 L20 58 L10 70 L110 70 L100 58 L90 55 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 8 L55 25 L65 22 L60 35"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M38 48 L50 42 L60 48 L70 42 L82 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    manaslu: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M50 12 L70 10 L90 40 L100 70 L20 70 L30 40 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 12 L55 25 L65 22 L70 10"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M38 50 L52 45 L62 50 L72 46 L85 52"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    dhaulagiri: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M35 18 L50 12 L65 18 L85 35 L100 70 L20 70 L25 50 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 12 L48 28 L58 25 L65 18"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 45 L50 40 L65 45 L78 42"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M28 58 L48 54 L65 58 L82 55 L92 60"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    "cho-oyu": (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M55 15 L65 12 L75 15 L95 55 L105 70 L15 70 L25 55 L45 15 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 15 L58 28 L68 25 L65 12"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M38 45 L52 40 L62 45 L72 41 L85 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    makalu: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 8 L75 25 L85 28 L100 70 L20 70 L35 28 L45 25 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 8 L55 22 L65 20"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M42 42 L55 38 L65 42 L78 38"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M32 55 L50 50 L65 54 L80 50 L92 56"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    lhotse: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M55 10 L70 15 L85 40 L95 70 L25 70 L35 40 L50 15 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M55 10 L52 25 L62 22 L70 15"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M42 48 L55 42 L68 48 L80 44"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    kangchenjunga: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M25 22 L40 15 L55 20 L60 12 L65 20 L80 15 L95 22 L105 70 L15 70 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 15 L42 28 L52 25 L55 20"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M60 12 L58 28 L68 25 L65 20"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M80 15 L78 28 L88 25 L95 22"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 50 L45 45 L60 48 L75 45 L95 50"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    k2: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 5 L40 50 L30 55 L15 70 L105 70 L90 55 L80 50 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 5 L55 22 L65 18 L60 32"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M45 45 L55 40 L65 45 L75 40"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M32 58 L48 52 L60 56 L72 52 L88 58"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    everest: (
      <svg viewBox="0 0 120 80" className={className}>
        <path
          d="M60 5 L70 18 L85 25 L100 60 L110 70 L10 70 L20 60 L35 25 L50 18 Z"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 5 L55 18 L65 15"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M50 18 L48 30 L58 27 L70 18"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M35 25 L45 35 L55 32 L65 38 L75 32 L85 25"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M25 55 L45 48 L60 52 L75 48 L95 55"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  const defaultIllustration = (
    <svg viewBox="0 0 120 80" className={className}>
      <path
        d="M60 10 L30 60 L15 70 L105 70 L90 60 Z"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 10 L55 28 L65 25"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M40 50 L55 45 L70 50"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );

  return illustrations[mountainId] || defaultIllustration;
}

interface MountainSilhouetteProps {
  mountain: Mountain;
  progress: number; // 0-100
  isCompleted: boolean;
  isCurrent: boolean;
  onClick?: () => void;
}

export const MountainSilhouette = ({
  mountain,
  progress,
  isCompleted,
  isCurrent,
  onClick,
}: MountainSilhouetteProps) => {
  const getDifficultyColor = () => {
    switch (mountain.difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-orange-500";
      case "extreme":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col items-center p-4 pt-8 rounded-lg transition-all duration-300",
        isCurrent && "bg-primary/10 ring-2 ring-primary",
        isCompleted && "bg-green-500/10",
        onClick && "cursor-pointer hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold shadow-sm">
          ✓
        </div>
      )}
      {isCurrent && !isCompleted && (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] px-2 py-0.5 rounded font-semibold shadow-sm">
          AKTIVNÍ
        </div>
      )}

      <div className="text-center mb-2 w-full">
        <h3 className={cn("font-bold text-sm", isCurrent && "text-primary")}>
          {mountain.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {mountain.height}m • {mountain.country}
        </p>
        <p className={cn("text-xs font-semibold", getDifficultyColor())}>
          {mountain.pointsRequired} bodů
        </p>
      </div>

      <div className="relative w-full h-48 flex items-center justify-center">
        <MountainIllustration
          mountainId={mountain.id}
          className="w-full h-full max-w-32 max-h-20"
        />
      </div>

      <div className="w-full mt-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Pokrok</span>
          <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              isCompleted ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};



