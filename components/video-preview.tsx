import Image from "next/image";
import { useState } from "react";

interface VideoPreviewProps {
    imageUrl: string;
    videoUrl: string;
    alt: string;
    rotation?: number;
    className?: string;
}

export function VideoPreview({ imageUrl, videoUrl, alt, rotation = 0, className = "" }: VideoPreviewProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className={`relative w-[164px] shrink-0 aspect-[9/16] cursor-pointer overflow-hidden ${className}`}
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={handleClick}
        >
            {isPlaying ? (
                <video
                    src={videoUrl}
                    className="rounded-2xl border-4 border-white shadow-lg object-cover w-full h-full"
                    autoPlay
                    controls
                    playsInline
                    muted
                    onClick={(e) => e.stopPropagation()}
                    onEnded={() => setIsPlaying(false)}
                />
            ) : (
                <div className="relative w-full h-full group/item transition-all duration-300 ease-in-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-2xl z-10" />

                    <img
                        alt={alt}
                        src={imageUrl}
                        className="rounded-2xl border-4 border-white shadow-lg object-cover w-full h-full transition-transform duration-500 ease-out group-hover/item:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        {/* Play button circle with glow effect */}
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.7)] transform group-hover/item:scale-110">
                            {/* Triangle play icon */}
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary border-b-[8px] border-b-transparent ml-1" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 