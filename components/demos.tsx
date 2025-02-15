import { cn } from "@/lib/utils"
import { CirclePlus, Loader2 } from "lucide-react";
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useUpload } from "@/hooks/use-upload";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase/client/supabase";
import { getSignedUrl } from "@/hooks/use-signed-url";

interface Photo {
    id: number;
    url: string;
    alt: string;
}

interface PhotoListProps {
    photos: Photo[];
    selectedPhotoId: number | null;
    onPhotoSelect: (id: number) => void;
    className?: string;
    currentPage: number;
    token: string;
    onDemosUpdate: (demos: Photo[], demoVideos: string[]) => void;
}

export function DemoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage, token, onDemosUpdate }: PhotoListProps) {
    const fetchDemos = useCallback(async () => {
        if (!token) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let tempDemos: any[] = [];
        let tempDemoVideos: string[] = [];

        const { data: demos, error: demosError } = await supabase
            .from('user_demos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (demosError) {
            toast.error('Failed to fetch demos');
            return;
        }

        for (const [index, demo] of demos.entries()) {
            tempDemoVideos.push(demo.key.split('/')[1]);
            const url = await getSignedUrl(
                demo.key.split('/')[1].replace('.mp4', '') + '-thumb.webp',
                'upload-bucket',
                token
            );

            tempDemos.push({
                id: index + 1,
                url: url,
                alt: `Demo ${index + 1}`
            });
        }

        // Call the callback with the new demos
        onDemosUpdate(tempDemos, tempDemoVideos);
    }, [token, onDemosUpdate, onPhotoSelect]);

    const { uploadFile, isUploading, uploadProgress } = useUpload({
        token,
        photos,
        onUploadSuccess: fetchDemos
    });

    // Calculate pagination
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPhotos = photos.slice(startIndex, startIndex + itemsPerPage);

    // Add skeleton videos when photos array is empty
    const skeletonVideos = Array.from({ length: 3 }).map((_, index) => (
        <div
            key={`skeleton-${index}`}
            className="max-w-[50px] h-[89px] relative rounded-lg overflow-hidden bg-[#A4A4A4]/10 animate-pulse"
        >
            <div className="w-full h-full aspect-[9/16]" />
        </div>
    ));

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast.error('Please upload a video file');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            toast.error('File size should be less than 100MB');
            return;
        }

        try {
            await uploadFile(file);
            // The fetchDemos callback will handle the selection
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={cn("grid grid-cols-6 grid-rows-1 gap-2", className)}>

            {paginatedPhotos.map((photo) => (
                <div
                    key={photo.id}
                    className={cn(
                        "max-w-[50px] relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
                        "hover:ring-2 hover:ring-primary/50",
                        selectedPhotoId === photo.id
                            ? "ring-2 ring-primary"
                            : "opacity-50"
                    )}
                    onClick={() => onPhotoSelect(photo.id)}
                >
                    <img
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover aspect-[9/16]"
                        draggable={false}
                    />
                </div>
            ))}
            {/* Upload Button */}
            <label className={cn(
                "flex flex-col bg-[#A4A4A4]/10 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary/50 items-center transition-all duration-200 justify-center",
                "w-[50px] aspect-[9/16]",
                isUploading && "cursor-not-allowed"
            )}>
                <Input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".mp4"
                    disabled={isUploading}
                />
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-2 rounded-full flex items-center justify-center">
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {uploadProgress > 0 && (
                                    <span className="text-xs font-semibold mt-1">{uploadProgress}%</span>
                                )}
                            </div>
                        ) : (
                            <CirclePlus className="w-5 h-5 opacity-50" />
                        )}
                    </div>
                </div>
            </label>
        </div>
    );
}

