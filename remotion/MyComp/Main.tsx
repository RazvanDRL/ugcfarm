import { z } from "zod";
import {
  AbsoluteFill,
  OffthreadVideo,
  useVideoConfig,
  Sequence,
} from "remotion";
import { CompositionProps } from "../../types/constants";
import { preloadVideo, resolveRedirect } from "@remotion/preload";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import * as Montserrat from "@remotion/google-fonts/Montserrat";
import * as Inter from "@remotion/google-fonts/Inter";
Montserrat.loadFont();
Inter.loadFont();

const TheBoldFont = loadFont({
  family: "TheBoldFont",
  url: staticFile("fonts/TheBoldFont.woff2"),
  weight: "100 900",
  format: "woff2",
}).then(() => {
  console.log("TheBoldFont font loaded!");
});

const Komika = loadFont({
  family: "Komika",
  url: staticFile("fonts/Komika.woff2"),
  weight: "100 900",
  format: "woff2",
}).then(() => {
  console.log("Komika font loaded!");
});

const TikTok = loadFont({
  family: "TikTok",
  url: staticFile("fonts/TikTokText-Bold.ttf"),
  weight: "100 900",
}).then(() => {
  console.log("TikTok font loaded!");
});

// Define font families dictionary outside the component
const FONT_FAMILIES = {
  Montserrat: Montserrat.fontFamily,
  Inter: Inter.fontFamily,
  TheBoldFont: TheBoldFont,
  Komika: Komika,
  TikTok: TikTok,
} as const;

// Define type for font family keys
type FontFamilyKey = keyof typeof FONT_FAMILIES;

export const Main = ({ text, videoUrl, video_duration, hook_duration, videoProps, textStyle, demos }: z.infer<typeof CompositionProps>) => {
  const { width, height } = useVideoConfig();
  const {
    fontSize,
    fontWeight,
    fontFamily,
    textColor,
    strokeColor,
    shadowColor,
    uppercase,
    verticalAlignment,
  } = textStyle;

  // Remove the old fontFamilies object and use the constant
  const selectedFontFamily = FONT_FAMILIES[fontFamily as FontFamilyKey];

  // let urlToLoad = demos;

  // resolveRedirect(urlToLoad)
  //   .then((resolved) => {
  //     // Was able to resolve a redirect, setting this as the video to load
  //     urlToLoad = resolved;
  //   })
  //   .catch((err) => {
  //     // Was unable to resolve redirect e.g. due to no CORS support
  //     console.log("Could not resolve redirect", err);
  //   })
  //   .finally(() => {
  //     // In either case, we try to preload the original or resolved URL
  //     preloadVideo(urlToLoad);
  //   });

  const processedText = uppercase ? text.toUpperCase() : text;

  return (
    <AbsoluteFill>
      {/* Background Video */}
      <Sequence from={0} durationInFrames={hook_duration}>
        <OffthreadVideo
          src={videoUrl}
          style={{
            width,
            height,
            objectFit: "cover",
          }}
          pauseWhenBuffering
        />
        <AbsoluteFill
          style={{
            transform: `translateY(${100 - verticalAlignment}%)`,
            alignItems: "center",
            padding: "0 10rem",
          }}
        >
          <h1
            style={{
              fontSize: `${fontSize}px`,
              fontWeight,
              fontFamily: fontFamily,
              color: textColor,
              textAlign: "center",
              position: 'relative',
              textShadow: `0 8px 10px ${shadowColor}, 0 2px 2px ${shadowColor}`,
              zIndex: 1,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%',
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'block',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {processedText}
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  WebkitTextStroke: `0.5rem ${strokeColor}`,
                  color: 'transparent',
                  zIndex: -1,
                  textShadow: 'none',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {processedText}
              </span>
            </span>
          </h1>
        </AbsoluteFill>
      </Sequence>

      {/* Demo Video */}
      {demos && hook_duration && (
        <Sequence from={hook_duration} premountFor={hook_duration}>
          <OffthreadVideo
            src={demos.url}
            style={{
              width,
              height,
              objectFit: "cover",
            }}
            pauseWhenBuffering
          />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};