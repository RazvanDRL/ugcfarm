import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export const faq: FAQ[] = [
    {
        category: "Business Questions",
        question: "I'm already spending a lot on ads. How will this actually save me money?",
        answer: "Traditional UGC can cost hundreds of dollars per video, and you're often stuck with what you get. With UGC.Farm, you pay only for the videos you use, and you have complete control over the creative process. Many of our users see a significant drop in their cost-per-click (CPC) and a better return on their ad spend. Think of it as getting more, higher-quality content for a fraction of the cost."
    },
    {
        category: "Product Questions",
        question: "AI-generated videos...will they look fake or robotic? My brand is important to me.",
        answer: "We understand! That's why we use cutting-edge AI technology to create realistic, engaging videos. You can see examples on our site - we're confident you'll be impressed. Plus, you can always tweak the script and choose or create the model that best fits your brand."
    },
    {
        category: "Getting Started",
        question: "I'm not a video editor. How easy is this to actually use?",
        answer: "It's designed to be super simple. You don't need any video editing skills. It's basically a few clicks: drop the link to the product you want to promote, choose the model, and generate your video. We've had users create dozens of videos in minutes."
    },
    {
        category: "Product Questions",
        question: "What if I don't like the video? Am I stuck with it?",
        answer: "Absolutely not! You have complete control. You can regenerate videos with different models, products, or hooks until you're happy."
    },
    {
        category: "Product Questions",
        question: "How does the \"try-on\" feature work? Do I need professional photos of my products?",
        answer: "You don't need professional photos. A clear image of your product (even a simple one taken with your phone) is usually enough. The AI will realistically \"dress\" the model in your clothing."
    },
    {
        category: "Business Questions",
        question: "How does this compare to other AI video tools?",
        answer: "Many other tools are either focused on general video creation or require significant editing. UGC.Farm is specifically designed for online stores looking to create content, quickly and affordably. On top of that, we're the only ones that let you showcase the product you're selling. Paste a link to it and AI will do the work!"
    },
    {
        category: "Getting Started",
        question: "Is this a subscription?",
        answer: "No, this is a one-time payment. You pay for what you need, when you need it. You can top-up your account with more videos at any time."
    },
];

export function FAQ() {
    // const categories = Array.from(new Set(faq.map(item => item.category)));

    return (
        <div className="w-full px-8">
            <Accordion type="single" collapsible className="w-full">
                {faq
                    .map((item, index) => (
                        <AccordionItem key={index} value={`${item.question}`}>
                            <AccordionTrigger className="text-lg font-bold text-[#1a1a1a]/90">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base font-semibold text-[#1a1a1a]/60">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </div>
    );
}