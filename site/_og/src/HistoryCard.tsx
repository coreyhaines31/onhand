import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {INK, SUB, SYS} from './OgVideo';

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
const ROW = 52;
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
      <div style={{width: 34, height: 34, borderRadius: 7, background: 'repeating-linear-gradient(135deg, #a9abad 0 5px, #cdcfd0 5px 10px)'}} />
    );
  }
  return (
    <div style={{width: 34, height: 34, boxSizing: 'border-box', borderRadius: 7, background: 'linear-gradient(180deg, #f7f7f7, #d9dadb)', border: '1px solid #9c9ea0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[kind]} />
      </svg>
    </div>
  );
};

const Row = ({clip, y, opacity, check}: {clip: Clip; y: number; opacity: number; check: number}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, height: ROW, display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px', opacity}}>
    <div style={{position: 'relative', width: 34, height: 34, flexShrink: 0}}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - Math.min(1, check * 2)}}>
        <Glyph kind={clip.kind} color="#2c2c2d" />
      </div>
      {check > 0.001 && (
        <div style={{position: 'absolute', inset: 0, opacity: check, transform: `scale(${0.7 + 0.3 * check})`, borderRadius: 7, background: '#1b1b1b', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
    </div>
    <div style={{minWidth: 0, flex: 1}}>
      <div style={{fontSize: 17, fontWeight: 600, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{clip.text}</div>
      <div style={{fontSize: 14, color: SUB, marginTop: 1}}>
        {clip.source} · {clip.age}
      </div>
    </div>
  </div>
);

export const HistoryCard = ({accent}: {accent: string}) => {
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
      style={{width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 14, background: '#eeeeed', overflow: 'hidden', fontFamily: SYS, color: INK,
        boxShadow: '0 18px 40px rgba(0,0,0,.32), 0 2px 6px rgba(0,0,0,.14), 0 0 0 .5px rgba(0,0,0,.35)'}}
    >
      <div
        style={{display: 'flex', alignItems: 'center', gap: 10, height: 58, padding: '0 18px', borderBottom: '1px solid rgba(0,0,0,.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.55)',
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,.22) 0 1px, rgba(0,0,0,.035) 1px 2px, transparent 2px 3px), linear-gradient(100deg, rgba(255,255,255,0) 18%, rgba(255,255,255,.5) 40%, rgba(255,255,255,0) 64%), linear-gradient(180deg, #e7e8e9, #c3c5c7)'}}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 9, background: '#1b1b1b', color: '#d8d9da', padding: '7px 12px 7px 10px', borderRadius: 2,
          fontFamily: '"Barlow Semi Condensed", sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '0.26em'}}>
          <span style={{width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`}} />
          HISTORY
        </div>
        <div style={{marginLeft: 'auto', fontSize: 16, color: '#3d3f41'}}>⌘⇧Space</div>
      </div>
      <div
        style={{position: 'relative', height: ROW * ROWS, overflow: 'hidden', margin: '8px 10px 0',
          WebkitMaskImage: 'linear-gradient(transparent, #000 8px, #000 calc(100% - 8px), transparent)'}}
      >
        <div
          style={{position: 'absolute', left: 0, right: 0, top: selRow * ROW + 2, height: ROW - 4, borderRadius: 7, background: '#f8f8f7', boxShadow: 'inset 0 0 0 1px #c9cacb',
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
      <div style={{position: 'relative', height: 54, marginTop: 8, borderTop: '1px solid #dcdcdb'}}>
        <div style={{position: 'absolute', left: 20, top: 13, fontSize: 21, fontWeight: 600, color: SUB, opacity: keeping}}>
          Keeping what you copy…
        </div>
        <div style={{position: 'absolute', left: 20, top: 10, whiteSpace: 'nowrap', fontSize: 24, fontWeight: 700, color: INK,
          opacity: pasted, transform: `translateY(${(1 - pastedIn) * 8}px)`}}>
          Pasted <span style={{color: SUB, fontWeight: 600}}>· from 2 hours ago</span>
        </div>
      </div>
    </div>
  );
};
