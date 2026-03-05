// Core API
export { createDialKit, DialKitStore } from './createDialKit.svelte';
export type { CreateDialOptions } from './createDialKit.svelte';

// Root component
export { default as DialRoot } from './components/DialRoot.svelte';
export type { DialPosition } from './components/DialRoot.svelte';

// Component exports
export { default as Slider } from './components/Slider.svelte';
export { default as Toggle } from './components/Toggle.svelte';
export { default as Folder } from './components/Folder.svelte';
export { default as ButtonGroup } from './components/ButtonGroup.svelte';
export { default as SpringControl } from './components/SpringControl.svelte';
export { default as SpringVisualization } from './components/SpringVisualization.svelte';
export { default as TransitionControl } from './components/TransitionControl.svelte';
export { default as EasingVisualization } from './components/EasingVisualization.svelte';
export { default as TextControl } from './components/TextControl.svelte';
export { default as SelectControl } from './components/SelectControl.svelte';
export { default as ColorControl } from './components/ColorControl.svelte';
export { default as PresetManager } from './components/PresetManager.svelte';

// Store exports
export { DialStore } from '../store/DialStore';
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
} from '../store/DialStore';
