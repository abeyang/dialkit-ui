import { useState, useEffect } from 'react';
import '@dialkit/styles/theme.css';
import { DialStore } from '@dialkit/store/DialStore';
import { Panel } from '@dialkit/components/Panel';
import { Folder } from '@dialkit/components/Folder';
import { Slider } from '@dialkit/components/Slider';
import { Toggle } from '@dialkit/components/Toggle';
import { SegmentedControl } from '@dialkit/components/SegmentedControl';
import { SelectControl } from '@dialkit/components/SelectControl';
import { TextControl } from '@dialkit/components/TextControl';
import { ColorControl } from '@dialkit/components/ColorControl';
import { ButtonGroup } from '@dialkit/components/ButtonGroup';
import { SpringControl } from '@dialkit/components/SpringControl';
import { TransitionControl } from '@dialkit/components/TransitionControl';
import { SpringVisualization } from '@dialkit/components/SpringVisualization';
import { EasingVisualization } from '@dialkit/components/EasingVisualization';
import { ChoiceGrid } from '@dialkit/components/ChoiceGrid';
import { Tabs } from '@dialkit/components/Tabs';
import { PresetManager } from '@dialkit/components/PresetManager';
import type { SpringConfig, TransitionConfig, EasingConfig } from '@dialkit/store/DialStore';

// ── Module-level panel registrations ─────────────────────────────────────────
DialStore.registerPanel('prev-demo', 'Motion Settings', {
  opacity: [0.8, 0, 1, 0.01],
  enabled: true,
  theme: { type: 'select', options: ['Dark', 'Light', 'Auto'] },
  color: '#6366f1',
});
DialStore.registerPanel('prev-spring', 'Preview', {
  enter: { type: 'spring', visualDuration: 0.35, bounce: 0.2 },
});
DialStore.registerPanel('prev-transition', 'Preview', {
  motion: { type: 'spring' as const, visualDuration: 0.3, bounce: 0.2 },
});
DialStore.registerPanel('prev-preset', 'Preset Demo', {
  scale: [1, 0, 2, 0.1],
});

// ── Preview wrapper ───────────────────────────────────────────────────────────
export function PreviewBox({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
  return (
    <div
      className="dialkit-root"
      style={{
        width: 260,
        flexShrink: 0,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: noPad ? 0 : 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 320,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// ── Individual previews ───────────────────────────────────────────────────────

export function DialRootPreview() {
  return (
    <PreviewBox>
      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <div style={{ position: 'relative', width: '100%', height: 90, background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 56, background: '#212121', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 4, padding: 8 }}>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 3, width: '60%' }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, width: '80%' }} />
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, width: '70%' }} />
          </div>
          <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Your App</div>
        </div>
        <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'ui-monospace, monospace' }}>{'<DialRoot position="bottom-right" />'}</code>
      </div>
    </PreviewBox>
  );
}

export function PanelPreview() {
  const panel = DialStore.getPanel('prev-demo');
  if (!panel) return null;
  return (
    <div
      className="dialkit-root"
      style={{ width: 260, flexShrink: 0, background: '#1c1d26', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', maxHeight: 320, overflowY: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}
    >
      <Panel panel={panel} defaultOpen={true} inline={true} />
    </div>
  );
}

export function FolderPreview() {
  const [opacity, setOpacity] = useState(0.8);
  const [blur, setBlur] = useState(0.2);
  return (
    <PreviewBox>
      <Folder title="Transform" defaultOpen={true}>
        <Slider label="Opacity" value={opacity} onChange={setOpacity} />
        <Slider label="Blur" value={blur} onChange={setBlur} />
      </Folder>
      <Folder title="Colors" defaultOpen={false}>
        <ColorControl label="Fill" value="#6366f1" onChange={() => {}} />
        <ColorControl label="Stroke" value="#818cf8" onChange={() => {}} />
      </Folder>
    </PreviewBox>
  );
}

export function SliderPreview() {
  const [opacity, setOpacity] = useState(0.75);
  const [scale, setScale] = useState(1.2);
  const [steps, setSteps] = useState(3);
  return (
    <PreviewBox>
      <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={1} step={0.01} />
      <Slider label="Scale" value={scale} onChange={setScale} min={0} max={2} step={0.1} />
      <Slider label="Steps" value={steps} onChange={setSteps} min={0} max={5} step={1} />
    </PreviewBox>
  );
}

export function TogglePreview() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <PreviewBox>
      <Toggle label="Enabled" checked={a} onChange={setA} />
      <Toggle label="Drop Shadow" checked={b} onChange={setB} />
    </PreviewBox>
  );
}

