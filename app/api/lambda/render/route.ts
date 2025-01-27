import {
  AwsRegion,
  RenderMediaOnLambdaOutput,
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
// import { deleteRender } from "@remotion/lambda";
import { DISK, RAM, REGION, SITE_NAME, TIMEOUT } from "../../../../config.mjs";
import { executeApi } from "../../../../helpers/api-response";
import { RenderRequest } from "../../../../types/schema";
import { supabase } from "@/lib/supabase/admin/supabase";


export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    if (
      !process.env.AWS_ACCESS_KEY_ID &&
      !process.env.REMOTION_AWS_ACCESS_KEY_ID
    ) {
      throw new TypeError(
        "Set up Remotion Lambda to render videos. See the README.md for how to do so."
      );
    }
    if (
      !process.env.AWS_SECRET_ACCESS_KEY &&
      !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ) {
      throw new TypeError(
        "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file."
      );
    }

    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
      throw new TypeError('unauthorized');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (!user || userError) {
      throw new TypeError('user not found');
    }

    // const { data: video, error: videoError } = await supabaseAdmin
    //   .from('metadata')
    //   .select('id,user_id')
    //   .eq('id', body.inputProps.video_id)
    //   .single();

    // if (!video || videoError) {
    //   throw new TypeError('video not found');
    // }

    // if (video.user_id !== user.id) {
    //   throw new TypeError('unauthorized user');
    // }

    // force width, force height from input props
    const result = await renderMediaOnLambda({
      codec: "h264",
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
      composition: body.id,
      inputProps: body.inputProps,
      downloadBehavior: {
        type: "download",
        fileName: "ugc_farm_video.mp4",
      },
      timeoutInMilliseconds: 1000 * 60 * 5,
      privacy: "public",
      logLevel: "verbose",
      // deleteAfter: "1-day",
      // scale: 1,
      outName: {
        key: `${user.id}/${body.inputProps.videoProps.uuid}.mp4`,
        bucketName: "output-bucket",
        s3OutputProvider: {
          endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
          accessKeyId: process.env.CLOUDFLARE_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_AWS_SECRET_ACCESS_KEY!,
        }
      }
    });

    // const { freedBytes } = await deleteRender({
    //   bucketName: result.bucketName,
    //   region: "us-east-1",
    //   renderId: result.renderId,
    // });

    // console.log(`Freed ${freedBytes} bytes`);



    return result;
  }
);
