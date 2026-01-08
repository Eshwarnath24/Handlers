import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Lightbulb, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { SecurityWrapper } from '@/components/SecurityWrapper';
import { useToast } from '@/hooks/use-toast';

// Practice questions by language
const PRACTICE_QUESTIONS: Record<string, Array<{
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string;
  hint: string;
}>> = {
  javascript: [
    { id: 1, question: 'What is the output of typeof null?', options: ['null', 'undefined', 'object', 'number'], correct: 2, topic: 'Fundamentals', hint: 'This is a well-known JavaScript quirk from the early days.' },
    { id: 2, question: 'Which method removes the last element from an array?', options: ['pop()', 'push()', 'shift()', 'unshift()'], correct: 0, topic: 'Arrays', hint: 'Think about LIFO operations.' },
    { id: 3, question: 'What does the spread operator (...) do?', options: ['Copies all properties', 'Deletes properties', 'Modifies properties', 'Creates a reference'], correct: 0, topic: 'ES6', hint: 'It expands or spreads elements.' },
  ],
  react: [
    { id: 1, question: 'What is the Virtual DOM?', options: ['A copy of the real DOM', 'A browser API', 'A CSS framework', 'A database'], correct: 0, topic: 'Core Concepts', hint: 'React uses this to optimize updates.' },
    { id: 2, question: 'When does useEffect run?', options: ['Before render', 'After render', 'During render', 'Never'], correct: 1, topic: 'Hooks', hint: 'Think about side effects timing.' },
  ],
  algorithms: [
    { id: 1, question: 'What is Big O notation used for?', options: ['Describing algorithm efficiency', 'Writing code', 'Testing', 'Deployment'], correct: 0, topic: 'Complexity', hint: 'It describes growth rate.' },
    { id: 2, question: 'Which is the most efficient sorting for nearly sorted data?', options: ['Quick Sort', 'Insertion Sort', 'Bubble Sort', 'Selection Sort'], correct: 1, topic: 'Sorting', hint: 'Works well when elements are close to their final position.' },
  ],
};

export default function Practice() {
  const { language } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, testAttempts } = useApp();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [startTime] = useState(Date.now());

  const normalizedLang = language?.toLowerCase() || '';
  const questions = PRACTICE_QUESTIONS[normalizedLang] || PRACTICE_QUESTIONS.javascript;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (testAttempts.length === 0) {
      toast({
        title: 'Complete a test first',
        description: 'You need to complete at least one test to access practice mode.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, testAttempts, navigate, toast]);

  // Track time spent on each question
  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionTimes(prev => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);

  // Show hint after 30 seconds on a question
  useEffect(() => {
    const time = questionTimes[currentQuestion] || 0;
    if (time >= 30 && showHint !== currentQuestion) {
      setShowHint(currentQuestion);
    }
  }, [questionTimes, currentQuestion, showHint]);

  const handleSubmit = useCallback(() => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });

    toast({
      title: 'Practice Complete!',
      description: `You got ${correct}/${questions.length} correct.`,
    });

    navigate('/dashboard');
  }, [answers, questions, navigate, toast]);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <SecurityWrapper enabled>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-foreground capitalize">{normalizedLang} Practice</h1>
            <Badge variant="secondary">Practice Mode</Badge>
          </div>

          <Button 
            className="gradient-bg"
            onClick={() => setShowSubmitDialog(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Finish
          </Button>
        </header>

        {/* Progress */}
        <div className="px-6 py-2 border-b border-border bg-card/30">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1}/{questions.length}
            </span>
            <Progress value={progress} className="flex-1 h-2" />
          </div>
        </div>

        {/* Content */}
        <main className="max-w-2xl mx-auto p-6">
          {currentQ && (
            <Card className="glass-panel-elevated animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    <span className="text-muted-foreground mr-2">Q{currentQuestion + 1}.</span>
                    {currentQ.question}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">{currentQ.topic}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  key={currentQ.id}
                  value={answers[currentQ.id]?.toString()}
                  onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQ.id]: parseInt(value) }))}
                >
                  {currentQ.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value={i.toString()} id={`q${currentQ.id}-${i}`} />
                      <Label htmlFor={`q${currentQ.id}-${i}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Hint */}
                {showHint === currentQuestion && (
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Lightbulb className="h-4 w-4" />
                      <span className="text-sm font-medium">Hint</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{currentQ.hint}</p>
                  </div>
                )}

                {/* Time on question */}
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Time on question: {questionTimes[currentQuestion] || 0}s</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    i === currentQuestion
                      ? 'gradient-bg text-primary-foreground'
                      : answers[questions[i].id] !== undefined
                      ? 'bg-success/20 text-success'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </main>

        {/* Submit Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finish Practice?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} of {questions.length} questions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Practice</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} className="gradient-bg">
                Finish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SecurityWrapper>
  );
}
