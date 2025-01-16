export function Badge({ text }: { text: string }) {
    return <div
        className="flex items-center justify-center text-xs md:text-sm bg-primary/10 text-primary border border-primary/30 px-1 md:px-3 py-0.5 md:py-1 rounded-full w-fit"
    >
        {text}
    </div>;
}
