import Image from "next/image";

interface VideoPreviewProps {
    imageUrl: string;
    alt: string;
    rotation?: number;
    className?: string;
}

export function VideoPreview({ imageUrl, alt, rotation = 0, className = "" }: VideoPreviewProps) {
    return (
        <div
            className={`relative w-[164px] shrink-0 aspect-[9/16] cursor-pointer group/container ${className}`}
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            <div className="relative w-full h-full group/item hover:opacity-100 group-hover/container:opacity-50">
                <Image
                    alt={alt}
                    src={imageUrl}
                    fill
                    className="rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                </div>
            </div>
        </div>
    );
} 