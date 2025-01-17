"use client"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function FAQPage() {
    return (
        <>
            <Navbar />
            <main className="max-w-3xl mx-auto min-h-[80vh] flex flex-col items-center justify-center space-y-8">
                <h1 className="text-4xl md:text-5xl font-[900] text-[#1a1a1a] text-center">
                    Frequently Asked Questions
                </h1>
                <FAQ />
            </main>
            <Footer />
        </>
    )
}