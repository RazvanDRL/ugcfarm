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
import { parseMedia } from '@remotion/media-parser';
import transformed_vids from '@/transformed_vids.json';

type STATE = 'QUEUED' | 'PROCESSING' | 'COMPLETE';


function decode(url: string) {
  return url.replace('/avatars/', '/b1f096cf-7297-4d47-83f8-ca478330fce1/8d8e77a3-1def-4221-9abb-1e8e5917db58/d478e4cc-54e0-4aa4-962c-de1591a49546/')
}


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

    if (!process.env.C_API_KEY) {
      throw new TypeError("The environment variable C_API_KEY is missing. Add it to your .env file.");
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

    const SITE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

    const videoIdMatch = body.inputProps.videoUrl.match(/\/avatars\/(\d+)\.mp4/);
    const videoId = videoIdMatch![1];

    if (body.inputProps.lip_sync) {
      const response = await fetch(`${SITE_URL}/api/lip-sync`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          video_url: body.inputProps.videoUrl,
          prompt: body.inputProps.text,
          voice: body.inputProps.voice
        })
      })

      const video_data = await response.json()

      const metadata = await parseMedia({
        src: video_data.url,
        acknowledgeRemotionLicense: true,
        fields: {
          slowDurationInSeconds: true,
        },
      });

      let hook_duration = Math.round(metadata.slowDurationInSeconds * 30)
      body.inputProps.video_duration = body.inputProps.video_duration - body.inputProps.hook_duration;
      body.inputProps.video_duration = body.inputProps.video_duration + hook_duration;
      body.inputProps.hook_duration = hook_duration
      body.inputProps.videoUrl = video_data.url
    } else if (Number.parseInt(videoId) >= 129) {
      const video = transformed_vids.find(v => v.url === body.inputProps.videoUrl);

      console.log(video)

      if (!video) {
        throw new TypeError('video not found');
      }

      // sumbit the creator
      const options = {
        method: 'POST',
        headers: { 'x-api-key': process.env.C_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: body.inputProps.text, creatorName: video?.name, resolution: '4k' })
      };

      const response = await fetch('https://api.captions.ai/api/creator/submit', options);
      const data = await response.json();

      const operationId = data.operationId;

      console.log(data);

      if (!operationId) {
        throw new TypeError('operationId not found');
      }

      // keep polling the creator until it's done
      let pollData;

      do {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const response = await fetch(`${SITE_URL}/api/creator/poll?operationId=${operationId}`);
        pollData = await response.json();

        console.log(pollData);

        if (pollData.state as STATE === 'COMPLETE') {
          body.inputProps.videoUrl = pollData.url;
          break;
        }

        if (pollData.state as STATE === 'PROCESSING') {
          console.log('processing')
        }

        if (pollData.state as STATE === 'QUEUED') {
          console.log('queued')
        }
      } while (true);

      // Recalculate video duration based on the new video
      const captionsMetadata = await parseMedia({
        src: body.inputProps.videoUrl,
        acknowledgeRemotionLicense: true,
        fields: {
          slowDurationInSeconds: true,
        },
      });

      let new_hook_duration = Math.round(captionsMetadata.slowDurationInSeconds * 30);
      body.inputProps.video_duration = body.inputProps.video_duration - body.inputProps.hook_duration;
      body.inputProps.video_duration = body.inputProps.video_duration + new_hook_duration;
      body.inputProps.hook_duration = new_hook_duration;
      body.inputProps.textStyle.fontSize *= 2;
    } else {
      body.inputProps.videoUrl = decode(body.inputProps.videoUrl);
    }

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
