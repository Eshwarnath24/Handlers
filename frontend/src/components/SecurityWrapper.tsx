import { useEffect, useCallback, ReactNode, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";

interface SecurityWrapperProps {
  children: ReactNode;
  enabled?: boolean;
}

export function SecurityWrapper({ children, enabled = true }: SecurityWrapperProps) {
  const { toast } = useToast();
  const { incrementTabSwitch, tabSwitchCount } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );

  const lockRef = useRef(false);

  const warn = useCallback(
    (msg: string) => {
      toast({
        title: "⚠️ Warning",
        description: msg,
        variant: "destructive",
      });
    },
    [toast]
  );

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!enabled) return;

    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {}
      }
    };

    // protect against rapid repeated events
    let localLock = false;

    const handleViolation = () => {
      if (localLock) return;
      localLock = true;
      setTimeout(() => (localLock = false), 800);
    };

    const handleVisibilityChange = () => {
      // only act when document becomes hidden
      if (!document.hidden) return;

      handleViolation();
      // increment shared counter
      incrementTabSwitch();
      const next = tabSwitchCount + 1;
      const remaining = Math.max(0, 3 - next);

      if (next === 1) {
        setPopupMessage(`Do not switch tabs during the test. Attempts left: ${remaining}`);
        setPopupOpen(true);
      } else {
        setPopupMessage(
          `Do not exit fullscreen — please re-enter fullscreen to continue the test. Attempts left: ${remaining}`
        );
        setPopupOpen(true);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    const handleWindowBlur = () => {
      // some browsers fire blur instead of visibilitychange
      if (document.hidden) return; // already handled by visibilitychange when hidden
      handleViolation();
      incrementTabSwitch();
      const next = tabSwitchCount + 1;
      const remaining = Math.max(0, 3 - next);
      if (next === 1) {
        setPopupMessage(`Do not switch tabs during the test. Attempts left: ${remaining}`);
        setPopupOpen(true);
      } else {
        setPopupMessage(
          `Do not exit fullscreen — please re-enter fullscreen to continue the test. Attempts left: ${remaining}`
        );
        setPopupOpen(true);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // treat Escape as an attempt to exit fullscreen
      if (e.key === "Escape" || e.key === "Esc") {
        incrementTabSwitch();
        const next = tabSwitchCount + 1;
        const remaining = Math.max(0, 3 - next);
        setPopupMessage(
          `Do not exit fullscreen — please re-enter fullscreen to continue the test. Attempts left: ${remaining}`
        );
        setPopupOpen(true);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // ensure we start in fullscreen when the test mounts
    enterFullscreen();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enabled, incrementTabSwitch, warn, tabSwitchCount]);

  const requestFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {}
  };

  return (
    <div className={enabled ? "no-select" : ""}>
      {children}

      {/* HARD BLOCK — user CANNOT interact unless fullscreen */}
      {enabled && !isFullscreen && tabSwitchCount >= 2 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 p-6">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Fullscreen Required
            </h2>
            <p className="text-muted-foreground mb-6">
              You must stay in fullscreen mode to continue the test.
              Tab switching is not allowed.
            </p>
            <button
              onClick={requestFullscreen}
              className="px-6 py-3 rounded-md bg-primary text-white"
            >
              Enter Fullscreen & Continue
            </button>
          </div>
        </div>
      )}

      {/* Simple popup modal for warnings */}
      {popupOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-6"
        >
          <div className="max-w-lg w-full bg-card p-6 rounded-lg shadow-lg text-left">
            <h3 className="text-lg font-semibold mb-2">Attention</h3>
            <p className="text-sm text-muted-foreground mb-4">Dont switch screens</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded-md bg-primary text-white"
                onClick={() => setPopupOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
