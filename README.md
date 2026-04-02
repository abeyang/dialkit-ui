# Dialkit UI

A component library for building rich parameter-control panels and inspector UIs in React apps. Dialkit UI provides a curated set of dark-themed, glassmorphic controls — sliders, toggles, selects, menus, color pickers, spring editors, and more — all designed to be composed inside application sidebars, settings panels, or developer tools.

> **Note:** Dialkit UI also ships cross-framework bindings for Solid and Svelte via `dialkit/solid` and `dialkit/svelte`.

---

## Installation

```bash
npm install dialkit motion
```

```tsx
// layout.tsx
import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <DialRoot />
      </body>
    </html>
  );
}
```

---

## useDialKit — Auto-panel from a config

The fastest way to get a full control panel. Describe your parameters as a config object; Dialkit infers the control type and renders the panel automatically.

```tsx
import { useDialKit } from 'dialkit';

function Card() {
  const p = useDialKit('Card', {
    blur: [24, 0, 100],
    scale: 1.2,
    color: '#ff5500',
    visible: true,
  });

  return (
    <div style={{
      filter: `blur(${p.blur}px)`,
      transform: `scale(${p.scale})`,
      color: p.color,
      opacity: p.visible ? 1 : 0,
    }}>
      ...
    </div>
  );
}
```

```tsx
const params = useDialKit(name, config, options?)
```

| Param | Type | Description |
|-------|------|-------------|
| `name` | `string` | Panel title shown in the UI |
| `config` | `DialConfig` | Parameter definitions (see Control Types below) |
| `options.onAction` | `(path: string) => void` | Callback when action buttons are clicked |

Returns a fully typed object matching your config shape with live values.

---

## Control Types (via useDialKit)

### Slider

Numbers create sliders.

```tsx
blur: [24, 0, 100]          // [default, min, max]
blur: [24, 0, 100, 5]       // with step
scale: 1.2                   // bare number — range auto-inferred
```

| Value range | Inferred min/max | Step |
|-------------|-----------------|------|
| 0–1 | 0 to 1 | 0.01 |
| 0–10 | 0 to value × 3 | 0.1 |
| 0–100 | 0 to value × 3 | 1 |
| 100+ | 0 to value × 3 | 10 |

Sliders support click-to-snap (with spring animation), drag with rubber-band overflow, and direct text editing.

**Returns:** `number`

### Toggle

```tsx
enabled: true
darkMode: false
```

Booleans create an Off/On segmented control.

**Returns:** `boolean`

### Text

```tsx
title: 'Hello'
subtitle: { type: 'text', default: '', placeholder: 'Enter subtitle...' }
```

Non-hex strings are auto-detected as single-line text inputs.

**Returns:** `string`

### Color

```tsx
color: '#ff5500'                           // auto-detected
bg: { type: 'color', default: '#000' }     // explicit
```

Hex strings (`#RGB`, `#RRGGBB`, `#RRGGBBAA`) render a hex editor and a native color-picker swatch.

**Returns:** `string` (hex color)

### Select

```tsx
layout: {
  type: 'select',
  options: ['stack', 'fan', 'grid'],
  default: 'stack',
}
```

Options can be plain strings or `{ value, label }` objects. Renders as a full-width dropdown.

**Returns:** `string`

### Spring

```tsx
// Time-based
spring: { type: 'spring', visualDuration: 0.3, bounce: 0.2 }

// Physics-based
spring: { type: 'spring', stiffness: 200, damping: 25, mass: 1 }
```

A visual spring editor with live curve preview. Pass the returned value directly to Motion's `transition` prop.

**Returns:** `SpringConfig`

### Action

```tsx
const p = useDialKit('Controls', {
  shuffle: { type: 'action' },
  reset: { type: 'action', label: 'Reset All' },
}, {
  onAction: (path) => {
    if (path === 'shuffle') shuffleItems();
    if (path === 'reset') resetToDefaults();
  },
});
```

Trigger callbacks without storing any value.

### Folder

Nested plain objects become collapsible folders.

```tsx
shadow: {
  blur: [10, 0, 50],
  opacity: [0.25, 0, 1],
  color: '#000000',
  _collapsed: true,   // starts closed (reserved metadata key)
}
```

Access nested values as `params.shadow.blur`, etc.

---

## DialRoot

```tsx
<DialRoot position="top-right" />
```

| Prop | Type | Default |
|------|------|---------| 
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| `defaultOpen` | `boolean` | `true` |
| `mode` | `'popover' \| 'inline'` | `'popover'` |

Mount once at your app root. In `inline` mode, the panel fills its container — useful for sidebars.

---

## Individual Components

All controls are also exported individually for use outside the auto-panel system. Import and compose them directly in your own UI.

```tsx
import 'dialkit/styles.css';
import {
  Slider,
  Toggle,
  TextControl,
  TextareaControl,
  SelectControl,
  ColorControl,
  ChoiceGrid,
  ButtonGroup,
  Tabs,
  Menu,
  SpringControl,
  TransitionControl,
  PresetManager,
  Folder,
} from 'dialkit';
```

### Slider

```tsx
<Slider label="Blur" value={blur} onChange={setBlur} min={0} max={100} step={1} />
```

### Toggle

```tsx
<Toggle label="Dark Mode" value={dark} onChange={setDark} />
```

### TextControl

Single-line text input. Label on the left, input on the right.

