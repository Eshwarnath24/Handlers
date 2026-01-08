import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Send, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>({});
  const [currentSection, setCurrentSection] = useState<"mcq" | "coding">("mcq");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!currentTestConfig) return;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    currentTestConfig.questions.mcq.forEach((q, i) => {
      if (mcqAnswers[i] === undefined) unanswered++;
      else if (mcqAnswers[i] === q.correctAnswer) correct++;
      else wrong++;
    });

    currentTestConfig.questions.coding.forEach((_, i) => {
      if (!codingAnswers[i]?.trim()) unanswered++;
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
  }, [mcqAnswers, codingAnswers, currentTestConfig, addTestAttempt, resetTabSwitch, navigate]);

  // AUTH GUARD
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    if (!currentTestConfig) navigate("/dashboard");
  }, [isAuthenticated, currentTestConfig, navigate]);

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit]);

  // AUTO SUBMIT ON 3 TAB SWITCHES
  useEffect(() => {
    if (tabSwitchCount >= 3) {
      toast({
        title: "Test auto-submitted",
        description: "Too many tab switches detected.",
        variant: "destructive",
      });
      handleSubmit();
    }
  }, [tabSwitchCount, handleSubmit, toast]);

  if (!currentTestConfig) return null;

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const MCQ = currentTestConfig.questions.mcq;
  const CODING = currentTestConfig.questions.coding;

  const answered =
    Object.keys(mcqAnswers).length +
    Object.values(codingAnswers).filter((a) => a.trim()).length;

  const total = MCQ.length + CODING.length;

  return (
    <SecurityWrapper enabled>
      <div className="min-h-screen bg-background">
        <header className="h-16 border-b flex justify-between items-center px-6">
          <div className="flex gap-3">
            <h1 className="font-semibold">{currentTestConfig.role}</h1>
            <Badge>{currentSection}</Badge>
          </div>
          <div className="flex gap-4 items-center">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-2 h-4 w-4" /> Submit
            </Button>
          </div>
        </header>

        <div className="px-6 py-2 border-b">
          <Progress value={(answered / total) * 100} />
        </div>

        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {currentSection === "mcq" &&
            MCQ.map((q, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Q{i + 1}. {q.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={mcqAnswers[i]?.toString()}
                    onValueChange={(v) =>
                      setMcqAnswers((p) => ({ ...p, [i]: Number(v) }))
                    }
                  >
                    {q.options.map((o, j) => (
                      <div key={j} className="flex gap-2">
                        <RadioGroupItem value={j.toString()} />
                        <Label>{o}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

          {currentSection === "coding" &&
            CODING.map((q, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>C{i + 1}. {q.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={codingAnswers[i] || ""}
                    onChange={(e) =>
                      setCodingAnswers((p) => ({ ...p, [i]: e.target.value }))
                    }
                    className="min-h-[200px] font-mono"
                  />
                </CardContent>
              </Card>
            ))}

          <div className="flex justify-between">
            <Button disabled={currentSection === "mcq"} onClick={() => setCurrentSection("mcq")}>
              <ChevronLeft className="mr-2 h-4 w-4" /> MCQ
            </Button>
            <Button disabled={currentSection === "coding"} onClick={() => setCurrentSection("coding")}>
              Coding <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>

        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Test?</AlertDialogTitle>
              <AlertDialogDescription>
                {answered}/{total} answered
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
      </div>
    </SecurityWrapper>
  );
}
