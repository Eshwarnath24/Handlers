import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Target, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TestHistoryCard } from "@/components/TestHistoryCard";
import { StartPrepModal } from "@/components/StartPrepModal";
import UserProfileModal from "@/components/UserProfileModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, testAttempts, setUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate("/auth");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-4 py-3 flex items-center justify-between bg-white/60 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="md:ml-16 text-xl font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileModalOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {testAttempts.length === 0 ? (
            /* Empty State */
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center shadow-glow">
                  <Target className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Ready to Start Your Interview Prep?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Take your first practice test to identify strengths and areas
                  for improvement.
                </p>
                <Button
                  size="lg"
                  className="gradient-bg shadow-glow hover:shadow-glow-lg transition-shadow"
                  onClick={() => setShowModal(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Interview Prep
                </Button>
              </div>
            </div>
          ) : (
            /* Test History Grid */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Test History
                </h2>
                <Button
                  className="gradient-bg"
                  onClick={() => setShowModal(true)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  New Test
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {testAttempts.map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TestHistoryCard {...attempt} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <StartPrepModal open={showModal} onOpenChange={setShowModal} />
      <UserProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </div>
  );
}
