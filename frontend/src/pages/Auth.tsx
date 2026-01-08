import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUser } = useApp();

  const params = new URLSearchParams(location.search);
  const initialBackView =
    params.get("slide") === "forgot" ? "forgot" : "signup";
  const initialIsFlipped =
    params.get("slide") === "signup" ||
    (location.state && (location.state as { openSignup?: boolean }).openSignup)
      ? true
      : false;

  const [isFlipped, setIsFlipped] = useState(initialIsFlipped);
  const [backView, setBackView] = useState<"signup" | "forgot">(
    initialBackView
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  /* ======================
     BACKEND REMOVED ONLY
     ====================== */

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    setUser({
      id: crypto.randomUUID(),
      name: signInEmail.split("@")[0],
      email: signInEmail,
    });

    toast({
      title: "Welcome back!",
      description: "Signed in successfully.",
    });

    setIsLoading(false);
    navigate("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    toast({
      title: "Account created!",
      description: "You can now sign in.",
    });

    setIsLoading(false);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Book Container */}
      <div className="book-container w-full max-w-4xl">
        <div
          className={`book-page relative w-full min-h-[600px] ${
            isFlipped ? "flipped" : ""
          }`}
        >
          {/* Front Side - Sign In */}
          <div className="book-face absolute inset-0 grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
            {/* Left - Form */}
            <div className="glass-panel-elevated p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-3xl font-bold gradient-text mb-2">
                  TrueMetric
                </h1>
                <p className="text-muted-foreground">
                  Sign in to continue your prep
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setBackView("forgot");
                      setIsFlipped(true);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </p>

                <Button
                  type="submit"
                  className="w-full gradient-bg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setBackView("signup");
                    setIsFlipped(true);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </button>
              </p>
            </div>

            {/* Right - Illustration */}
            <div className="hidden md:flex gradient-bg items-center justify-center p-12">
              <div className="text-center text-primary-foreground">
                <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse-slow" />
                <h2 className="text-2xl font-bold mb-4">
                  Ace Your Interviews
                </h2>
                <p className="opacity-90 max-w-xs">
                  Practice with real-world questions tailored to your target
                  role and tech stack.
                </p>
              </div>
            </div>
          </div>

          {/* Back Side - Sign Up / Forgot Password */}
          <div className="book-face book-face-back absolute inset-0 grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">
            {/* Left - Illustration */}
            <div className="hidden md:flex gradient-bg items-center justify-center p-12">
              <div className="text-center text-primary-foreground">
                <Sparkles className="h-16 w-16 mx-auto mb-6 animate-pulse-slow" />
                <h2 className="text-2xl font-bold mb-4">
                  {backView === "signup"
                    ? "Start Your Journey"
                    : "Reset Password"}
                </h2>
                <p className="opacity-90 max-w-xs">
                  {backView === "signup"
                    ? "Join thousands of developers preparing for their dream roles."
                    : "Enter your account email and we will send a password reset link."}
                </p>
              </div>
            </div>

            {/* Right - Form */}
            <div className="glass-panel-elevated p-8 md:p-12 flex flex-col justify-center">
              {backView === "signup" ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                      Create Account
                    </h1>
                    <p className="text-muted-foreground">
                      Get started with TrueMetric
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-bg"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Creating account..."
                        : "Create Account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setBackView("signup");
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">
                      Reset Password
                    </h1>
                    <p className="text-muted-foreground">
                      We'll send a reset link to your email.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      await new Promise((r) => setTimeout(r, 800));
                      if (resetEmail) {
                        toast({
                          title: "Reset link sent",
                          description: `We've sent a password reset link to ${resetEmail}.`,
                        });
                        setResetEmail("");
                      } else {
                        toast({
                          title: "Error",
                          description: "Please provide your email.",
                          variant: "destructive",
                        });
                      }
                      setIsLoading(false);
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-bg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send reset link"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Remembered your password?{" "}
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setBackView("signup");
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Back to sign in
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
