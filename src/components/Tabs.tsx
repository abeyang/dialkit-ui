import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  children: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

// ── Tabs ───────────────────────────────────────────────────────────────────────

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const activeIndex = tabs.findIndex(t => t.id === activeId);
  const activeTab = tabs[activeIndex];

  return (
    <div className="dialkit-tabs">
      {/* Tab bar */}
      <div className="dialkit-tabs-bar">
        {tabs.map(tab => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              className="dialkit-tabs-tab"
              data-active={isActive}
              onClick={() => setActiveId(tab.id)}
            >
              {isActive && (
                <motion.span
                  layoutId="dialkit-tab-pill"
                  className="dialkit-tabs-pill"
                  transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.2 }}
                />
              )}
              <span className="dialkit-tabs-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait" initial={false}>
        {activeTab && (
          <motion.div
            key={activeId}
            className="dialkit-tabs-panel"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', visualDuration: 0.22, bounce: 0 }}
          >
            {activeTab.children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
