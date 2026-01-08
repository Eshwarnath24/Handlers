import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  History, 
  ChevronRight, 
  RotateCcw,
  Target,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { StartPrepModal } from './StartPrepModal';

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { testAttempts } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasAttempts = testAttempts.length > 0;

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <Button 
          onClick={() => setShowModal(true)} 
          className="w-full gradient-bg shadow-glow hover:shadow-glow-lg transition-shadow"
        >
          <Play className="mr-2 h-4 w-4" />
          Start New Interview Prep
        </Button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <History className="h-4 w-4" />
          Test History
        </h3>

        {!hasAttempts ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tests yet</p>
            <p className="text-xs mt-1">Start your first interview prep!</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-2">
              {testAttempts.slice(0, 10).map((attempt) => (
                <button
                  key={attempt.id}
                  className="w-full p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left group"
                  onClick={() => navigate(`/report/${attempt.id}`)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate pr-2">
                      {attempt.role}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(attempt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {' · '}
                    {attempt.correct}/{attempt.correct + attempt.wrong + attempt.unanswered} correct
                  </p>
                  <div className="flex gap-1 mt-2">
                    <button
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/test');
                      }}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retest
                    </button>
                    {attempt.weakLanguages.length > 0 && (
                      <button
                        className="text-xs text-warning hover:underline flex items-center gap-1 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/practice/${attempt.weakLanguages[0].language.toLowerCase()}`);
                        }}
                      >
                        <Target className="h-3 w-3" />
                        Practice
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <StartPrepModal open={showModal} onOpenChange={setShowModal} />
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-sidebar border-r border-sidebar-border
          transform transition-transform duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
