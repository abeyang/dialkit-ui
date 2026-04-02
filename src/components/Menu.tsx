import { ReactNode, MouseEvent } from 'react';
import { motion, LayoutGroup } from 'motion/react';

export interface MenuAction {
  /** Optional unique identifier for the action */
  id?: string;
  /** Label for accessibility/tooltips (not shown in UI) */
  label: string;
  /** The icon or component to render as the action button */
  icon: ReactNode;
  /** Callback fired when the action button itself is clicked */
  onClick: (e: MouseEvent) => void;
}

export interface MenuItem<T extends string = string> {
  value: T;
  label: string;
  subtext?: string;
  /** Legacy: Optional static icon shown on the right (fades in on hover/active) */
  icon?: ReactNode;
  /** List of clickable action buttons on the right. These take precedence over 'icon' if provided. */
  actions?: MenuAction[];
}

interface MenuProps<T extends string = string> {
  /** Optional header label shown above the list */
  label?: string;
  items: MenuItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * A vertical list selector with a single active state.
 * Each item supports an optional right-side icon, subtext, and multiple clickable action buttons.
 */
export function Menu<T extends string = string>({
  label,
  items,
  value,
  onChange,
}: MenuProps<T>) {
  return (
    <div className="dialkit-menu-root">
      {label && <div className="dialkit-menu-label">{label}</div>}
      <LayoutGroup>
        <div className="dialkit-menu-list">
          {items.map((item) => {
            const isActive = item.value === value;
            return (
              <div
                key={item.value}
                className="dialkit-menu-item"
                data-active={String(isActive)}
                onClick={() => onChange(item.value)}
              >
                {isActive && (
                  <motion.div
                    layoutId="menu-active-pill"
                    className="dialkit-menu-item-pill"
                    transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                  />
                )}
                
                <div className="dialkit-menu-item-content">
                  <span className="dialkit-menu-item-label">{item.label}</span>
                  {item.subtext && (
                    <span className="dialkit-menu-item-subtext">{item.subtext}</span>
                  )}
                </div>

                <div className="dialkit-menu-item-actions">
                  {(item.actions || (item.icon && [{ label: item.label, icon: item.icon, onClick: () => {} }]))?.map((action, idx) => (
                    <button
                      key={action.id || idx}
                      className="dialkit-menu-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(e);
                      }}
                      title={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
