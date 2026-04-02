import { useRef, useEffect, PointerEvent } from 'react';

interface TextareaControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Number of visible rows. Defaults to auto-grow up to content height. */
  rows?: number;
  /** When true, shows a custom drag handle so the user can resize manually. Disables auto-grow. */
  resizable?: boolean;
}

/** Rounded-corner resize affordance icon. */
function ResizeGrip() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.75 5.5H0.75C0.336 5.5 0 5.164 0 4.75C0 4.336 0.336 4 0.75 4H2.75C3.439 4 4 3.439 4 2.75V0.75C4 0.336 4.336 0 4.75 0C5.164 0 5.5 0.336 5.5 0.75V2.75C5.5 4.267 4.267 5.5 2.75 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * A multi-line text input with a stacked label and an auto-growing textarea.
 * Use `resizable` to replace auto-grow with a custom drag handle at the bottom.
 */
export function TextareaControl({ label, value, onChange, placeholder, rows, resizable }: TextareaControlProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow — disabled when resizable or fixed rows are set
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || rows || resizable) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, rows, resizable]);

  const handleResizePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = textareaRef.current;
    if (!el) return;

    const startY = e.clientY;
    const startHeight = el.offsetHeight;

    const onMove = (ev: PointerEvent) => {
      const newHeight = Math.max(60, startHeight + (ev.clientY - startY));
      el.style.height = `${newHeight}px`;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="dialkit-textarea-control">
      <label className="dialkit-textarea-label">{label}</label>
      <div className={resizable ? 'dialkit-textarea-resizable-wrapper' : undefined}>
        <textarea
          ref={textareaRef}
          className="dialkit-textarea-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows ?? 3}
          style={resizable
            ? { resize: 'none', overflow: 'auto' }
            : { resize: 'none', overflow: 'hidden' }
          }
        />
      </div>
      {resizable && (
        <div
          className="dialkit-textarea-resize-handle"
          onPointerDown={handleResizePointerDown}
        >
          <ResizeGrip />
        </div>
      )}
    </div>
  );
}
