import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as previews from './previews';
import { Agentation } from 'agentation';

// ── Component metadata ────────────────────────────────────────────────────────

interface Param {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

interface ComponentDoc {
  name: string;
  category: string;
  description: string;
  notes?: string;
  params: Param[];
  preview: React.ReactNode;
}

const COMPONENTS: ComponentDoc[] = [
  // ── Core ──────────────────────────────────────────────────────────────────
  {
    name: 'DialRoot',
    category: 'Core',
    description:
      'The top-level mount point that renders all registered panels into the DOM via a portal. Mount it once, near the root of your app.',
    notes:
      'Panels register themselves through `useDialKit`. When `mode="inline"` the panel renders in-place instead of as a fixed overlay.',
    params: [
      { name: 'position', type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"', required: false, default: '"top-right"', description: 'Screen corner where the floating panel appears.' },
      { name: 'defaultOpen', type: 'boolean', required: false, default: 'true', description: 'Whether the panel starts expanded.' },
      { name: 'mode', type: '"popover" | "inline"', required: false, default: '"popover"', description: 'Popover renders as a fixed overlay; inline renders inside the layout flow.' },
    ],
    preview: <previews.DialRootPreview />,
  },
  {
    name: 'Panel',
    category: 'Core',
    description:
      'Renders a full settings panel from a `PanelConfig` object registered in the DialStore. Handles the toolbar (preset management, copy-to-clipboard) and all control types automatically.',
    params: [
      { name: 'panel', type: 'PanelConfig', required: true, description: 'The panel configuration object from `DialStore`.' },
      { name: 'defaultOpen', type: 'boolean', required: false, default: 'true', description: 'Whether the panel starts expanded.' },
      { name: 'inline', type: 'boolean', required: false, default: 'false', description: 'Pass `true` when the panel lives inside a layout container rather than floating.' },
    ],
    preview: <previews.PanelPreview />,
  },
  {
    name: 'Folder',
    category: 'Core',
    description:
      'A collapsible section container. Used internally by `Panel` to group controls, but can also be used standalone anywhere a collapsible group is needed.',
    params: [
      { name: 'title', type: 'string', required: true, description: 'Section heading shown in the folder header.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Content rendered inside the collapsible area.' },
      { name: 'defaultOpen', type: 'boolean', required: false, default: 'true', description: 'Whether the folder starts expanded.' },
      { name: 'isRoot', type: 'boolean', required: false, default: 'false', description: 'Marks this as the top-level panel folder (different header styling + collapse icon).' },
      { name: 'inline', type: 'boolean', required: false, default: 'false', description: 'Used with `isRoot` to render in inline mode.' },
      { name: 'onOpenChange', type: '(isOpen: boolean) => void', required: false, description: 'Callback fired whenever the open state changes.' },
      { name: 'toolbar', type: 'ReactNode', required: false, description: 'Extra content rendered in the header row when `isRoot` is true and the folder is open.' },
    ],
    preview: <previews.FolderPreview />,
  },
  {
    name: 'Tabs',
    category: 'Core',
    description:
      'A tab bar that lets users switch between multiple named settings pages. Each tab renders its own children, with an animated sliding pill indicator and a smooth page-transition animation between panels.',
    notes:
      'Tabs compose well with any control — place `Folder`, `Slider`, `Toggle`, and other components directly as `children` of each tab definition.',
    params: [
      { name: 'tabs', type: 'Array<{ id: string; label: string; children: ReactNode }>', required: true, description: 'Ordered list of tab definitions. Each entry supplies a unique `id`, a display `label`, and the `children` rendered when that tab is active.' },
      { name: 'defaultTab', type: 'string', required: false, description: 'The `id` of the tab that should be active on first render. Defaults to the first tab.' },
    ],
    preview: <previews.TabsPreview />,
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  {
    name: 'Slider',
    category: 'Controls',
    description:
      'A drag-and-drop numeric slider with a subtle fill track, animated handle, snap-to-decile behavior, and an inline text-edit mode. Supports both continuous and discrete (stepped) ranges.',
    notes: 'Click-and-drag moves the value; hover the value badge then wait ~800 ms to enter keyboard-edit mode.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Display label shown on the left side of the track.' },
      { name: 'value', type: 'number', required: true, description: 'Current numeric value (controlled).' },
      { name: 'onChange', type: '(value: number) => void', required: true, description: 'Called with the new value on every change.' },
      { name: 'min', type: 'number', required: false, default: '0', description: 'Minimum allowed value.' },
      { name: 'max', type: 'number', required: false, default: '1', description: 'Maximum allowed value.' },
      { name: 'step', type: 'number', required: false, default: '0.01', description: 'Snap increment. Steps ≤ 10 render as discrete with hashmarks.' },
      { name: 'unit', type: 'string', required: false, description: 'Unit suffix appended to the value display (e.g. `"s"`, `"px"`).' },
    ],
    preview: <previews.SliderPreview />,
  },
  {
    name: 'Toggle',
    category: 'Controls',
    description:
      'A labelled On/Off switch rendered as a `SegmentedControl` with two options. Provides a simple boolean control in the settings panel.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Text label shown to the left.' },
      { name: 'checked', type: 'boolean', required: true, description: 'Current boolean state (controlled).' },
      { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Called with the new boolean when the user selects On or Off.' },
    ],
    preview: <previews.TogglePreview />,
  },
  {
    name: 'ChoiceGrid',
    category: 'Controls',
    description:
      'A choice selector that renders as a 2-column grid of buttons. Optimized for many options and larger clickable areas.',
    params: [
      { name: 'label', type: 'string', required: false, description: 'Optional header text shown above the grid.' },
      { name: 'options', type: 'Array<{ value: T; label: string }>', required: true, description: 'List of selectable options.' },
      { name: 'value', type: 'T', required: true, description: 'Currently selected value.' },
      { name: 'onChange', type: '(value: T) => void', required: true, description: 'Called when the user selects a different option.' },
    ],
    preview: <previews.ChoiceGridPreview />,
  },
  {
    name: 'SegmentedControl',
    category: 'Controls',
    description:
      'A pill-based tab selector where a sliding animated indicator highlights the active option. Generic over the option value type.',
    params: [
      { name: 'options', type: 'Array<{ value: T; label: string }>', required: true, description: 'List of selectable options.' },
      { name: 'value', type: 'T', required: true, description: 'Currently selected value.' },
      { name: 'onChange', type: '(value: T) => void', required: true, description: 'Called when the user selects a different option.' },
    ],
    preview: <previews.SegmentedControlPreview />,
  },
  {
    name: 'SelectControl',
    category: 'Controls',
    description:
      'A full-width labeled dropdown that opens a portalled, animated option list. Options can be plain strings or `{ value, label }` objects.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Display label on the left of the trigger row.' },
      { name: 'value', type: 'string', required: true, description: 'Currently selected option value.' },
      { name: 'options', type: 'Array<string | { value: string; label: string }>', required: true, description: 'Available choices.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Called with the chosen value string.' },
    ],
    preview: <previews.SelectControlPreview />,
  },
  {
    name: 'TextControl',
    category: 'Controls',
    description:
      'A single-line text input row with a label on the left and a right-aligned input field. Useful for name, URL, or freeform string values.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Label shown on the left.' },
      { name: 'value', type: 'string', required: true, description: 'Current string value (controlled).' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Called on every keystroke.' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown when the field is empty.' },
    ],
    preview: <previews.TextControlPreview />,
  },
  {
    name: 'TextareaControl',
    category: 'Controls',
    description:
      'A multi-line text input with a small-caps label stacked above an auto-growing textarea. Ideal for descriptions, notes, or any freeform paragraph content.',
    notes:
      'The textarea grows automatically as the user types (up to the natural content height). Pass `rows` to fix the height instead.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Label shown above the input in small caps.' },
      { name: 'value', type: 'string', required: true, description: 'Current string value (controlled).' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Called on every keystroke.' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text shown when the field is empty.' },
      { name: 'rows', type: 'number', required: false, description: 'Fixed row count. Omit to enable auto-grow behaviour.' },
    ],
    preview: <previews.TextareaControlPreview />,
  },
  {
    name: 'ColorControl',
    category: 'Controls',
    description:
      'A color picker row with a hex-code editor and a native color-picker swatch. Accepts any CSS hex color (3, 6, or 8 digit). Invalid strings are discarded on blur.',
    params: [
      { name: 'label', type: 'string', required: true, description: 'Label shown on the left.' },
      { name: 'value', type: 'string', required: true, description: 'Current hex color string (e.g. `"#ff0000"`).' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Called with a validated hex string.' },
    ],
    preview: <previews.ColorControlPreview />,
  },
  {
    name: 'ButtonGroup',
    category: 'Controls',
    description:
      'A vertical stack of action buttons. Each button triggers an `onClick` callback. Labels are displayed as button text.',
    params: [
      { name: 'buttons', type: 'Array<{ label: string; onClick: () => void }>', required: true, description: 'List of button definitions.' },
    ],
    preview: <previews.ButtonGroupPreview />,
  },

  // ── Animation ─────────────────────────────────────────────────────────────
  {
    name: 'SpringControl',
    category: 'Animation',
    description:
      'A compound control for editing a Motion spring configuration. Offers two modes — **Time** (visualDuration + bounce, simpler) and **Physics** (stiffness, damping, mass). Includes a live `SpringVisualization`.',
    params: [
      { name: 'panelId', type: 'string', required: true, description: 'The ID of the parent panel (used to persist the selected mode).' },
      { name: 'path', type: 'string', required: true, description: 'Dot-notation path in the panel config (used as the mode storage key).' },
      { name: 'label', type: 'string', required: true, description: 'Title shown in the Folder header.' },
      { name: 'spring', type: 'SpringConfig', required: true, description: 'Current spring configuration object.' },
      { name: 'onChange', type: '(spring: SpringConfig) => void', required: true, description: 'Called with the updated spring config.' },
    ],
    preview: <previews.SpringControlPreview />,
  },
  {
    name: 'TransitionControl',
    category: 'Animation',
    description:
      'Extends `SpringControl` with a third **Easing** mode for cubic-bezier curves. Displays either a `SpringVisualization` or `EasingVisualization` depending on the active mode.',
    params: [
      { name: 'panelId', type: 'string', required: true, description: 'The ID of the parent panel.' },
      { name: 'path', type: 'string', required: true, description: 'Dot-notation path used as the mode storage key.' },
      { name: 'label', type: 'string', required: true, description: 'Title shown in the Folder header.' },
      { name: 'value', type: 'TransitionConfig', required: true, description: '`SpringConfig | EasingConfig` — the current transition configuration.' },
      { name: 'onChange', type: '(value: TransitionConfig) => void', required: true, description: 'Called with the updated transition config.' },
    ],
    preview: <previews.TransitionControlPreview />,
  },
  {
    name: 'SpringVisualization',
    category: 'Animation',
    description:
      'A read-only SVG graph that simulates and plots the spring curve for a given `SpringConfig`. Renders differently in simple (time-based) vs advanced (physics-based) mode.',
    params: [
      { name: 'spring', type: 'SpringConfig', required: true, description: 'Spring configuration to visualize.' },
      { name: 'isSimpleMode', type: 'boolean', required: true, description: 'When `true`, converts visualDuration/bounce to equivalent physics params before plotting.' },
    ],
    preview: <previews.SpringVisualizationPreview />,
  },
  {
    name: 'EasingVisualization',
    category: 'Animation',
    description:
      'A read-only SVG cubic-bezier graph. Draws the curve defined by the four ease control-point values alongside a diagonal reference line.',
    params: [
      { name: 'easing', type: 'EasingConfig', required: true, description: 'Easing configuration containing the `ease: [x1, y1, x2, y2]` tuple.' },
    ],
    preview: <previews.EasingVisualizationPreview />,
  },

  // ── Presets ───────────────────────────────────────────────────────────────
  {
    name: 'PresetManager',
    category: 'Presets',
    description:
      'A toolbar dropdown for selecting, creating, and deleting named presets. Triggers are portalled, so the dropdown always renders above other content.',
    params: [
      { name: 'panelId', type: 'string', required: true, description: 'Panel whose presets are managed.' },
      { name: 'presets', type: 'Preset[]', required: true, description: 'Array of saved presets to show in the list.' },
      { name: 'activePresetId', type: 'string | null', required: true, description: 'ID of the currently active preset (`null` = base values).' },
      { name: 'onAdd', type: '() => void', required: true, description: 'Called when the user clicks the "add preset" button.' },
    ],
    preview: <previews.PresetManagerPreview />,
  },

  // ── Controls ────────────────────────────────────────────────────────────
  {
    name: 'Menu',
    category: 'Controls',
    description:
      'A vertical list selector for picking a single item from a named collection. Supports an animated active state that slides between items, optional subtext beneath each label, and an optional right-side icon that fades in on hover and when active.',
    notes:
      'Only one item can be active at a time. The sliding pill uses a shared `layoutId` so it animates correctly within a single `Menu` instance.',
    params: [
      { name: 'items', type: 'Array<{ value: T; label: string; subtext?: string; icon?: ReactNode }>', required: true, description: 'List of selectable items. Each item needs at minimum a `value` and `label`.' },
      { name: 'value', type: 'T', required: true, description: 'The currently active item value (controlled).' },
      { name: 'onChange', type: '(value: T) => void', required: true, description: 'Called with the new value when the user clicks a different item.' },
      { name: 'label', type: 'string', required: false, description: 'Optional section header shown above the item list in small caps.' },
    ],
    preview: <previews.MenuPreview />,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORIES = Array.from(new Set(COMPONENTS.map(c => c.category)));

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Core:      { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', dot: '#8b5cf6' },
  Controls:  { bg: 'rgba(59,130,246,0.12)', text: '#93c5fd', dot: '#3b82f6' },
  Animation: { bg: 'rgba(34,197,94,0.12)',  text: '#86efac', dot: '#22c55e' },
  Presets:   { bg: 'rgba(251,146,60,0.12)', text: '#fdba74', dot: '#f97316' },
};

function RequiredBadge({ required }: { required: boolean }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 4,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: required ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
        color: required ? '#f87171' : 'rgba(255,255,255,0.35)',
        flexShrink: 0,
      }}
    >
      {required ? 'required' : 'optional'}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Core;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 8px',
        borderRadius: 6,
        letterSpacing: '0.03em',
        background: colors.bg,
        color: colors.text,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
      {category}
    </span>
  );
}

