import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, INK_2} from './OgVideo';

// On Hand's history panel: four copies land on top and push the list down, the selection walks down to a
// message copied two hours ago, it's pasted, then the new clips fold away so the loop ends where it starts.
type Kind = 'link' | 'code' | 'image' | 'address' | 'text';
type Clip = {kind: Kind; text: string; source: string; age: string};

const NEW: Clip[] = [
  {kind: 'link', text: 'developer.apple.com/design', source: 'Safari', age: 'Just now'},
  {kind: 'code', text: 'let smallThings = makeSomethingUseful()', source: 'Xcode', age: 'Just now'},
  {kind: 'image', text: 'Order #4021 · Ships Thursday', source: 'Screenshot', age: 'Just now'},
  {kind: 'address', text: '1450 Harbor Lane, Suite 4', source: 'Maps', age: 'Just now'},
];
const OLD: Clip[] = [
  {kind: 'text', text: 'Meet at the little coffee shop on the corner. Thursday, 10:30.', source: 'Messages', age: '2h ago'},
  {kind: 'text', text: 'Good tools get out of your way.', source: 'Notes', age: 'Yesterday'},
  {kind: 'link', text: 'apple.com/macos', source: 'Safari', age: 'Yesterday'},
  {kind: 'text', text: 'Thanks again for Thursday!', source: 'Mail', age: 'Yesterday'},
  {kind: 'text', text: 'Invoice 2291 is attached.', source: 'Mail', age: 'Mon'},
];
const ARRIVALS = [0.25, 0.75, 1.25, 1.75];
const ROW = 58;
const ROWS = 5;
const PICK = NEW.length; // the 2-hour-old message, once all four new clips sit above it

const STANDARD = Easing.bezier(0.4, 0, 0.2, 1);
const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const OUT_EASE = Easing.bezier(0, 0, 0.2, 1);

