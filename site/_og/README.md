# Link preview video

Remotion source for `public/og.mp4` (the `og:video` iMessage and Discord autoplay) and `public/og-video.png` (the homepage `og:image` still, frame 240 of the 6-second, 60 fps loop). Needs Node and ffmpeg.

```sh
cd site/_og && npm install && npm run render
```

`npm run studio` opens a live preview. `OgVideo.tsx` is the shared shell (color field, glass card, brand, headline) and takes its text and colors as props in `Root.tsx`; `HistoryCard.tsx` is the On Hand animation on the right. The app icon comes from `app/icon.svg`. The loop ends on its first frame, so keep the first and last frames identical when changing the timing.

This folder is in `.vercelignore` and excluded from the site's typecheck and lint, so none of it is built or deployed.
