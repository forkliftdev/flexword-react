import { useEffect, useRef } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  onEscape?: () => void;
  restoreFocus?: boolean;
}

/**
 * Hook to trap focus within a container (e.g., modal).
 * - Focuses first focusable element on mount
 * - Traps Tab key within container
 * - Handles Escape key
 * - Restores focus on unmount
 */
export const useFocusTrap = (options: UseFocusTrapOptions) => {
  const { isActive, onEscape, restoreFocus = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selector));
    };

    // Focus first element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
        return;
      }

      // Tab key
      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          // Shift+Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previous element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, onEscape, restoreFocus]);

  return containerRef;
};
