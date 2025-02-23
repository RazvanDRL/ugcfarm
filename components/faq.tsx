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
        category: "Getting Started",
        question: "Is this a subscription?",
        answer: "No, this is a one-time payment. You pay for what you need, when you need it. You can top-up your account with more videos at any time."
    },
    // Getting Started
    {
        category: "Getting Started",
        question: "How does UGC.FARM generate Reels content?",
        answer: "Our AI technology analyzes thousands of high-performing Reel videos to generate scroll-stopping hooks specifically for your brand. Each hook is crafted using proven patterns that drive engagement and conversions."
    },
    {
        category: "Getting Started",
        question: "What makes UGC.FARM different from traditional UGC creators?",
        answer: "Unlike traditional UGC creators who charge from $1500/month with 3-5 days wait times, UGC.FARM generates professional content instantly at a fraction of the cost. Our AI-powered platform ensures consistent quality and unlimited revisions without the hassle of managing creators."
    },
    {
        category: "Getting Started",
        question: "Can I see examples of UGC.FARM videos?",
        answer: "Yes! Check out our demo section to see real examples of AI-generated UGC videos across different industries and niches. Each example showcases our platform's capability to create authentic, converting content."
    },
    // Business Questions
    {
        category: "Business Questions",
        question: "How is UGC.Farm different from reel.farm and other UGC automation tools?",
        answer: "While platforms like reel.farm focus primarily on TikTok automation, UGC.Farm was built specifically for store owners who need to drive website traffic across multiple platforms."
    }
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