import { cn } from "@/lib/utils";

interface OptionsProps {
    label: string | React.ReactNode;
    options: string[];
    onOptionChange: (option: string) => void;
    className?: string;
    selectedOption?: string;
    disabled?: boolean;
}

export default function Options({ label, options, onOptionChange, className, selectedOption, disabled }: OptionsProps) {
    return (
        <div className={cn("flex flex-col gap-2 max-w-xl", className)}>
            <p className="text-sm font-mono text-muted-foreground uppercase">{label}{selectedOption === '' && <span className="text-primary">&nbsp;-&nbsp;None</span>}</p>
            <div className="flex flex-row flex-wrap gap-3 font-mono">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onOptionChange(option)}
                        disabled={disabled}
                        aria-disabled={disabled}
                        className={cn(
                            "w-fit lowercase text-sm px-3 py-1 rounded-md font-medium transition-all duration-200",
                            !disabled && "hover:scale-105 hover:bg-primary/10 hover:text-primary",
                            selectedOption === option
                                ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
                            "aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    )
}