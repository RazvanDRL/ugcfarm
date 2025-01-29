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
    plan: string;
}

const vids = [
    {
        "id": 7,
        "url": "https://ugcfarm.b-cdn.net/avatars/007.mp4",
        "alt": "UGC Video 7"
    },
    {
        "id": 12,
        "url": "https://ugcfarm.b-cdn.net/avatars/012.mp4",
        "alt": "UGC Video 12"
    },
    {
        "id": 15,
        "url": "https://ugcfarm.b-cdn.net/avatars/015.mp4",
        "alt": "UGC Video 15"
    },
    {
        "id": 20,
        "url": "https://ugcfarm.b-cdn.net/avatars/020.mp4",
        "alt": "UGC Video 20"
    },
    {
        "id": 31,
        "url": "https://ugcfarm.b-cdn.net/avatars/031.mp4",
        "alt": "UGC Video 31"
    },
    {
        "id": 32,
        "url": "https://ugcfarm.b-cdn.net/avatars/032.mp4",
        "alt": "UGC Video 32"
    },
    {
        "id": 64,
        "url": "https://ugcfarm.b-cdn.net/avatars/064.mp4",
        "alt": "UGC Video 64"
    },
    {
        "id": 66,
        "url": "https://ugcfarm.b-cdn.net/avatars/066.mp4",
        "alt": "UGC Video 66"
    },
    {
        "id": 79,
        "url": "https://ugcfarm.b-cdn.net/avatars/079.mp4",
        "alt": "UGC Video 79"
    },
    {
        "id": 80,
        "url": "https://ugcfarm.b-cdn.net/avatars/080.mp4",
        "alt": "UGC Video 80"
    },
    {
        "id": 82,
        "url": "https://ugcfarm.b-cdn.net/avatars/082.mp4",
        "alt": "UGC Video 82"
    },
    {
        "id": 111,
        "url": "https://ugcfarm.b-cdn.net/avatars/111.mp4",
        "alt": "UGC Video 111"
    },
]


export function PhotoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage, plan }: PhotoListProps) {
    // Calculate pagination
    const itemsPerPage = 21;
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Create sets of video IDs for efficient lookup
    const vidIds = new Set(vids.map(vid => vid.id));

    // Split photos into two groups
    const matchingPhotos = photos.filter(photo => vidIds.has(photo.id));
    const remainingPhotos = photos.filter(photo => !vidIds.has(photo.id));

    // Combine the groups and paginate
    const sortedPhotos = [...matchingPhotos, ...remainingPhotos];
    const paginatedPhotos = sortedPhotos.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className={cn("grid grid-cols-7 grid-rows-3 gap-2", className)}>
            {paginatedPhotos.map((photo, index) => {
                const isLocked = currentPage > 1 || index > (plan === 'starter' ? 9 : 10);
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
                        <img
                            src={photo.url}
                            alt={photo.alt}
                            className="w-full h-full object-cover aspect-square"
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
