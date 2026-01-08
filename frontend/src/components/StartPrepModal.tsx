import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Check, ChevronRight, Rocket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Security Engineer",
  "Cloud Architect",
];

const ROLE_TECH_MAP: Record<string, { name: string; icon: string }[]> = {
  "Frontend Developer": [
    { name: "HTML", icon: "📄" },
    { name: "CSS", icon: "🎨" },
    { name: "JavaScript", icon: "🟨" },
    { name: "TypeScript", icon: "🔷" },
    { name: "React", icon: "⚛️" },
    { name: "Vue.js", icon: "💚" },
    { name: "Angular", icon: "🔴" },
    { name: "Tailwind", icon: "🌬️" },
  ],
  "Backend Developer": [
    { name: "Node.js", icon: "💚" },
    { name: "Express", icon: "📦" },
    { name: "Python", icon: "🐍" },
    { name: "Django", icon: "🌿" },
    { name: "Java", icon: "☕" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Redis", icon: "🔥" },
  ],
  "Full Stack Developer": [
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "💚" },
    { name: "Express", icon: "📦" },
    { name: "TypeScript", icon: "🔷" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Docker", icon: "🐳" },
    { name: "GraphQL", icon: "🔺" },
  ],
  "DevOps Engineer": [
    { name: "Docker", icon: "🐳" },
    { name: "Kubernetes", icon: "☸️" },
    { name: "AWS", icon: "☁️" },
    { name: "CI/CD", icon: "🔁" },
    { name: "Terraform", icon: "📐" },
    { name: "Linux", icon: "🐧" },
    { name: "GitHub Actions", icon: "⚙️" },
  ],
  "Data Scientist": [
    { name: "Python", icon: "🐍" },
    { name: "Pandas", icon: "📊" },
    { name: "NumPy", icon: "➗" },
    { name: "Jupyter", icon: "📓" },
    { name: "Scikit-Learn", icon: "🧠" },
    { name: "SQL", icon: "🗃️" },
  ],
  "Machine Learning Engineer": [
    { name: "Python", icon: "🐍" },
    { name: "TensorFlow", icon: "🔶" },
    { name: "PyTorch", icon: "🔥" },
    { name: "MLflow", icon: "🚀" },
    { name: "AWS Sagemaker", icon: "☁️" },
    { name: "FastAPI", icon: "⚡" },
  ],
  "Mobile Developer": [
    { name: "Flutter", icon: "💙" },
    { name: "React Native", icon: "📱" },
    { name: "Kotlin", icon: "🟣" },
    { name: "Swift", icon: "🟠" },
  ],
  "QA Engineer": [
    { name: "Selenium", icon: "🧪" },
    { name: "Cypress", icon: "🌲" },
    { name: "Jest", icon: "🃏" },
    { name: "Playwright", icon: "🎭" },
    { name: "Postman", icon: "📮" },
  ],
  "Security Engineer": [
    { name: "Linux", icon: "🐧" },
    { name: "Burp Suite", icon: "🕷️" },
    { name: "Metasploit", icon: "💣" },
    { name: "OWASP", icon: "🛡️" },
    { name: "Python", icon: "🐍" },
  ],
  "Cloud Architect": [
    { name: "AWS", icon: "☁️" },
    { name: "Azure", icon: "🔷" },
    { name: "GCP", icon: "🌎" },
    { name: "Terraform", icon: "📐" },
    { name: "Kubernetes", icon: "☸️" },
    { name: "Docker", icon: "🐳" },
  ],
};

interface StartPrepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartPrepModal({ open, onOpenChange }: StartPrepModalProps) {
  const navigate = useNavigate();
  const { setCurrentTestConfig } = useApp();
  const [step, setStep] = useState(1);
  const [roleSearch, setRoleSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const filteredRoles = ROLES.filter((role) =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handleTechToggle = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleStartTest = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          level: "Junior",
          languages: selectedTech,
        }),
      });

      if (!res.ok) throw new Error("API failed");
      const quiz = await res.json();

      setCurrentTestConfig({
        role: selectedRole,
        techStack: selectedTech,
        questions: quiz,
      });

      onOpenChange(false);
      navigate("/test");
    } catch (err) {
      console.error("START TEST ERROR:", err);
      alert("Failed to generate test");
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setRoleSearch("");
    setSelectedRole("");
    setSelectedTech([]);
    onOpenChange(false);
  };

  const TECH_STACK = ROLE_TECH_MAP[selectedRole] || [];

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] glass-panel-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 ? "Select Your Target Role" : "Choose Your Tech Stack"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles..."
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setSelectedTech([]);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between ${
                    selectedRole === role
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <span>{role}</span>
                  {selectedRole === role && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedRole}
              className="w-full gradient-bg"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select at least 3 technologies (selected: {selectedTech.length})
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {TECH_STACK.map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => handleTechToggle(name)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-2 ${
                    selectedTech.includes(name)
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium">{name}</span>
                  {selectedTech.includes(name) && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {selectedTech.map((tech) => (
                <Badge key={tech} variant="default" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleStartTest}
                disabled={selectedTech.length < 3}
                className="flex-1 gradient-bg"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Start Test
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}