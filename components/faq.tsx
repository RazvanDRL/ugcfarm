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
    // Features & Capabilities
    {
        category: "Features & Capabilities",
        question: "Does UGC.FARM help with TikTok hooks and scripts?",
        answer: "Absolutely! Our Viral Hook Generator (available in ALL plans) creates attention-grabbing hooks based on proven formulas."
    },
    {
        category: "Features & Capabilities",
        question: "Can I schedule my Reels content through UGC.FARM?",
        answer: "Yes! Growth & Scale plan members get access to our Auto-Publishing feature, which automatically posts your content at optimal times for maximum engagement. This includes analytics to track performance and optimize future content."
    },
    // Technical Details
    {
        category: "Technical Details",
        question: "What do I need to get started with UGC.FARM?",
        answer: "Just a simple product demo video (10-30 seconds) shot on your phone and your target audience details. That's it! Our platform handles all the AI magic - no technical skills needed. One demo video can be turned into dozens of unique content pieces."
    },
    {
        category: "Technical Details",
        question: "Is it hard to film a demo of my product?",
        answer: "Not at all! Just grab your phone and show your product in action for 10-30 seconds. No fancy equipment or professional editing needed. Actually, simple, authentic demos perform better than over-produced videos because they feel more real and relatable to viewers."
    },
    {
        category: "Technical Details",
        question: "Can I use the same product demo multiple times?",
        answer: "Absolutely! That's the beauty of our platform. Film your product once, then use that same demo with different AI-generated hooks to create endless fresh content. Work smarter, not harder."
    },
    {
        category: "Technical Details",
        question: "What if I'm not good at filming?",
        answer: "Trust me, if you can take a selfie, you can film your product demo. Just show your product naturally, like you'd show it to a friend. The rawer and more authentic it feels, the better it performs. No Hollywood skills required!"
    },
    {
        category: "Technical Details",
        question: "Do I need any special equipment?",
        answer: "Nope! Your smartphone is all you need. The latest phones actually shoot better video than expensive cameras from just a few years ago. Keep it simple and authentic - that's what converts best on social media anyway."
    },
    // Business Questions
    {
        category: "Business Questions",
        question: "Is UGC.FARM suitable for my industry?",
        answer: "Our AI has been trained across multiple industries including e-commerce, SaaS, services, and physical products. If you're selling online and need engaging Reels content, UGC.FARM is perfect for you."
    },
    {
        category: "Business Questions",
        question: "How does early access pricing work?",
        answer: "Early access members lock in our launch pricing forever. Once we exit early access, prices will increase significantly. This is a limited-time opportunity to secure the lowest possible rates."
    },
    {
        category: "Business Questions",
        question: "What's the minimum commitment period?",
        answer: "There are no long-term commitments. You pay for what you need, when you need it."
    },
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