import { z } from "zod";
import {
  AbsoluteFill,
  Video,
  OffthreadVideo,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "../../types/constants";
// import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

// loadFont();

export const Main = ({ text, videoUrl }: z.infer<typeof CompositionProps>) => {
  const { width, height } = useVideoConfig();

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
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
