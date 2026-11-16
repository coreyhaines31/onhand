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
        accent: '#b43a9e',
      } satisfies OgVideoProps
    }
  />
);
