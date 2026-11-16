import {loadFont as loadDisplay} from '@remotion/google-fonts/BarlowSemiCondensed';
import {loadFont as loadBody} from '@remotion/google-fonts/Barlow';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {HistoryCard} from './HistoryCard';

loadDisplay('normal', {weights: ['300', '600'], subsets: ['latin']});
loadBody('normal', {weights: ['400', '500', '600'], subsets: ['latin']});

export type OgVideoProps = {
  name: string;
  icon: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  // The app's pilot light. Colour appears only in lights and readings.
  accent: string;
};

export const DISPLAY = '"Barlow Semi Condensed", "Helvetica Neue", system-ui, sans-serif';
export const BODY = 'Barlow, "Helvetica Neue", system-ui, sans-serif';
export const SYS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, system-ui, sans-serif';
export const INK = '#161616';
export const INK_2 = '#3d3f41';
export const SUB = '#66686a';

const BRUSH =
  'repeating-linear-gradient(0deg, rgba(255,255,255,.22) 0 1px, rgba(0,0,0,.035) 1px 2px, transparent 2px 3px), repeating-linear-gradient(0deg, rgba(0,0,0,.035) 0 1px, transparent 1px 7px), linear-gradient(100deg, rgba(255,255,255,0) 18%, rgba(255,255,255,.5) 40%, rgba(255,255,255,0) 64%), linear-gradient(180deg, #e7e8e9, #c3c5c7)';

const Screw = ({left, top}: {left: number; top: number}) => (
  <div
    style={{position: 'absolute', left, top, width: 12, height: 12, borderRadius: '50%',
      background: 'radial-gradient(circle at 40% 35%, #fff, #b9bbbd 45%, #77797b 80%)'}}
  />
);

// The family shell on Brushed: aluminium fascia, brand and headline on the left, the app on a black mount on the right.
export const OgVideo = (props: OgVideoProps) => (
  <AbsoluteFill style={{background: BRUSH, color: INK, fontFamily: BODY, WebkitFontSmoothing: 'antialiased'}}>
    <div style={{position: 'absolute', left: 84, top: 92, width: 540, height: 446, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: DISPLAY, fontSize: 40, fontWeight: 600}}>
        <Img src={staticFile(props.icon)} style={{width: 76, height: 76}} />
        {props.name}
      </div>
      <div style={{fontFamily: DISPLAY, fontSize: 100, lineHeight: 0.95}}>
        <div style={{fontWeight: 600}}>{props.headline}</div>
        <div style={{fontWeight: 300}}>{props.headlineAccent}</div>
      </div>
      <div style={{fontSize: 26, color: INK_2}}>
        {props.sub}
      </div>
    </div>
    <div
      style={{position: 'absolute', left: 664, top: 80, width: 460, height: 470, borderRadius: 16, background: '#1b1b1b', boxShadow: '0 0 0 1px rgba(0,0,0,.5)',
        backgroundImage: 'radial-gradient(rgba(255,255,255,.045) 1px, transparent 1.3px)', backgroundSize: '5px 5px'}}
    >
      <Screw left={14} top={14} />
      <Screw left={434} top={14} />
      <Screw left={14} top={444} />
      <Screw left={434} top={444} />
      <div style={{position: 'absolute', left: 34, top: 34, right: 34, bottom: 34}}>
        <HistoryCard accent={props.accent} />
      </div>
    </div>
  </AbsoluteFill>
);
