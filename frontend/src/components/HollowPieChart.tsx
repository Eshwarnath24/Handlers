import { useMemo } from 'react';

interface HollowPieChartProps {
  correct: number;
  wrong: number;
  unanswered: number;
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
}

export function HollowPieChart({ 
  correct, 
  wrong, 
  unanswered, 
  size = 120, 
  strokeWidth = 20,
  showLabels = true 
}: HollowPieChartProps) {
  const total = correct + wrong + unanswered;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segments = useMemo(() => {
    if (total === 0) return [];

    const correctPct = (correct / total) * 100;
    const wrongPct = (wrong / total) * 100;
    const unansweredPct = (unanswered / total) * 100;

    let offset = 0;
    const segs = [];

    if (correct > 0) {
      segs.push({
        color: 'hsl(var(--chart-correct))',
        percentage: correctPct,
        offset,
        label: 'Correct',
        value: correct,
      });
      offset += correctPct;
    }

    if (wrong > 0) {
      segs.push({
        color: 'hsl(var(--chart-wrong))',
        percentage: wrongPct,
        offset,
        label: 'Wrong',
        value: wrong,
      });
      offset += wrongPct;
    }

    if (unanswered > 0) {
      segs.push({
        color: 'hsl(var(--chart-unanswered))',
        percentage: unansweredPct,
        offset,
        label: 'Unanswered',
        value: unanswered,
      });
    }

    return segs;
  }, [correct, wrong, unanswered, total]);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
        </svg>
        <span className="text-sm text-muted-foreground">No data</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {segments.map((segment, index) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((segment.offset / 100) * circumference);

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-foreground">{total}</span>
        </div>
      </div>

      {showLabels && (
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-correct" />
            <span className="text-muted-foreground">{correct}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-wrong" />
            <span className="text-muted-foreground">{wrong}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-chart-unanswered" />
            <span className="text-muted-foreground">{unanswered}</span>
          </div>
        </div>
      )}
    </div>
  );
}