export function SegmentedControlPreview() {
  const [type, setType] = useState<'ease' | 'time' | 'physics'>('time');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  return (
    <PreviewBox>
      <div className="dialkit-labeled-control">
        <span className="dialkit-labeled-control-label">Type</span>
        <SegmentedControl
          options={[{ value: 'ease' as const, label: 'Ease' }, { value: 'time' as const, label: 'Time' }, { value: 'physics' as const, label: 'Physics' }]}
          value={type} onChange={setType}
        />
      </div>
      <div className="dialkit-labeled-control">
        <span className="dialkit-labeled-control-label">Align</span>
        <SegmentedControl
          options={[{ value: 'left' as const, label: 'L' }, { value: 'center' as const, label: 'C' }, { value: 'right' as const, label: 'R' }]}
          value={align} onChange={setAlign}
        />
      </div>
    </PreviewBox>
  );
}

export function SelectControlPreview() {
  const [easing, setEasing] = useState('easeOut');
  const [theme, setTheme] = useState('dark');
  return (
    <PreviewBox>
      <SelectControl label="Easing" value={easing} options={['linear', 'easeIn', 'easeOut', 'easeInOut']} onChange={setEasing} />
      <SelectControl label="Theme" value={theme} options={['dark', 'light', 'auto']} onChange={setTheme} />
    </PreviewBox>
  );
}

export function TextControlPreview() {
  const [name, setName] = useState('Button');
  const [label, setLabel] = useState('Click me');
  return (
    <PreviewBox>
      <TextControl label="Name" value={name} onChange={setName} placeholder="Component name" />
      <TextControl label="Label" value={label} onChange={setLabel} placeholder="Button label" />
    </PreviewBox>
  );
}

export function ColorControlPreview() {
  const [bg, setBg] = useState('#6366f1');
  const [fg, setFg] = useState('#ffffff');
  return (
    <PreviewBox>
      <ColorControl label="Background" value={bg} onChange={setBg} />
      <ColorControl label="Foreground" value={fg} onChange={setFg} />
    </PreviewBox>
  );
}

export function ButtonGroupPreview() {
  const [log, setLog] = useState<string | null>(null);
  return (
    <PreviewBox>
      <ButtonGroup buttons={[
        { label: 'Reset to Defaults', onClick: () => setLog('Reset') },
        { label: 'Copy as JSON', onClick: () => setLog('Copied!') },
        { label: 'Export Config', onClick: () => setLog('Exported') },
      ]} />
      {log && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>→ {log}</p>}
    </PreviewBox>
  );
}

export function SpringControlPreview() {
  const [spring, setSpring] = useState<SpringConfig>({ type: 'spring', visualDuration: 0.35, bounce: 0.2 });
  return (
    <PreviewBox>
      <SpringControl
        panelId="prev-spring" path="enter" label="Enter"
        spring={spring}
        onChange={(s) => { setSpring(s); DialStore.updateValue('prev-spring', 'enter', s); }}
      />
    </PreviewBox>
  );
}

export function TransitionControlPreview() {
  const [value, setValue] = useState<TransitionConfig>({ type: 'spring', visualDuration: 0.3, bounce: 0.2 });
  return (
    <PreviewBox>
      <TransitionControl
        panelId="prev-transition" path="motion" label="Motion"
        value={value}
        onChange={(v) => { setValue(v); DialStore.updateValue('prev-transition', 'motion', v); }}
      />
    </PreviewBox>
  );
}

export function SpringVisualizationPreview() {
  const [stiffness, setStiffness] = useState(300);
  return (
    <PreviewBox>
      <SpringVisualization spring={{ type: 'spring', stiffness, damping: 20, mass: 1 }} isSimpleMode={false} />
      <Slider label="Stiffness" value={stiffness} onChange={setStiffness} min={10} max={1000} step={10} />
    </PreviewBox>
  );
}

