import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Shield, BarChart3, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-bg">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl gradient-text">TrueMetric</span>
          </div>
            <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="default" onClick={() => navigate('/auth?slide=signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm">AI-Powered Learning Integrity</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Prepare for Interviews with{" "}
            <span className="gradient-text">Confidence</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            TrueMetric ensures fair assessment through advanced proctoring while helping you identify and improve your weak areas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/auth?slide=signup')}
            >
              Start Your Prep <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="p-3 rounded-xl gradient-bg w-fit mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity Protection</h3>
              <p className="text-muted-foreground">
                Advanced anti-cheat mechanisms ensure fair assessments for everyone.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="p-3 rounded-xl gradient-bg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skill Analysis</h3>
              <p className="text-muted-foreground">
                Get detailed reports on your strengths and areas for improvement.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <div className="p-3 rounded-xl gradient-bg w-fit mb-4">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Targeted Practice</h3>
              <p className="text-muted-foreground">
                Practice mode focuses on your weak topics with helpful hints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2026 TrueMetric. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
