import { z } from "zod";
import {
  AbsoluteFill,
  Video,
  OffthreadVideo,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "../../types/constants";
// import { loadFont } from "@remotion/google-fonts/Inter";

// const { fontFamily } = loadFont();

export const Main = ({ text, videoUrl, videoProps, textStyle }: z.infer<typeof CompositionProps>) => {
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

  console.log(textStyle)

  const processedText = uppercase ? text.toUpperCase() : text;

  return (
    <AbsoluteFill>
      {/* Background Video */}
      <OffthreadVideo
        src={videoUrl}
        style={{
          width,
          height,
          objectFit: "cover",
        }}
      />

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
