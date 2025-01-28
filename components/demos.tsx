import { cn } from "@/lib/utils"
import { CirclePlus, Loader2 } from "lucide-react";
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useUpload } from "@/hooks/use-upload";

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
}

export function DemoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage, token }: PhotoListProps) {
    const { uploadFile, isUploading, uploadProgress } = useUpload(token, photos);
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

        // Check file type
        if (!file.type.startsWith('video/')) {
            toast.error('Please upload a video file');
            return;
        }

        // Check file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
            toast.error('File size should be less than 100MB');
            return;
        }

        try {
            const key = await uploadFile(file);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={cn("grid grid-cols-6 grid-rows-1 gap-2", className)}>
            {photos.length === 0 ? (
                <>
                    {/* {skeletonVideos} */}
                    {/* Upload Button */}
                    <label className={cn(
                        "flex flex-col bg-[#A4A4A4]/10 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary/50 items-center transition-all duration-200 justify-center w-full h-full",
                        isUploading && "cursor-not-allowed opacity-50"
                    )}>
                        <Input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".mp4"
                            disabled={isUploading}
                        />
                        <div className="text-sm font-[500] opacity-50 flex flex-col items-center gap-1">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploadProgress > 0 && (
                                        <span className="text-xs font-semibold mt-1">{uploadProgress}%</span>
                                    )}
                                </div>
                            ) : (
                                <CirclePlus className="w-5 h-5" />
                            )}
                        </div>
                    </label>
                </>
            ) : (
                <>
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
                            />
                        </div>
                    ))}
                    {/* Upload Button */}
                    <label className={cn(
                        "flex flex-col bg-[#A4A4A4]/10 rounded-lg cursor-pointer hover:ring-2 hover:ring-primary/50 items-center transition-all duration-200 justify-center w-full h-full",
                        isUploading && "cursor-not-allowed opacity-50"
                    )}>
                        <Input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".mp4"
                            disabled={isUploading}
                        />
                        <div className="text-sm font-[500] opacity-50 flex flex-col items-center gap-1">
                            {isUploading ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {uploadProgress > 0 && (
                                        <span className="text-xs font-semibold mt-1">{uploadProgress}%</span>
                                    )}
                                </div>
                            ) : (
                                <CirclePlus className="w-5 h-5" />
                            )}
                        </div>
                    </label>
                </>
            )}
        </div>
    );
}

