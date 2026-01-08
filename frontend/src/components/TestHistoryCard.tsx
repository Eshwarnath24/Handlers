import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HollowPieChart } from './HollowPieChart';

interface TestHistoryCardProps {
  id: string;
  date: string;
  role: string;
  techStack: string[];
  correct: number;
  wrong: number;
  unanswered: number;
  strengths: string[];
  weaknesses: string[];
}

export function TestHistoryCard({
  id,
  date,
  role,
  techStack,
  correct,
  wrong,
  unanswered,
  strengths,
  weaknesses,
}: TestHistoryCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="glass-panel hover-lift group">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart */}
          <div className="flex justify-center lg:justify-start">
            <HollowPieChart 
              correct={correct} 
              wrong={wrong} 
              unanswered={unanswered}
              size={100}
              strokeWidth={14}
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>

            <h3 className="font-semibold text-foreground">{role}</h3>

            <div className="flex flex-wrap gap-1">
              {techStack.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {techStack.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{techStack.length - 3}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Strengths</p>
                <div className="space-y-1">
                  {strengths.slice(0, 2).map((s) => (
                    <p key={s} className="text-xs text-success flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-success" />
                      {s}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Weaknesses</p>
                <div className="space-y-1">
                  {weaknesses.slice(0, 2).map((w) => (
                    <p key={w} className="text-xs text-destructive flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-destructive" />
                      {w}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="ml-auto text-primary hover:text-primary/90 hover:bg-primary/10 group-hover:translate-x-1 transition-all"
          onClick={() => navigate(`/report/${id}`)}
        >
          More Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
