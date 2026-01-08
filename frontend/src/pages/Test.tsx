import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

// Sample questions
const MCQ_QUESTIONS = [
  { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, topic: 'Algorithms' },
  { id: 2, question: 'Which hook is used for side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct: 1, topic: 'React' },
  { id: 3, question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'], correct: 0, topic: 'Databases' },
  { id: 4, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correct: 1, topic: 'Data Structures' },
  { id: 5, question: 'What is the purpose of Git rebase?', options: ['Merge branches', 'Rewrite commit history', 'Create tags', 'Clone repository'], correct: 1, topic: 'Git' },
  { id: 6, question: 'Which HTTP method is idempotent?', options: ['POST', 'GET', 'PATCH', 'DELETE'], correct: 1, topic: 'APIs' },
  { id: 7, question: 'What is closure in JavaScript?', options: ['A function with access to outer scope', 'A class method', 'An async function', 'A generator'], correct: 0, topic: 'JavaScript' },
  { id: 8, question: 'What is the default port for HTTPS?', options: ['80', '443', '8080', '3000'], correct: 1, topic: 'Networking' },
  { id: 9, question: 'Which sorting algorithm is stable?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], correct: 2, topic: 'Algorithms' },
  { id: 10, question: 'What is Docker used for?', options: ['Version control', 'Containerization', 'Testing', 'Deployment'], correct: 1, topic: 'DevOps' },
];

const CODING_QUESTIONS = [
  { id: 101, question: 'Write a function to reverse a string.', topic: 'JavaScript' },
  { id: 102, question: 'Implement a function to check if a number is prime.', topic: 'Algorithms' },
  { id: 103, question: 'Write a SQL query to find the second highest salary.', topic: 'SQL' },
];

export default function Test() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, currentTestConfig, addTestAttempt, tabSwitchCount, resetTabSwitch } = useApp();

  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>({});
  const [currentSection, setCurrentSection] = useState<'mcq' | 'coding'>('mcq');
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!currentTestConfig) {
      toast({
        title: 'No test configuration',
        description: 'Please start a test from the dashboard.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentTestConfig, navigate, toast]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Tab switch warning
  useEffect(() => {
    if (tabSwitchCount >= 3) {
      handleSubmit();
      toast({
        title: 'Test auto-submitted',
        description: 'Too many tab switches detected.',
        variant: 'destructive',
      });
    } else if (tabSwitchCount > 0) {
      setShowWarningDialog(true);
    }
  }, [tabSwitchCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = useCallback(() => {
    // Calculate results
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    const topicResults: Record<string, { correct: number; total: number }> = {};

    MCQ_QUESTIONS.forEach(q => {
      if (!topicResults[q.topic]) {
        topicResults[q.topic] = { correct: 0, total: 0 };
      }
      topicResults[q.topic].total++;

      if (mcqAnswers[q.id] === undefined) {
        unanswered++;
      } else if (mcqAnswers[q.id] === q.correct) {
        correct++;
        topicResults[q.topic].correct++;
      } else {
        wrong++;
      }
    });

    // Add coding questions as unanswered if empty
    CODING_QUESTIONS.forEach(q => {
      if (!codingAnswers[q.id] || codingAnswers[q.id].trim() === '') {
        unanswered++;
      }
    });

    // Determine strengths and weaknesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const weakLanguages: { language: string; topics: string[] }[] = [];

    Object.entries(topicResults).forEach(([topic, { correct, total }]) => {
      const percentage = (correct / total) * 100;
      if (percentage >= 70) {
        strengths.push(topic);
      } else {
        weaknesses.push(topic);
        weakLanguages.push({
          language: topic,
          topics: [`${topic} fundamentals`, `${topic} best practices`, `${topic} advanced concepts`],
        });
      }
    });

    const attempt = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      role: currentTestConfig?.role || 'Developer',
      techStack: currentTestConfig?.techStack || [],
      correct,
      wrong,
      unanswered,
      totalQuestions: MCQ_QUESTIONS.length + CODING_QUESTIONS.length,
      strengths: strengths.length > 0 ? strengths : ['General knowledge'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Keep practicing'],
      weakLanguages,
    };

    addTestAttempt(attempt);
    resetTabSwitch();
    navigate(`/report/${attempt.id}`);
  }, [mcqAnswers, codingAnswers, currentTestConfig, addTestAttempt, resetTabSwitch, navigate]);

  const answeredCount = Object.keys(mcqAnswers).length + Object.values(codingAnswers).filter(a => a.trim()).length;
  const totalQuestions = MCQ_QUESTIONS.length + CODING_QUESTIONS.length;
  const progress = (answeredCount / totalQuestions) * 100;

  if (!currentTestConfig) return null;

  return (
    <SecurityWrapper enabled>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-foreground">{currentTestConfig.role}</h1>
            <Badge variant="secondary">{currentSection === 'mcq' ? 'MCQ' : 'Coding'}</Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-secondary'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </div>

            <Button 
              className="gradient-bg"
              onClick={() => setShowSubmitDialog(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </div>
        </header>

        {/* Progress */}
        <div className="px-6 py-2 border-b border-border bg-card/30">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {answeredCount}/{totalQuestions} answered
            </span>
            <Progress value={progress} className="flex-1 h-2" />
          </div>
        </div>

        {/* Content */}
        <main className="max-w-4xl mx-auto p-6">
          {/* Section Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={currentSection === 'mcq' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('mcq')}
            >
              MCQ ({Object.keys(mcqAnswers).length}/{MCQ_QUESTIONS.length})
            </Button>
            <Button
              variant={currentSection === 'coding' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('coding')}
            >
              Coding ({Object.values(codingAnswers).filter(a => a.trim()).length}/{CODING_QUESTIONS.length})
            </Button>
          </div>

          {/* MCQ Section */}
          {currentSection === 'mcq' && (
            <div className="space-y-6">
              {MCQ_QUESTIONS.map((q, index) => (
                <Card key={q.id} className="glass-panel animate-fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
                        {q.question}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">{q.topic}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={mcqAnswers[q.id]?.toString()}
                      onValueChange={(value) => setMcqAnswers(prev => ({ ...prev, [q.id]: parseInt(value) }))}
                    >
                      {q.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                          <RadioGroupItem value={i.toString()} id={`q${q.id}-${i}`} />
                          <Label htmlFor={`q${q.id}-${i}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Coding Section */}
          {currentSection === 'coding' && (
            <div className="space-y-6">
              {CODING_QUESTIONS.map((q, index) => (
                <Card key={q.id} className="glass-panel animate-fade-in">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        <span className="text-muted-foreground mr-2">C{index + 1}.</span>
                        {q.question}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">{q.topic}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your code here..."
                      className="font-mono min-h-[200px] resize-y"
                      value={codingAnswers[q.id] || ''}
                      onChange={(e) => setCodingAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentSection('mcq')}
              disabled={currentSection === 'mcq'}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              MCQ Section
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentSection('coding')}
              disabled={currentSection === 'coding'}
            >
              Coding Section
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>

        {/* Submit Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Test?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {answeredCount} of {totalQuestions} questions.
                {answeredCount < totalQuestions && (
                  <span className="block mt-2 text-warning">
                    Warning: {totalQuestions - answeredCount} questions are unanswered.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Test</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} className="gradient-bg">
                Submit Test
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Tab Switch Warning Dialog */}
        <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Tab Switch Detected
              </AlertDialogTitle>
              <AlertDialogDescription>
                Warning {tabSwitchCount}/3: Switching tabs during the test is not allowed.
                Your test will be auto-submitted after 3 warnings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>I Understand</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SecurityWrapper>
  );
}
