import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoaderCircle className="animate-spin text-primary" size={32} />
        </div>
    )
}