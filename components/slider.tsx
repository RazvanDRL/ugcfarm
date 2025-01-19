import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKeyPress } from "@/hooks/useKeyPress"
import { cn } from "@/lib/utils"

interface WordSliderProps {
    sentences: string[]
    nextButton: () => void
    previousButton: () => void
    onTextChange: (text: string) => void
    index: number
    className?: string
}

export function WordSlider({ sentences, className, nextButton, previousButton, index, onTextChange }: WordSliderProps) {
    useKeyPress([
        { key: 'ArrowRight', callback: () => nextButton?.() },
        { key: 'ArrowLeft', callback: () => previousButton?.() }
    ])

    return (
        <div className={cn("flex flex-col", className)}>
            <div className="self-end mb-2 text-right mr-2">
                <label className="text-sm font-[500] text-[#1a1a1a]/60">
                    {index + 1}/{sentences.length}
                </label>
            </div>
            <div className="flex flex-row items-center bg-primary p-4 rounded-lg w-[500px]">
                <Button variant="ghost" onClick={previousButton} className="text-white">
                    <ChevronLeftIcon className="w-6 h-6" />
                </Button>
                <input
                    type="text"
                    value={sentences[index ?? 0]}
                    onChange={(e) => onTextChange?.(e.target.value)}
                    className="text-base text-white font-[500] flex-1 text-center bg-transparent focus:outline-none"
                />
                <Button variant="ghost" onClick={nextButton} className="text-white">
                    <ChevronRightIcon className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}
