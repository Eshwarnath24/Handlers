import { useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

interface SecurityWrapperProps {
  children: ReactNode;
  enabled?: boolean;
}

export function SecurityWrapper({ children, enabled = true }: SecurityWrapperProps) {
  const { toast } = useToast();
  const { incrementTabSwitch, tabSwitchCount } = useApp();

  const showWarning = useCallback((message: string) => {
    toast({
      title: '⚠️ Warning',
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  useEffect(() => {
    if (!enabled) return;

    // Prevent copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning('Copying is disabled during the test.');
    };

    // Prevent paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showWarning('Pasting is disabled during the test.');
    };

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning('Right-click is disabled during the test.');
    };

    // Prevent text selection
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    // Detect tab switch / window blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementTabSwitch();
        showWarning(`Tab switch detected! Warning ${tabSwitchCount + 1}/3`);
      }
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+A, PrintScreen
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        showWarning('This keyboard shortcut is disabled during the test.');
      }
    };

    // Request fullscreen
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen not available');
      }
    };

    // Add event listeners
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    enterFullscreen();

    // Cleanup
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [enabled, showWarning, incrementTabSwitch, tabSwitchCount]);

  return (
    <div className={enabled ? 'no-select' : ''}>
      {children}
    </div>
  );
}
