// Main hook
export { useDialKit } from './hooks/useDialKit';
export type { UseDialOptions } from './hooks/useDialKit';

// Root component (user mounts once)
export { DialRoot } from './components/DialRoot';
export type { DialPosition, DialMode } from './components/DialRoot';

// Individual components (for advanced usage)
export { Slider } from './components/Slider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { TransitionControl } from './components/TransitionControl';
export { EasingVisualization } from './components/EasingVisualization';
export { TextControl } from './components/TextControl';
export { TextareaControl } from './components/TextareaControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { PresetManager } from './components/PresetManager';
export { ChoiceGrid } from './components/ChoiceGrid';
export { Menu } from './components/Menu';
export type { MenuItem } from './components/Menu';
export { Tabs } from './components/Tabs';
export type { TabItem } from './components/Tabs';

// Store (for advanced usage)
export { DialStore } from './store/DialStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  Preset,
  DialValue,
  DialConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from './store/DialStore';
