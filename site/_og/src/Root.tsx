import {Composition} from 'remotion';
import {OgVideo, type OgVideoProps} from './OgVideo';

// 6 s at 60 fps. Frame 240 (4 s) is the resting frame, rendered as the og:image still.
export const RemotionRoot = () => (
  <Composition
    id="OgVideo"
    component={OgVideo}
    durationInFrames={360}
    fps={60}
    width={1200}
    height={630}
    defaultProps={
      {
        name: 'On Hand',
        icon: 'icon.svg',
        headline: 'Copy it once.',
        headlineAccent: 'Find it again.',
        sub: 'Free for macOS · onhandformac.com',
        accent: '#4a6283',
        accentInk: '#375880',
        accentFill: 'rgba(0,113,227,0.11)',
        field: ['#aecdf6', '#d2c9ee', '#a3cdff', '#c7bfe8'],
      } satisfies OgVideoProps
    }
  />
);
