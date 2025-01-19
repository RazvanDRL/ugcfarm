"use client"
import { PhotoList } from "@/components/videos"
import { useState } from "react"

export default function Page() {
    const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(1)
    const photos = [
        { id: 1, url: "http://localhost:3000/homepage/previews/1.webp", alt: "Photo 1" },
        { id: 2, url: "http://localhost:3000/homepage/previews/2.webp", alt: "Photo 2" },
        { id: 3, url: "http://localhost:3000/homepage/previews/3.webp", alt: "Photo 3" },
        { id: 4, url: "http://localhost:3000/homepage/previews/4.webp", alt: "Photo 4" },
        { id: 5, url: "http://localhost:3000/homepage/previews/5.webp", alt: "Photo 5" },
    ]

    const onPhotoSelect = (id: number) => {
        setSelectedPhotoId(id)
    }

    return (
        <div className="min-h-screen bg-primary/10 mx-auto flex flex-col items-center justify-center">
            <PhotoList
                photos={photos}
                selectedPhotoId={selectedPhotoId}
                onPhotoSelect={onPhotoSelect}
            />
        </div>
    )
}
