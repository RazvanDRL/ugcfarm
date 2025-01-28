import { z } from "zod";
import {
  AbsoluteFill,
  OffthreadVideo,
  useVideoConfig,
  Sequence,
} from "remotion";
import { CompositionProps } from "../../types/constants";
// import { preloadVideo, resolveRedirect } from "@remotion/preload";
// import { loadFont } from "@remotion/google-fonts/Inter";

// const { fontFamily } = loadFont();

export const Main = ({ text, videoUrl, videoProps, textStyle, demos }: z.infer<typeof CompositionProps>) => {
  const { width, height } = useVideoConfig();
  const {
    fontSize,
    fontWeight,
    fontFamily: selectedFont,
    textColor,
    strokeColor,
    shadowColor,
    uppercase,
  } = textStyle;

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
  const ugcDuration = 150; // 5 seconds at 30fps

  return (
    <AbsoluteFill>
      {/* Background Video */}
      <Sequence from={0} durationInFrames={ugcDuration}>
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
      {/* <Sequence from={ugcDuration} premountFor={100}>
        <OffthreadVideo
          src={demos}
          style={{
            width,
            height,
            objectFit: "cover",
          }}
          pauseWhenBuffering={true}

        />
      </Sequence> */}

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
            // fontFamily: selectedFont === "Inter" ? fontFamily : selectedFont,
            color: textColor,
            textAlign: "center",
            WebkitTextStroke: `2px ${strokeColor}`,
            textShadow: `0 2px 4px ${shadowColor}`,
          }}
        >
          {processedText}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
