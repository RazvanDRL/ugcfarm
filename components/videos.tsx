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
        id: 20,
        url: "https://ugcfarm.b-cdn.net/avatars/020.mp4",
        alt: "UGC Video 020",
        duration: 2.2,
    }, {
        id: 36,
        url: "https://ugcfarm.b-cdn.net/avatars/036.mp4",
        alt: "UGC Video 036",
        duration: 2.433333,
    }, {
        id: 32,
        url: "https://ugcfarm.b-cdn.net/avatars/032.mp4",
        alt: "UGC Video 032",
        duration: 3,
    }, {
        id: 31,
        url: "https://ugcfarm.b-cdn.net/avatars/031.mp4",
        alt: "UGC Video 031",
        duration: 3.1,
    }, {
        id: 18,
        url: "https://ugcfarm.b-cdn.net/avatars/018.mp4",
        alt: "UGC Video 018",
        duration: 3.9,
    }, {
        id: 80,
        url: "https://ugcfarm.b-cdn.net/avatars/080.mp4",
        alt: "UGC Video 080",
        duration: 3,
    }, {
        id: 82,
        url: "https://ugcfarm.b-cdn.net/avatars/082.mp4",
        alt: "UGC Video 082",
        duration: 3.4,
    }, {
        id: 79,
        url: "https://ugcfarm.b-cdn.net/avatars/079.mp4",
        alt: "UGC Video 079",
        duration: 5.1,
    }, {
        id: 116,
        url: "https://ugcfarm.b-cdn.net/avatars/116.mp4",
        alt: "UGC Video 116",
        duration: 3,
    }, {
        id: 117,
        url: "https://ugcfarm.b-cdn.net/avatars/117.mp4",
        alt: "UGC Video 117",
        duration: 4,
    }, {
        id: 101,
        url: "https://ugcfarm.b-cdn.net/avatars/101.mp4",
        alt: "UGC Video 101",
        duration: 2.6,
    }, {
        id: 115,
        url: "https://ugcfarm.b-cdn.net/avatars/115.mp4",
        alt: "UGC Video 115",
        duration: 2.666667,
    }, {
        id: 114,
        url: "https://ugcfarm.b-cdn.net/avatars/114.mp4",
        alt: "UGC Video 114",
        duration: 3.1,
    }, {
        id: 64,
        url: "https://ugcfarm.b-cdn.net/avatars/064.mp4",
        alt: "UGC Video 064",
        duration: 3.733333,
    }, {
        id: 111,
        url: "https://ugcfarm.b-cdn.net/avatars/111.mp4",
        alt: "UGC Video 111",
        duration: 4.233333,
    }, {
        id: 113,
        url: "https://ugcfarm.b-cdn.net/avatars/113.mp4",
        alt: "UGC Video 113",
        duration: 3.1,
    }, {
        id: 112,
        url: "https://ugcfarm.b-cdn.net/avatars/112.mp4",
        alt: "UGC Video 112",
        duration: 3.033333,
    }, {
        id: 66,
        url: "https://ugcfarm.b-cdn.net/avatars/066.mp4",
        alt: "UGC Video 066",
        duration: 3.833333,
    }, {
        id: 15,
        url: "https://ugcfarm.b-cdn.net/avatars/015.mp4",
        alt: "UGC Video 015",
        duration: 2.866667,
    }, {
        id: 3,
        url: "https://ugcfarm.b-cdn.net/avatars/003.mp4",
        alt: "UGC Video 003",
        duration: 3.033333,
    }, {
        id: 17,
        url: "https://ugcfarm.b-cdn.net/avatars/017.mp4",
        alt: "UGC Video 017",
        duration: 2.733333,
    }, {
        id: 7,
        url: "https://ugcfarm.b-cdn.net/avatars/007.mp4",
        alt: "UGC Video 007",
        duration: 5.1,
    }, {
        id: 12,
        url: "https://ugcfarm.b-cdn.net/avatars/012.mp4",
        alt: "UGC Video 012",
        duration: 2.766667,
    }, {
        id: 10,
        url: "https://ugcfarm.b-cdn.net/avatars/010.mp4",
        alt: "UGC Video 010",
        duration: 2.2,
    }, {
        id: 118,
        url: "https://ugcfarm.b-cdn.net/avatars/grasu_1.mp4",
        alt: "UGC Video grasu_1",
        duration: 5,
    }, {
        id: 119,
        url: "https://ugcfarm.b-cdn.net/avatars/grasu_2.mp4",
        alt: "UGC Video grasu_2",
        duration: 4,
    }, {
        id: 120,
        url: "https://ugcfarm.b-cdn.net/avatars/grasu_3.mp4",
        alt: "UGC Video grasu_3",
        duration: 3,
    }, {
        id: 121,
        url: "https://ugcfarm.b-cdn.net/avatars/grasu_4.mp4",
        alt: "UGC Video grasu_4",
        duration: 4,
    },
    {
        id: 123,
        url: "https://ugcfarm.b-cdn.net/avatars/123.mp4",
        alt: "UGC Video 123",
        duration: 2.833333,
    }, {
        id: 122,
        url: "https://ugcfarm.b-cdn.net/avatars/122.mp4",
        alt: "UGC Video 122",
        duration: 3.033333,
    }, {
        id: 125,
        url: "https://ugcfarm.b-cdn.net/avatars/125.mp4",
        alt: "UGC Video 125",
        duration: 2.533333,
    }, {
        id: 124,
        url: "https://ugcfarm.b-cdn.net/avatars/124.mp4",
        alt: "UGC Video 124",
        duration: 2.733333,
    }, {
        id: 126,
        url: "https://ugcfarm.b-cdn.net/avatars/126.mp4",
        alt: "UGC Video 126",
        duration: 2.1,
    }, {
        id: 127,
        url: "https://ugcfarm.b-cdn.net/avatars/127.mp4",
        alt: "UGC Video 127",
        duration: 2.233333,
    }, {
        id: 128,
        url: "https://ugcfarm.b-cdn.net/avatars/128.mp4",
        alt: "UGC Video 128",
        duration: 2.1,
    }
]

export function PhotoList({ photos, selectedPhotoId, onPhotoSelect, className, currentPage, plan }: PhotoListProps) {
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
                const absoluteIndex = startIndex + index;
                const isLocked = plan === 'starter' ?
                    absoluteIndex > 9 || currentPage > 1 :
                    plan === 'creator' ?
                        absoluteIndex > 33 || currentPage > 2 :
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
