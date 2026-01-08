import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApp } from "@/contexts/AppContext";
import { SecurityWrapper } from "@/components/SecurityWrapper";
import { useToast } from "@/hooks/use-toast";

export default function Test() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAuthenticated,
    currentTestConfig,
    addTestAttempt,
    tabSwitchCount,
    resetTabSwitch,
  } = useApp();

  // ✅ ALL HOOKS FIRST
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>(
    {}
  );
  const [currentSection, setCurrentSection] = useState<"mcq" | "coding">("mcq");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!currentTestConfig) return;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    currentTestConfig.questions.mcq.forEach((q, index) => {
      if (mcqAnswers[index] === undefined) unanswered++;
      else if (mcqAnswers[index] === q.correctAnswer) correct++;
      else wrong++;
    });

    currentTestConfig.questions.coding.forEach((_, index) => {
      if (!codingAnswers[index]?.trim()) unanswered++;
    });

    addTestAttempt({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      role: currentTestConfig.role,
      techStack: currentTestConfig.techStack,
      correct,
      wrong,
      unanswered,
      totalQuestions:
        currentTestConfig.questions.mcq.length +
        currentTestConfig.questions.coding.length,
      strengths: [],
      weaknesses: [],
      weakLanguages: [],
    });

    resetTabSwitch();
    navigate("/dashboard");
  }, [
    mcqAnswers,
    codingAnswers,
    currentTestConfig,
    addTestAttempt,
    resetTabSwitch,
    navigate,
  ]);

  // ✅ AUTH / CONFIG GUARD
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (!currentTestConfig) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, currentTestConfig, navigate]);

  // ✅ TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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

  // ✅ TAB SWITCH HANDLING
  useEffect(() => {
    if (tabSwitchCount >= 3) {
      handleSubmit();
      toast({
        title: "Test auto-submitted",
        description: "Too many tab switches detected.",
        variant: "destructive",
      });
    } else if (tabSwitchCount > 0) {
      setShowWarningDialog(true);
    }
  }, [tabSwitchCount]);

  if (!currentTestConfig) return null;

  const MCQ_QUESTIONS = currentTestConfig.questions.mcq;
  const CODING_QUESTIONS = currentTestConfig.questions.coding;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const answeredCount =
    Object.keys(mcqAnswers).length +
    Object.values(codingAnswers).filter((a) => a.trim()).length;

  const totalQuestions = MCQ_QUESTIONS.length + CODING_QUESTIONS.length;

  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <SecurityWrapper enabled>
      <div className="min-h-screen bg-background">
        {/* HEADER */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">{currentTestConfig.role}</h1>
            <Badge>{currentSection === "mcq" ? "MCQ" : "Coding"}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </div>
        </header>

        {/* PROGRESS */}
        <div className="px-6 py-2 border-b">
          <Progress value={progress} />
        </div>

        {/* CONTENT */}
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {currentSection === "mcq" &&
            MCQ_QUESTIONS.map((q, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    Q{index + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={mcqAnswers[index]?.toString()}
                    onValueChange={(v) =>
                      setMcqAnswers((p) => ({
                        ...p,
                        [index]: Number(v),
                      }))
                    }
                  >
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <RadioGroupItem value={i.toString()} />
                        <Label>{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

          {currentSection === "coding" &&
            CODING_QUESTIONS.map((q, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    C{index + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={codingAnswers[index] || ""}
                    onChange={(e) =>
                      setCodingAnswers((p) => ({
                        ...p,
                        [index]: e.target.value,
                      }))
                    }
                    className="min-h-[200px] font-mono"
                  />
                </CardContent>
              </Card>
            ))}

          <div className="flex justify-between">
            <Button
              disabled={currentSection === "mcq"}
              onClick={() => setCurrentSection("mcq")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              MCQ
            </Button>
            <Button
              disabled={currentSection === "coding"}
              onClick={() => setCurrentSection("coding")}
            >
              Coding
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>

        {/* SUBMIT DIALOG */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Test?</AlertDialogTitle>
              <AlertDialogDescription>
                {answeredCount}/{totalQuestions} answered
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* TAB WARNING */}
        <AlertDialog
          open={showWarningDialog}
          onOpenChange={setShowWarningDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Tab Switch Warning
              </AlertDialogTitle>
              <AlertDialogDescription>
                Warning {tabSwitchCount}/3
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SecurityWrapper>
  );
}