function ParamRow({ param }: { param: Param }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr auto',
        gap: '8px 16px',
        alignItems: 'start',
        padding: '10px 16px',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 4,
      }}
    >
      {/* Name + type */}
      <div style={{ minWidth: 0 }}>
        <code style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', fontFamily: 'ui-monospace, "SF Mono", monospace' }}>
          {param.name}
        </code>
        <div style={{ marginTop: 3 }}>
          <code style={{ fontSize: 11, color: '#67e8f9', fontFamily: 'ui-monospace, "SF Mono", monospace', wordBreak: 'break-all' }}>
            {param.type}
          </code>
        </div>
        {param.default !== undefined && (
          <div style={{ marginTop: 3, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            default: <code style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', color: '#86efac' }}>{param.default}</code>
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
        {param.description}
      </p>

      {/* Required badge */}
      <div style={{ paddingTop: 1 }}>
        <RequiredBadge required={param.required} />
      </div>
    </motion.div>
  );
}

function ComponentCard({ doc, index }: { doc: ComponentDoc; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', visualDuration: 0.4, bounce: 0.1 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 32,
          padding: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                {doc.name}
              </h2>
              <CategoryBadge category={doc.category} />
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
              {doc.description}
            </p>
            {doc.notes && (
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, fontStyle: 'italic' }}>
                {doc.notes}
              </p>
            )}
          </div>

          <button
            onClick={() => setExpanded(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              alignSelf: 'flex-start',
              padding: '6px 12px 6px 8px',
              borderRadius: 8,
              background: expanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              color: expanded ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            <motion.svg
              width={14} height={14}
              viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              animate={{ rotate: expanded ? 0 : -90 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0 }}
            >
              <path d="M6 9.5L12 15.5L18 9.5" />
            </motion.svg>
            {doc.params.length} {doc.params.length === 1 ? 'Prop' : 'Props'}
          </button>
        </div>

        {/* Right: Interactive Preview */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {doc.preview}
        </div>
      </div>

      {/* Params table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.05 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 24px 20px' }}>
              {/* Column headers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr auto',
                  gap: '0 16px',
                  padding: '0 16px 8px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: 8,
                }}
              >
                {['Name / Type', 'Description', 'Required'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </span>
                ))}
              </div>

              {doc.params.map(param => (
                <ParamRow key={param.name} param={param} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: 'relative', maxWidth: 420 }}>
      <svg
        width={15} height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx={11} cy={11} r={8} />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search components…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '9px 14px 9px 36px',
          fontSize: 14,
          fontFamily: 'inherit',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          color: '#f1f5f9',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onFocus={e => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
        }}
        onBlur={e => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
          (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const filtered = COMPONENTS.filter(c => {
    const matchCat = activeCategory === null || c.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.params.some(p => p.name.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.reduce<Record<string, ComponentDoc[]>>((acc, cat) => {
    const items = filtered.filter(c => c.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <>
      {/* Top header bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(15,16,21,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '0 48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Logo mark */}
            <svg width={22} height={22} viewBox="0 0 16 16" fill="none">
              <path opacity="0.5" d="M6.84766 11.75C6.78583 11.9899 6.75 12.2408 6.75 12.5C6.75 12.7592 6.78583 13.0101 6.84766 13.25H2C1.58579 13.25 1.25 12.9142 1.25 12.5C1.25 12.0858 1.58579 11.75 2 11.75H6.84766ZM14 11.75C14.4142 11.75 14.75 12.0858 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25H12.6523C12.7142 13.0101 12.75 12.7592 12.75 12.5C12.75 12.2408 12.7142 11.9899 12.6523 11.75H14ZM3.09766 7.25C3.03583 7.48994 3 7.74075 3 8C3 8.25925 3.03583 8.51006 3.09766 8.75H2C1.58579 8.75 1.25 8.41421 1.25 8C1.25 7.58579 1.58579 7.25 2 7.25H3.09766ZM14 7.25C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75H8.90234C8.96417 8.51006 9 8.25925 9 8C9 7.74075 8.96417 7.48994 8.90234 7.25H14ZM7.59766 2.75C7.53583 2.98994 7.5 3.24075 7.5 3.5C7.5 3.75925 7.53583 4.01006 7.59766 4.25H2C1.58579 4.25 1.25 3.91421 1.25 3.5C1.25 3.08579 1.58579 2.75 2 2.75H7.59766ZM14 2.75C14.4142 2.75 14.75 3.08579 14.75 3.5C14.75 3.91421 14.4142 4.25 14 4.25H13.4023C13.4642 4.01006 13.5 3.75925 13.5 3.5C13.5 3.24075 13.4642 2.98994 13.4023 2.75H14Z" fill="white"/>
              <circle cx="6" cy="8" r="0.998596" fill="white" stroke="white" strokeWidth="1.25"/>
              <circle cx="10.4999" cy="3.5" r="0.998657" fill="white" stroke="white" strokeWidth="1.25"/>
              <circle cx="9.75015" cy="12.5" r="0.997986" fill="white" stroke="white" strokeWidth="1.25"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>DialKit UI</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>/ components</span>
          </div>

          <div style={{ flex: 1 }} />
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: '64px 48px 48px', maxWidth: 960, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.1 }}
        >
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 16px' }}>
            Component Reference
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
            All settings-panel components available in <code style={{ fontFamily: 'ui-monospace, "SF Mono", monospace', color: '#93c5fd', fontSize: 14 }}>src/components</code>. Each entry lists its name, a short description, and every prop it accepts.
          </p>
        </motion.div>
      </div>

      {/* Main layout */}
      <div style={{ padding: '0 48px 80px', maxWidth: 960, margin: '0 auto' }}>
        {/* Component list */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 48 }}>
          {Object.keys(grouped).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)' }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
                <circle cx={11} cy={11} r={8} /><path d="M21 21l-4.35-4.35" />
              </svg>
              <p style={{ fontSize: 15, margin: 0 }}>No components match "{search}"</p>
            </motion.div>
          ) : (
            Object.entries(grouped).map(([category, docs]) => (
              <section key={category}>
                {/* Category heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[category]?.dot ?? '#fff', flexShrink: 0 }} />
                  <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: CATEGORY_COLORS[category]?.text ?? '#fff' }}>
                    {category}
                  </h2>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>{docs.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {docs.map((doc, i) => (
                    <ComponentCard key={doc.name} doc={doc} index={i} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
      <Agentation />
    </>
  );
}