const EASE_PRESETS: Record<string, [number, number, number, number]> = {
  Ease: [0.42, 0, 0.58, 1],
  'Ease In': [0.42, 0, 1, 1],
  'Ease Out': [0, 0, 0.58, 1],
  Linear: [0, 0, 1, 1],
};

export function EasingVisualizationPreview() {
  const [ease, setEase] = useState<EasingConfig>({ type: 'easing', duration: 0.3, ease: [0.42, 0, 0.58, 1] });
  return (
    <PreviewBox>
      <EasingVisualization easing={ease} />
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {Object.entries(EASE_PRESETS).map(([label, e]) => (
          <button key={label}
            onClick={() => setEase({ type: 'easing', duration: 0.3, ease: e })}
            style={{ padding: '3px 8px', fontSize: 11, fontFamily: 'inherit', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
          >{label}</button>
        ))}
      </div>
    </PreviewBox>
  );
}

export function PresetManagerPreview() {
  const panelId = 'prev-preset';
  const [presets, setPresets] = useState(() => DialStore.getPresets(panelId));
  const [activePresetId, setActiveId] = useState(() => DialStore.getActivePresetId(panelId));

  useEffect(() => DialStore.subscribe(panelId, () => {
    setPresets(DialStore.getPresets(panelId));
    setActiveId(DialStore.getActivePresetId(panelId));
  }), []);

  const handleAdd = () => {
    DialStore.savePreset(panelId, `Version ${presets.length + 2}`);
  };

  return (
    <PreviewBox>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button className="dialkit-toolbar-add" onClick={handleAdd} title="Add preset" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.6)' }}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <PresetManager panelId={panelId} presets={presets} activePresetId={activePresetId} onAdd={handleAdd} />
      </div>
      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        {presets.length === 0 ? 'Click + to add your first preset' : `${presets.length} preset${presets.length !== 1 ? 's' : ''} saved`}
      </p>
    </PreviewBox>
  );
}

export function ChoiceGridPreview() {
  const [style, setStyle] = useState('orbit');
  return (
    <PreviewBox>
      <ChoiceGrid
        label="Animation Style"
        value={style}
        onChange={setStyle}
        options={[
          { value: 'orbit', label: 'Orbit' },
          { value: 'pulse', label: 'Pulse' },
          { value: 'wave', label: 'Wave' },
          { value: 'spring', label: 'Spring' },
          { value: 'bounce', label: 'Bounce' },
          { value: 'figure8', label: 'Figure 8' },
          { value: 'scatter', label: 'Scatter' },
          { value: 'breathing', label: 'Breathing' },
        ]}
      />
    </PreviewBox>
  );
}

export function TabsPreview() {
  const [opacity, setOpacity] = useState(0.85);
  const [blur, setBlur] = useState(0.3);
  const [speed, setSpeed] = useState(0.4);
  const [bounce, setBounce] = useState(0.2);
  const [bg, setBg] = useState('#6366f1');
  const [fg, setFg] = useState('#ffffff');
  return (
    <PreviewBox>
      <Tabs
        tabs={[
          {
            id: 'layout',
            label: 'Layout',
            children: (
              <>
                <Slider label="Opacity" value={opacity} onChange={setOpacity} min={0} max={1} step={0.01} />
                <Slider label="Blur" value={blur} onChange={setBlur} min={0} max={1} step={0.01} />
              </>
            ),
          },
          {
            id: 'motion',
            label: 'Motion',
            children: (
              <>
                <Slider label="Speed" value={speed} onChange={setSpeed} min={0.1} max={2} step={0.05} />
                <Slider label="Bounce" value={bounce} onChange={setBounce} min={0} max={1} step={0.01} />
              </>
            ),
          },
          {
            id: 'colors',
            label: 'Colors',
            children: (
              <>
                <ColorControl label="Background" value={bg} onChange={setBg} />
                <ColorControl label="Foreground" value={fg} onChange={setFg} />
              </>
            ),
          },
        ]}
      />
    </PreviewBox>
  );
}
