import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ChevronRight, Rocket } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Security Engineer',
  'Cloud Architect',
];

const TECH_STACK = [
  { name: 'JavaScript', icon: '🟨' },
  { name: 'TypeScript', icon: '🔷' },
  { name: 'React', icon: '⚛️' },
  { name: 'Vue.js', icon: '💚' },
  { name: 'Angular', icon: '🔴' },
  { name: 'Node.js', icon: '💚' },
  { name: 'Python', icon: '🐍' },
  { name: 'Java', icon: '☕' },
  { name: 'Go', icon: '🔵' },
  { name: 'Rust', icon: '🦀' },
  { name: 'SQL', icon: '🗃️' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Kubernetes', icon: '☸️' },
  { name: 'AWS', icon: '☁️' },
  { name: 'GraphQL', icon: '◈' },
];

interface StartPrepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartPrepModal({ open, onOpenChange }: StartPrepModalProps) {
  const navigate = useNavigate();
  const { setCurrentTestConfig } = useApp();
  const [step, setStep] = useState(1);
  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const filteredRoles = ROLES.filter(role =>
    role.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handleTechToggle = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleStartTest = () => {
    setCurrentTestConfig({ role: selectedRole, techStack: selectedTech });
    onOpenChange(false);
    navigate('/test');
  };

  const resetAndClose = () => {
    setStep(1);
    setRoleSearch('');
    setSelectedRole('');
    setSelectedTech([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] glass-panel-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {step === 1 ? 'Select Your Target Role' : 'Choose Your Tech Stack'}
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
                  onClick={() => setSelectedRole(role)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between ${
                    selectedRole === role
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
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
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                      : 'bg-secondary hover:bg-secondary/80'
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
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
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
