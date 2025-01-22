import { cn } from "@/lib/utils"
import Image from "next/image"
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
}

export function DemoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage }: PhotoListProps) {
    // Calculate pagination
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPhotos = photos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className={cn("grid grid-cols-5 grid-rows-1 gap-2", className)}>
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
                    <Image
                        src={photo.url}
                        alt={photo.alt}
                        className="w-full h-full object-cover aspect-[9/16]"
                        width={50}
                        height={50}
                    />
                </div>
            ))}
        </div>
    );
}