const Glyph = ({kind, color}: {kind: Kind; color: string}) => {
  const paths: Record<Exclude<Kind, 'image'>, string> = {
    link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
    address: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    text: 'M21 6H3 M15 12H3 M17 18H3',
  };
  if (kind === 'image') {
    return (
      <div style={{width: 40, height: 40, borderRadius: 8, background: '#f4f4f6', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', padding: '8px 6px', boxSizing: 'border-box'}}>
        <div style={{height: 8, borderRadius: 2, background: '#8fb4e6', width: 22}} />
        <div style={{height: 3, borderRadius: 2, background: '#c7c7cc', width: 26, marginTop: 5}} />
        <div style={{height: 3, borderRadius: 2, background: '#c7c7cc', width: 18, marginTop: 4}} />
      </div>
    );
  }
  return (
    <div style={{width: 40, height: 40, borderRadius: 8, background: '#eef3fc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[kind]} />
      </svg>
    </div>
  );
};

const Row = ({clip, y, opacity, check}: {clip: Clip; y: number; opacity: number; check: number}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, height: ROW, display: 'flex', alignItems: 'center', gap: 14, padding: '0 10px', opacity}}>
    <div style={{position: 'relative', width: 40, height: 40, flexShrink: 0}}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - Math.min(1, check * 2)}}>
        <Glyph kind={clip.kind} color="#3478d4" />
      </div>
      {check > 0.001 && (
        <div style={{position: 'absolute', inset: 0, opacity: check, transform: `scale(${0.7 + 0.3 * check})`, borderRadius: 8, background: '#0071e3', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
    </div>
    <div style={{minWidth: 0, flex: 1}}>
      <div style={{fontSize: 19, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em'}}>{clip.text}</div>
      <div style={{fontSize: 15, color: INK_2, marginTop: 2}}>
        {clip.source} · {clip.age}
      </div>
    </div>
  </div>
);

export const HistoryCard = ({accentInk, accentFill}: {accentInk: string; accentFill: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ease = (input: number[], output: number[], easing: (n: number) => number) =>
    interpolate(t, input, output, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

  // 0.25–2.2s four copies land · 2.3s selection appears · 2.5–3.1s walks down · 3.15s pasted · hold to 4.75s · 4.75–5.95s reset
  const reset = ease([4.75, 5.95], [0, 1], IN_OUT);
  const landed = ARRIVALS.map((at) => ease([at, at + 0.45], [0, 1], STANDARD));
  const pushed = landed.reduce((sum, p) => sum + p, 0);
  // The reset scrolls the whole list up by the four new rows, so nothing ever stacks on top of anything else.
  const scroll = reset * NEW.length * ROW;

  const selShow = ease([2.3, 2.5], [0, 1], STANDARD) * ease([4.75, 4.95], [1, 0], STANDARD);
  const selRow = ease([2.5, 3.1], [0, PICK], IN_OUT);
  const press = spring({frame: frame - Math.round(3.12 * fps), fps, config: {damping: 12, stiffness: 220}});
  const pressScale = 1 - 0.03 * Math.sin(Math.PI * Math.min(1, press));
  const check = ease([3.15, 3.35], [0, 1], STANDARD) * ease([4.75, 4.95], [1, 0], STANDARD);

  // Footer swaps overlap only briefly, so the two lines never sit on top of each other at half opacity.
  const pastedIn = ease([3.25, 3.5], [0, 1], OUT_EASE);
  const pasted = pastedIn * ease([4.75, 4.93], [1, 0], STANDARD);
  const keeping = 1 - ease([3.1, 3.28], [0, 1], STANDARD) + ease([4.9, 5.1], [0, 1], STANDARD);

  return (
    <div
      style={{width: '100%', height: '100%', boxSizing: 'border-box', padding: '24px 22px', borderRadius: 30, background: 'rgba(251,251,253,0.9)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.05), 0 16px 36px rgba(35,50,80,0.12)'}}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 10px'}}>
        <svg width={24} height={24} viewBox="0 0 64 64" fill="none" stroke="#6e6e73" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
          <path transform="rotate(40 32 32)" d="M23 47V20a9 9 0 0 1 18 0v25a6.5 6.5 0 0 1-13 0V24a4 4 0 0 1 8 0v15" />
        </svg>
        <div style={{fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: INK}}>History</div>
        <div style={{marginLeft: 'auto', fontSize: 17, color: '#8e8e93'}}>⌘⇧Space</div>
      </div>
      <div style={{height: 1, background: 'rgba(0,0,0,0.07)', margin: '12px 0 6px'}} />
      <div
        style={{position: 'relative', height: ROW * ROWS, overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(transparent, #000 8px, #000 calc(100% - 8px), transparent)'}}
      >
        <div
          style={{position: 'absolute', left: 0, right: 0, top: selRow * ROW + 2, height: ROW - 4, borderRadius: 10, background: accentFill,
            opacity: selShow, transform: `scale(${pressScale})`}}
        />
        {NEW.map((clip, k) => {
          const above = landed.slice(k + 1).reduce((sum, p) => sum + p, 0);
          const p = landed[k];
          return p > 0.001 ? (
            <Row key={clip.text} clip={clip} y={(above + p - 1) * ROW - scroll} opacity={p * (1 - reset)} check={0} />
          ) : null;
        })}
        {OLD.map((clip, m) => (
          <Row key={clip.text} clip={clip} y={(m + pushed) * ROW - scroll} opacity={1} check={m === 0 ? check : 0} />
        ))}
      </div>
      <div style={{position: 'relative', height: 44, marginTop: 16, padding: '0 10px'}}>
        <div style={{position: 'absolute', left: 10, top: 6, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: '#8e8e93', opacity: keeping}}>
          Keeping what you copy…
        </div>
        <div style={{position: 'absolute', left: 10, top: 2, whiteSpace: 'nowrap', fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', color: accentInk,
          opacity: pasted, transform: `translateY(${(1 - pastedIn) * 8}px)`}}>
          Pasted <span style={{color: INK_2, fontWeight: 600}}>· from 2 hours ago</span>
        </div>
      </div>
    </div>
  );
};
