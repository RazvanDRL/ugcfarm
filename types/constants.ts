import { z } from "zod";

export const COMP_NAME = "Main";

export const CompositionProps = z.object({
  text: z.string(),
  videoUrl: z.string(),
  video_duration: z.number(),
  hook_duration: z.number(),
  videoProps: z.object({
    uuid: z.string(),
  }),
  textStyle: z.object({
    fontSize: z.number().default(36),
    fontWeight: z.number().default(500),
    fontFamily: z.string().default("Inter"),
    textColor: z.string().default("#ffffff"),
    strokeColor: z.string().default("#000000"),
    shadowColor: z.string().default("#000000"),
    uppercase: z.boolean().default(false),
    verticalAlignment: z.number().default(50),
  }),
  demos: z.object({
    url: z.string().default(""),
    duration: z.number().default(0)
  }).nullable()
});

export const defaultMyCompProps = {
  text: "Your text here",
  videoUrl: "",
  video_duration: 5,
  hook_duration: 5,
  videoProps: {
    uuid: "",
  },
  textStyle: {
    fontSize: 36,
    fontWeight: 500,
    fontFamily: "Inter",
    textColor: "#ffffff",
    strokeColor: "#000000",
    shadowColor: "#000000",
    uppercase: false,
    verticalAlignment: 50,
  },
  demos: null
};

export const DURATION_IN_FRAMES = 150;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
