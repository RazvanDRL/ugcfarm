import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { supabase } from '@/lib/supabase/client/supabase';
import { getSignedUrl } from '@/hooks/use-signed-url';

interface Photo {
    id: number;
    url: string;
    alt: string;
}

const generateThumbnail = async (videoFile: File): Promise<File | undefined> => {
    console.log('generateThumbnail', videoFile);
    try {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            video.autoplay = false;
            video.muted = true;
            video.src = URL.createObjectURL(videoFile);

            console.log('video.src', video.src);

            video.onloadeddata = () => {
                // Seek to 1 second or video duration if shorter
                const seekTime = Math.min(1, video.duration);
                video.currentTime = seekTime;
            };

            video.onseeked = () => {
                // Set canvas size to a web-optimized resolution
                // 9:16 aspect ratio with 720p max height
                const height = 320;
                const width = 180;

                canvas.width = width;
                canvas.height = height;

                // Enable image smoothing for better quality
                if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(video, 0, 0, width, height);
                }

                // Convert canvas to file with optimized settings
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const thumbnailFile = new File([blob], 'thumbnail.webp', {
                                type: 'image/webp'
                            });
                            URL.revokeObjectURL(video.src);
                            resolve(thumbnailFile);
                        } else {
                            resolve(undefined);
                        }
                    },
                    'image/webp', // Using WebP for better compression and quality
                    0.5 // Slightly higher quality for better visual fidelity
                );
            };
        });
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        return undefined;
    }
};

export const useUpload = (token: string, photos: Photo[]) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const filename = uuidv4();

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        try {
            // Generate thumbnail from video
            console.log('generateThumbnail', file);
            const thumbnail = await generateThumbnail(file);
            console.log('thumbnail', thumbnail);
            // Get signed URL for video
            const videoResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    filename: filename + ".mp4",
                    fileSize: file.size,
                    fileType: file.type,
                }),
            });

            if (!videoResponse.ok) {
                const error = await videoResponse.json();
                throw new Error(error.error || 'Failed to get upload URL');
            }

            const { url: videoUrl, key: videoKey } = await videoResponse.json();

            // Upload video to R2
            const uploadResponse = await axios.put(videoUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                },
            });

            if (uploadResponse.status !== 200) {
                throw new Error('Failed to upload video');
            }

            let thumbnailKey;
            if (thumbnail) {
                // Get signed URL for thumbnail
                const thumbnailResponse = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        filename: filename + "-thumb.webp",
                        fileSize: thumbnail.size,
                        fileType: thumbnail.type,
                    }),
                });

                if (!thumbnailResponse.ok) {
                    const errorData = await thumbnailResponse.json().catch(() => ({}));
                    throw new Error(
                        `Failed to get thumbnail upload URL. Status: ${thumbnailResponse.status}. ${errorData.error || errorData.message || ''
                            }`.trim()
                    );
                }

                const { url: thumbUrl, key: thumbKey } = await thumbnailResponse.json();
                thumbnailKey = thumbKey;

                // Upload thumbnail to R2
                const thumbnailUploadResponse = await axios.put(thumbUrl, thumbnail, {
                    headers: {
                        'Content-Type': thumbnail.type,
                    },
                });

                if (thumbnailUploadResponse.status !== 200) {
                    throw new Error('Failed to upload thumbnail');
                }
            }

            const { data: { user }, error: userError } = await supabase.auth.getUser(token);

            if (userError || !user) {
                throw new Error('Unauthorized');
            }

            // Insert demo with thumbnail
            const { data: demos, error: demosError } = await supabase
                .from('user_demos')
                .insert({
                    user_id: user.id,
                    key: videoKey,
                });

            if (demosError) {
                throw new Error('Failed to insert demo');
            }

            const thumbnailUrl = await getSignedUrl(thumbnailKey.split('/')[1], 'upload-bucket', token);

            if (thumbnailUrl) {
                photos.push({
                    id: photos.length + 1,
                    url: thumbnailUrl,
                    alt: `Thumbnail ${photos.length + 1}`
                });
            }

            toast.success('Files uploaded successfully');


            // Add a slight delay before refreshing to ensure the toast is visible
            setTimeout(() => {
                window.location.reload();
            }, 1500);


            return { videoKey, thumbnailKey };
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload files');
            throw error;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return {
        uploadFile,
        isUploading,
        uploadProgress,
    };
}; 