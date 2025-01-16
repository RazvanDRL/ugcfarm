import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, ChartArea, Clock, Share2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedBeamMultipleOutputDemo } from "@/components/animated-beam";
import { AnimatedListDemo } from "@/components/animated-list";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";

const hooks = [
    {
        name: "Hook 1",
        body: "Watch this before your next oil change",
    },
    {
        name: "Hook 2",
        body: "The Amazon hack saving shoppers thousands",
    },
    {
        name: "Hook 3",
        body: "Why you're wearing the wrong size",
    },
    {
        name: "Hook 4",
        body: "How I made $1K from one Instagram caption",
    },
    {
        name: "Hook 5",
        body: "Why your protein shake isn't working",
    },
    {
        name: "Hook 6",
        body: "Why doesn’t anyone talk about",
    },
];

const features = [
    {
        Icon: FileTextIcon,
        name: "100+ Viral Hooks",
        description: "Generate scroll stopping content",
        href: "#pricing",
        cta: "Start now",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Marquee
                pauseOnHover
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] "
            >
                {hooks.map((f, idx) => (
                    <figure
                        key={idx}
                        className={cn(
                            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
                        )}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex flex-col">
                                <figcaption className="text-sm font-medium dark:text-white ">
                                    {f.name}
                                </figcaption>
                            </div>
                        </div>
                        <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                    </figure>
                ))}
            </Marquee>
        ),
    },
    {
        Icon: ChartArea,
        name: "Analytics",
        description: "See how your content performs.",
        href: "#pricing",
        cta: "Start now",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: Clock,
        name: "Auto-publish",
        description: "Never miss a video again.",
        href: "#pricing",
        cta: "Start now",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: CalendarIcon,
        name: "Schedule",
        description: "Schedule your content to be published at the best time.",
        className: "col-span-3 lg:col-span-1",
        href: "#pricing",
        cta: "Start now",
        background: (
            <Calendar
                mode="single"
                selected={new Date(2022, 4, 11, 0, 0, 0)}
                className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
            />
        ),
    },
];

export default function Bento() {
    return (
        <div className="w-full pt-20">
            <h2 className="text-5xl font-[900] text-[#1a1a1a] text-center mb-8">
                Features
            </h2>            <BentoGrid className="w-full">
                {features.map((feature, idx) => (
                    <BentoCard key={idx} {...feature} />
                ))}
            </BentoGrid>
        </div>
    );
}