```tsx
<TextControl label="Name" value={name} onChange={setName} placeholder="Component name" />
```

| Prop | Type | Required |
|------|------|----------|
| `label` | `string` | ✓ |
| `value` | `string` | ✓ |
| `onChange` | `(value: string) => void` | ✓ |
| `placeholder` | `string` | — |

### TextareaControl

Multi-line text input for paragraph/long-form content. Stacked label above textarea.

```tsx
<TextareaControl
  label="Notes"
  value={notes}
  onChange={setNotes}
  placeholder="Add a description…"
  resizable
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | ✓ | |
| `value` | `string` | ✓ | |
| `onChange` | `(value: string) => void` | ✓ | |
| `placeholder` | `string` | — | |
| `rows` | `number` | — | Fixed row count. Omit to enable auto-grow. |
| `resizable` | `boolean` | — | Shows a custom drag handle for manual resizing. Disables auto-grow. |

### SelectControl

Full-width dropdown with a portalled list.

```tsx
<SelectControl
  label="Layout"
  value={layout}
  onChange={setLayout}
  options={[
    { value: 'stack', label: 'Stack' },
    { value: 'grid', label: 'Grid' },
  ]}
/>
```

### ColorControl

```tsx
<ColorControl label="Accent" value={color} onChange={setColor} />
```

### ChoiceGrid

A 2-column grid of radio-style buttons with an animated active pill.

```tsx
<ChoiceGrid
  label="Alignment"
  value={align}
  onChange={setAlign}
  options={[
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' },
  ]}
/>
```

### Tabs

Tabbed container with animated indicator and content transitions.

```tsx
<Tabs
  tabs={[
    { id: 'layout', label: 'Layout', children: <LayoutControls /> },
    { id: 'motion', label: 'Motion', children: <MotionControls /> },
  ]}
/>
```

### Menu

A vertical list selector for picking a single item (e.g. files, scenes, layers). Supports an animated active pill, optional subtext, and per-item clickable action buttons.

```tsx
<Menu
  label="Files"
  value={activeFile}
  onChange={setActiveFile}
  items={[
    {
      value: 'doc',
      label: 'Document.pdf',
      subtext: 'Modified today',
      actions: [
        { label: 'Edit', icon: <PencilIcon />, onClick: (e) => handleEdit(e) },
        { label: 'Delete', icon: <TrashIcon />, onClick: (e) => handleDelete(e) },
      ],
    },
    {
      value: 'slides',
      label: 'Presentation.pptx',
      subtext: 'Modified yesterday',
    },
  ]}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `MenuItem[]` | ✓ | List of selectable items |
| `value` | `string` | ✓ | Currently active item value (controlled) |
| `onChange` | `(value: string) => void` | ✓ | Called when a new item is selected |
| `label` | `string` | — | Optional section header above the list |

**`MenuItem`**

| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | Unique identifier |
| `label` | `string` | Primary display text |
| `subtext` | `string` | Optional secondary text beneath the label |
| `actions` | `MenuAction[]` | Optional clickable icon buttons on the right (fade in on hover/active) |

**`MenuAction`**

| Field | Type | Description |
|-------|------|-------------|
| `icon` | `ReactNode` | Button content (typically an SVG icon) |
| `label` | `string` | Accessible label / tooltip text |
| `onClick` | `(e: MouseEvent) => void` | Click handler — event propagation is automatically stopped |
| `id` | `string` | Optional key for stable rendering |

### ButtonGroup

A row of segmented buttons. Optionally displays icons.

```tsx
<ButtonGroup
  label="View"
  value={view}
  onChange={setView}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
  ]}
/>
```

### SpringControl / TransitionControl

Visual spring and easing editors. See `SpringConfig` and `TransitionConfig` types.

### PresetManager

A toolbar dropdown for saving and loading named parameter snapshots.

```tsx
<PresetManager
  panelId="my-panel"
  presets={presets}
  activePresetId={activeId}
  onAdd={handleAddPreset}
/>
```

### Folder

Collapsible folder container for grouping controls.

```tsx
<Folder label="Shadow" defaultOpen>
  <Slider label="Blur" value={blur} onChange={setBlur} min={0} max={50} />
  <ColorControl label="Color" value={color} onChange={setColor} />
</Folder>
```

---

## Solid

```bash
npm install dialkit solid-js
```

```tsx
import { DialRoot, createDialKit } from 'dialkit/solid';
import 'dialkit/styles.css';

function Card() {
  const params = createDialKit('Card', {
    blur: [24, 0, 100],
    color: '#ff5500',
  });

  return <div style={{ filter: `blur(${params().blur}px)` }}>...</div>;
}
```

`createDialKit` returns an accessor — call `params()` to read live values.

---

## Svelte

```bash
npm install dialkit
```

```svelte
<!-- Card.svelte -->
<script>
  import { createDialKit } from 'dialkit/svelte';

  const params = createDialKit('Card', {
    blur: [24, 0, 100],
    color: '#ff5500',
  });
</script>

<div style:filter={`blur(${params.blur}px)`}>...</div>
```

`createDialKit` returns a reactive object — access values directly. Styles are injected automatically by `DialRoot` (no CSS import needed).

---

## Types

```tsx
import type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  DialConfig,
  DialValue,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
  Preset,
  MenuItem,
  MenuAction,
  TabItem,
} from 'dialkit';
```

---

## License

MIT
