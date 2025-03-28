import { cn } from "@/lib/utils"
import Image from "next/image";
import { Clock, Lock } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { sleep } from "openai/core.mjs";
import { vids, c_vids } from "@/constants";

interface Photo {
    id: number;
    url: string;
    alt: string;
    name?: string;
}

interface PhotoListProps {
    photos: Photo[];
    selectedPhotoId: number | null;
    onPhotoSelect: (id: number) => void;
    className?: string;
    currentPage: number;
    plan: string;
}

export function PhotoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage, plan }: PhotoListProps) {
    const itemsPerPage = 21;
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Create sets of video IDs for efficient lookup
    const cVidIds = new Set(c_vids.map(vid => vid.id));
    const vidIds = new Set(vids.map(vid => vid.id));

    // Split photos into three groups
    const matchingCVids = photos.filter(photo => cVidIds.has(photo.id));
    const matchingVids = photos.filter(photo => vidIds.has(photo.id) && !cVidIds.has(photo.id));
    const remainingPhotos = photos.filter(photo => !vidIds.has(photo.id) && !cVidIds.has(photo.id));

    // Combine the groups and paginate
    const sortedPhotos = [...matchingCVids, ...matchingVids, ...remainingPhotos];
    const paginatedPhotos = sortedPhotos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className={cn("grid grid-cols-7 grid-rows-3 gap-2", className)}>
            {paginatedPhotos.map((photo, index) => {
                const absoluteIndex = startIndex + index;
                const isLocked = plan === 'starter' ?
                    absoluteIndex > 9 || currentPage > 1 :
                    plan === 'creator' ?
                        absoluteIndex > 333 || currentPage > 16 :
                        absoluteIndex > 9 || currentPage > 3;

                const PhotoElement = (
                    <div
                        key={photo.id}
                        className={cn(
                            "max-w-[50px] relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
                            "hover:ring-2 hover:ring-primary/50",
                            selectedPhotoId === photo.id
                                ? "ring-2 ring-primary"
                                : "opacity-50",
                            isLocked && "cursor-not-allowed grayscale"
                        )}
                        onClick={() => !isLocked && onPhotoSelect(photo.id)}
                    >
                        <Image
                            src={photo.url}
                            alt={photo.alt}
                            className="w-full h-full object-cover aspect-square"
                            draggable={false}
                            width={100}
                            height={100}
                        />
                        {isLocked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                {
                                    plan === 'starter' ?
                                        <Lock className="w-4 h-4 text-white" />
                                        :
                                        <Clock className="w-4 h-4 text-white" />
                                }
                            </div>
                        )}
                    </div>
                );

                return isLocked ? (
                    <TooltipProvider key={photo.id}>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild
                                onClick={async (event) => {
                                    event.preventDefault();
                                    const target = event.currentTarget;
                                    await sleep(0);
                                    target.blur();
                                    target.focus();
                                }}>
                                {PhotoElement}
                            </TooltipTrigger>
                            <TooltipContent>
                                {
                                    plan === 'starter' ?
                                        <Link href="/#pricing" className="underline">Upgrade to unlock &rarr;</Link>
                                        :
                                        <p>Coming soon...</p>
                                }
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : PhotoElement;
            })}
        </div>
    );
}
