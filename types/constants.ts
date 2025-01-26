import { z } from "zod";

export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  text: z.string(),
  videoUrl: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  text: "Your text here",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};

export const DURATION_IN_FRAMES = 150;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
