import { Composition } from "remotion";
// import { parseMedia } from '@remotion/media-parser';
import { Main } from "./MyComp/Main";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { getVideoMetadata } from "@remotion/media-utils";


export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
        // calculateMetadata={async ({ props }) => {
        //   const { slowDurationInSeconds } = await parseMedia({
        //     src: props.videoUrl,
        //     fields: { slowDurationInSeconds: true },
        //   });

        //   return {
        //     durationInFrames: Math.floor(slowDurationInSeconds * 30),
        //   };
        // }}
        calculateMetadata={async ({ props }) => {
          const data = await getVideoMetadata(props.videoUrl);
          return {
            fps: VIDEO_FPS,
            durationInFrames: props.video_duration,
            width: data.width,
            height: data.height,
          };
        }}
      />
    </>
  );
};
