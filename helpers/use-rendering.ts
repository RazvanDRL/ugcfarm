import { z } from "zod";
import { useCallback, useMemo, useState } from "react";
import { getProgress, renderVideo } from "../lambda/api";
import { CompositionProps } from "../types/constants";

export type State =
  | {
    status: "init";
  }
  | {
    status: "invoking";
  }
  | {
    renderId: string;
    bucketName: string;
    progress: number;
    status: "rendering";
  }
  | {
    renderId: string | null;
    status: "error";
    error: Error;
  }
  | {
    url: string;
    size: number;
    status: "done";
  };

const wait = async (milliSeconds: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliSeconds);
  });
};

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>,
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });
  const [token, setToken] = useState<string>("");

  const setTokenHandler = useCallback((newToken: string) => {
    setToken(newToken);
  }, []);

  const renderMedia = useCallback(async () => {
    if (!token) {
      throw new Error("No token provided");
    }
    setState({
      status: "invoking",
    });
    try {
      const { renderId, bucketName } = await renderVideo({ id, inputProps, token: token });
      setState({
        status: "rendering",
        progress: 0,
        renderId: renderId,
        bucketName: bucketName,
      });

      let pending = true;

      while (pending) {
        const result = await getProgress({
          id: renderId,
          bucketName: bucketName,
        });
        switch (result.type) {
          case "error": {
            setState({
              status: "error",
              renderId: renderId,
              error: new Error(result.message),
            });
            pending = false;
            break;
          }
          case "done": {
            setState({
              size: result.size,
              url: result.url,
              status: "done",
            });
            pending = false;
            break;
          }
          case "progress": {
            setState({
              status: "rendering",
              bucketName: bucketName,
              progress: result.progress,
              renderId: renderId,
            });
            await wait(1000);
          }
        }
      }
    } catch (err) {
      setState({
        status: "error",
        error: err as Error,
        renderId: null,
      });
    }
  }, [id, inputProps, token]);

  const undo = useCallback(() => {
    setState({ status: "init" });
  }, []);

  const checkRenderStatus = useCallback(async (renderId: string, bucketName: string) => {
    try {
      setState({
        status: "rendering",
        progress: 0,
        renderId: renderId,
        bucketName: bucketName,
      });

      let pending = true;

      while (pending) {
        const result = await getProgress({
          id: renderId,
          bucketName: bucketName,
        });

        switch (result.type) {
          case "error": {
            setState({
              status: "error",
              renderId: renderId,
              error: new Error(result.message),
            });
            pending = false;
            break;
          }
          case "done": {
            setState({
              size: result.size,
              url: result.url,
              status: "done",
            });
            pending = false;
            break;
          }
          case "progress": {
            setState({
              status: "rendering",
              bucketName: bucketName,
              progress: result.progress,
              renderId: renderId,
            });
            await wait(1000);
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error checking render status:", err);
      setState({
        status: "error",
        error: err as Error,
        renderId: null,
      });
    }
  }, []);

  return useMemo(() => {
    return {
      renderMedia,
      state,
      undo,
      token,
      setToken: setTokenHandler,
      checkRenderStatus,
    };
  }, [renderMedia, state, undo, setTokenHandler, checkRenderStatus]);
};
