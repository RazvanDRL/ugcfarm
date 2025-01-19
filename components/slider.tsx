import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKeyPress } from "@/hooks/useKeyPress"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

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
        { key: 'ArrowRight', callback: () => nextButton(), shift: true },
        { key: 'ArrowLeft', callback: () => previousButton(), shift: true }
    ])

    return (
        <div className={cn("flex flex-col w-full font-mono", className)}>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    onClick={previousButton}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </Button>
                <Textarea
                    value={sentences[index ?? 0]}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="min-h-[100px] bg-background text-base resize-none"
                    placeholder="e.g. Here's 5 hooks for you"
                />
                <Button
                    variant="ghost"
                    onClick={nextButton}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </Button>
            </div>
        </div>
    )
}
