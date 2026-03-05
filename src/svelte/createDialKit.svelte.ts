import { DialStore } from '../store/DialStore';
import type {
  ActionConfig,
  ColorConfig,
  DialConfig,
  DialValue,
  EasingConfig,
  ResolvedValues,
  SelectConfig,
  SpringConfig,
  TextConfig,
} from '../store/DialStore';

export interface CreateDialOptions {
  onAction?: (action: string) => void;
}

export class DialKitStore<T> {
  #value: T;
  #listeners = new Set<(value: T) => void>();

  constructor(initial: T) {
    this.#value = initial;
  }

  get current(): T {
    return this.#value;
  }

  subscribe(fn: (value: T) => void): () => void {
    fn(this.#value);
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  _set(value: T) {
    this.#value = value;
    for (const fn of this.#listeners) fn(value);
  }
}

let dialKitInstance = 0;

export function createDialKit<T extends DialConfig>(
  name: string,
  config: T,
  options?: CreateDialOptions
): DialKitStore<ResolvedValues<T>> {
  const panelId = `${name}-${++dialKitInstance}`;
  const resolved = () => buildResolvedValues(config, DialStore.getValues(panelId), '') as ResolvedValues<T>;

  const store = new DialKitStore<ResolvedValues<T>>(resolved());

  DialStore.registerPanel(panelId, name, config);
  store._set(resolved());

  const unsubValues = DialStore.subscribe(panelId, () => {
    store._set(resolved());
  });

  const unsubActions = options?.onAction
    ? DialStore.subscribeActions(panelId, options.onAction)
    : undefined;

  // Return a store that cleans up when all subscribers are gone
  // For SSR safety, we rely on the consumer's component lifecycle
  // to handle cleanup via $effect or onDestroy
  const originalSubscribe = store.subscribe.bind(store);
  let subscriberCount = 0;

  store.subscribe = (fn: (value: ResolvedValues<T>) => void) => {
    subscriberCount++;
    const unsub = originalSubscribe(fn);
    return () => {
      unsub();
      subscriberCount--;
      if (subscriberCount === 0) {
        unsubValues();
        unsubActions?.();
        DialStore.unregisterPanel(panelId);
      }
    };
  };

  return store;
}

function buildResolvedValues(
  config: DialConfig,
  flatValues: Record<string, DialValue>,
  prefix: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, configValue] of Object.entries(config)) {
    if (key === '_collapsed') continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(configValue) && configValue.length <= 4 && typeof configValue[0] === 'number') {
      result[key] = flatValues[path] ?? configValue[0];
    } else if (typeof configValue === 'number' || typeof configValue === 'boolean' || typeof configValue === 'string') {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSpringConfig(configValue) || isEasingConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isActionConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue;
    } else if (isSelectConfig(configValue)) {
      const defaultValue = configValue.default ?? getFirstOptionValue(configValue.options);
      result[key] = flatValues[path] ?? defaultValue;
    } else if (isColorConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '#000000';
    } else if (isTextConfig(configValue)) {
      result[key] = flatValues[path] ?? configValue.default ?? '';
    } else if (typeof configValue === 'object' && configValue !== null) {
      result[key] = buildResolvedValues(configValue as DialConfig, flatValues, path);
    }
  }

  return result;
}

function hasType(value: unknown, type: string): boolean {
  return typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === type;
}

function isSpringConfig(value: unknown): value is SpringConfig {
  return hasType(value, 'spring');
}

function isEasingConfig(value: unknown): value is EasingConfig {
  return hasType(value, 'easing');
}

function isActionConfig(value: unknown): value is ActionConfig {
  return hasType(value, 'action');
}

function isSelectConfig(value: unknown): value is SelectConfig {
  return hasType(value, 'select') && 'options' in (value as object) && Array.isArray((value as SelectConfig).options);
}

function isColorConfig(value: unknown): value is ColorConfig {
  return hasType(value, 'color');
}

function isTextConfig(value: unknown): value is TextConfig {
  return hasType(value, 'text');
}

function getFirstOptionValue(options: (string | { value: string; label: string })[]): string {
  const first = options[0];
  return typeof first === 'string' ? first : first.value;
}
