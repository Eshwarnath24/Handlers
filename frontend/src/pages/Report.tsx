import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, BookOpen, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HollowPieChart } from '@/components/HollowPieChart';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Report() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { testAttempts, isAuthenticated } = useApp();
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const attempt = testAttempts.find(a => a.id === attemptId);

  // Generate sample questions if not present
  const questions = attempt?.questions || Array.from({ length: 33 }, (_, i) => ({
    id: i + 1,
    question: `Sample ${i < 25 ? 'MCQ' : 'Coding'} Question ${i + 1}: What is the correct approach for...?`,
    options: [
      'Option A - First choice',
      'Option B - Second choice', 
      'Option C - Third choice',
      'Option D - Fourth choice'
    ],
    correctAnswer: 3,
    userAnswer: i < 18 ? 3 : i < 23 ? 0 : undefined,
    status: i < 18 ? 'correct' : i < 23 ? 'wrong' : 'left',
    category: i < 25 ? 'MCQ' : 'Coding'
  }));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (!attempt) {
      toast({
        title: 'Report not found',
        description: 'Redirecting to dashboard...',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, attempt, navigate, toast]);

  if (!attempt) return null;

  const total = attempt.correct + attempt.wrong + attempt.unanswered;
  const percentage = Math.round((attempt.correct / total) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <ThemeToggle />
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Title */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Test Report</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{attempt.role}</span>
            <span>•</span>
            <span>{new Date(attempt.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {attempt.techStack.map(tech => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Score Card */}
        <Card className="glass-panel-elevated animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <HollowPieChart
                correct={attempt.correct}
                wrong={attempt.wrong}
                unanswered={attempt.unanswered}
                size={180}
                strokeWidth={24}
              />

              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-success">{attempt.correct}</p>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-destructive">{attempt.wrong}</p>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <MinusCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-bold text-muted-foreground">{attempt.unanswered}</p>
                  <p className="text-xs text-muted-foreground">Unanswered</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-secondary/50 text-center">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-4xl font-bold gradient-text">{percentage}%</p>
            </div>

            {/* Preview Questions Button */}
            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full gradient-bg">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Questions
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl h-[85vh] p-0 sm:max-w-[95vw] sm:h-[90vh]">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Question Preview</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col sm:flex-row h-full gap-4 overflow-hidden p-6 pt-0">
                    {/* Question Timeline */}
                    <div className="w-full sm:w-48 max-h-32 sm:max-h-none overflow-y-auto pr-2 sm:border-r border-b sm:border-b-0">
                      <div className="flex sm:flex-col gap-1 sm:space-y-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
                        {questions.map((q, index) => (
                          <button
                            key={q.id}
                            onClick={() => setSelectedQuestion(index)}
                            className={cn(
                              "flex-shrink-0 sm:w-full p-2 sm:p-3 rounded-lg text-left text-xs sm:text-sm transition-colors",
                              "border border-border hover:bg-accent min-w-[80px] sm:min-w-0",
                              selectedQuestion === index && "bg-accent",
                              q.status === 'correct' && "border-l-4 border-l-success bg-success/5",
                              q.status === 'wrong' && "border-l-4 border-l-destructive bg-destructive/5",
                              q.status === 'left' && "border-l-4 border-l-muted-foreground bg-muted/50"
                            )}
                          >
                            <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                              <span className="font-medium text-center sm:text-left">Q{q.id}</span>
                              <span className={cn(
                                "px-1 sm:px-2 py-1 rounded text-xs font-medium mt-1 sm:mt-0",
                                q.status === 'correct' && "bg-success/10 text-success",
                                q.status === 'wrong' && "bg-destructive/10 text-destructive",
                                q.status === 'left' && "bg-muted text-muted-foreground"
                              )}>
                                {q.status === 'correct' && '✓'}
                                {q.status === 'wrong' && '✗'}
                                {q.status === 'left' && '—'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto">
                      {questions[selectedQuestion] && (
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant={questions[selectedQuestion].status === 'correct' ? 'default' : 'destructive'}
                              className={cn(
                                questions[selectedQuestion].status === 'correct' && "bg-success/10 text-success border-success",
                                questions[selectedQuestion].status === 'wrong' && "bg-destructive/10 text-destructive border-destructive",
                                questions[selectedQuestion].status === 'left' && "bg-muted text-muted-foreground border-muted-foreground"
                              )}
                            >
                              {questions[selectedQuestion].status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{questions[selectedQuestion].category}</Badge>
                          </div>

                          <h3 className="text-base sm:text-lg font-medium leading-relaxed">
                            {questions[selectedQuestion].question}
                          </h3>

                          <div className="space-y-2 sm:space-y-3">
                            {questions[selectedQuestion].options.map((option, index) => {
                              const isCorrect = index === questions[selectedQuestion].correctAnswer;
                              const isUserAnswer = index === questions[selectedQuestion].userAnswer;
                              const isWrongAnswer = isUserAnswer && !isCorrect;
                              
                              return (
                                <div
                                  key={index}
                                  className={cn(
                                    "p-3 sm:p-4 rounded-lg border transition-colors",
                                    "bg-muted/50 border-border",
                                    isCorrect && "bg-success/10 border-success",
                                    isWrongAnswer && "bg-destructive/10 border-destructive"
                                  )}
                                >
                                  <div className="flex items-start sm:items-center justify-between gap-2">
                                    <span className="text-sm flex-1">{option}</span>
                                    <div className="flex gap-2 flex-shrink-0">
                                      {isCorrect && (
                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                      )}
                                      {isWrongAnswer && (
                                        <XCircle className="h-4 w-4 text-destructive" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {questions[selectedQuestion].status === 'left' && (
                            <div className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-dashed border-muted-foreground">
                              <p className="text-sm text-muted-foreground text-center">
                                This question was not attempted
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {attempt.strengths.map((strength, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-panel animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {attempt.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Practice Recommendations */}
        {attempt.weakLanguages.length > 0 && (
          <Card className="glass-panel-elevated animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Practice Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attempt.weakLanguages.map((lang, i) => (
                  <div 
                    key={lang.language} 
                    className="p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground">{lang.language}</h4>
                      <Button
                        size="sm"
                        className="gradient-bg"
                        onClick={() => navigate(`/practice/${lang.language.toLowerCase()}`)}
                      >
                        <Target className="mr-2 h-4 w-4" />
                        Practice
                      </Button>
                    </div>
                    <ul className="space-y-1">
                      {lang.topics.map((topic, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button className="gradient-bg" onClick={() => navigate('/test')}>
            Take Another Test
          </Button>
        </div>
      </main>
    </div>
  );
}
