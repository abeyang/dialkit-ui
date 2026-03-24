import { motion, LayoutGroup } from 'motion/react';

interface ChoiceGridOption<T extends string> {
  value: T;
  label: string;
}

interface ChoiceGridProps<T extends string> {
  label?: string;
  options: ChoiceGridOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * A 2-column grid radio-group that shares the same design language as SegmentedControl.
 * Uses an animated background pill (via layoutId) that slides between options.
 */
export function ChoiceGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceGridProps<T>) {
  return (
    <div className="dialkit-choice-grid-root">
      {label && <div className="dialkit-choice-grid-label">{label}</div>}
      <LayoutGroup>
        <div className="dialkit-choice-grid">
          {options.map((option) => {
            const isActive = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className="dialkit-choice-grid-button"
                data-active={String(isActive)}
              >
                {isActive && (
                  <motion.div
                    layoutId="choice-grid-pill"
                    className="dialkit-choice-grid-pill"
                    transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                  />
                )}
                <span className="dialkit-choice-grid-button-text">{option.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
