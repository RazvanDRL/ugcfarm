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

export const Main = ({ text, videoUrl, video_duration, videoProps, textStyle, demos }: z.infer<typeof CompositionProps>) => {
  const { width, height } = useVideoConfig();
  const {
    fontSize,
    fontWeight,
    fontFamily,
    textColor,
    strokeColor,
    shadowColor,
    uppercase,
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
      <Sequence from={0} durationInFrames={video_duration}>
        <OffthreadVideo
          src={videoUrl}
          style={{
            width,
            height,
            objectFit: "cover",
          }}
          pauseWhenBuffering={true}
        />
      </Sequence>

      {/* Demo Video */}
      {demos && video_duration && (
        <Sequence from={video_duration - 150} premountFor={100}>
          <OffthreadVideo
            src={demos}
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          // pauseWhenBuffering={true}
          />
        </Sequence>
      )}

      {/* Text Overlay */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 2rem",
        }}
      >
        <h1
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            fontFamily: fontFamily,
            color: textColor,
            textAlign: "center",
            // WebkitTextStroke: `2px ${strokeColor}`,
            textShadow: `0 2px 4px ${shadowColor}`,
          }}
        >
          {processedText}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
