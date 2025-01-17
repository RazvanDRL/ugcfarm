import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
    question: string
    answer: string
}

const faq: FAQ[] = [
    {
        question: "How does UGC Farm generate Reels content?",
        answer: "Our AI technology analyzes thousands of high-performing TikTok videos to generate scroll-stopping content specifically for your brand. Each video is crafted using proven patterns that drive engagement and conversions."
    },
    {
        question: "How many Reels can I generate?",
        answer: "You can generate up to 100 Reels per month. If you need more, you can upgrade to a higher plan."
    },
    {
        question: "How long does it take to generate a Reel?",
        answer: "It takes 1-2 minutes to generate a Reel. You can generate up to 100 Reels per month."
    }
]

export function FAQ() {
    return (
        <div className="w-full px-8">
            <Accordion type="single" collapsible className="w-full">
                {
                    faq.map((item, index) => (
                        <AccordionItem key={index} value={item.question}>
                            <AccordionTrigger className="text-lg font-bold text-[#1a1a1a]/90">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base font-semibold text-[#1a1a1a]/60">{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion >
        </div>
    )
}