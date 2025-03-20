'use client';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import creators from '@/creators.json';

interface ImageData {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
}

export default function TestPage() {
    const [open, setOpen] = useState(false);
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [images, setImages] = useState<ImageData[]>([]);
    const [selectedImageIndices, setSelectedImageIndices] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [scripts, setScripts] = useState<{ script_type: string, script: string }[]>([
        {
            "script_type": "Product Review",
            "script": "Am testat toate locațiile REM'S Coffee din Timișoara și Moșnița! De la cafeaua delicioasă din campus, până la atmosfera relaxantă din centru, REM'S e mereu o alegere bună. Locația mea preferată? Greu de zis! Fiecare are farmecul ei. 5 stele!"
        },
        {
            "script_type": "Three Benefits",
            "script": "3 motive să alegi REM'S Coffee: 1. Cafea proaspătă și aromată, perfectă pentru orice moment al zilei. 2. Locații multiple în Timișoara și Moșnița Nouă, ușor accesibile. 3. Atmosferă plăcută, ideală pentru studiu, muncă sau relaxare."
        },
        {
            "script_type": "Problem Solution",
            "script": "Te-ai săturat de cafeaua mediocră? REM'S Coffee are soluția! Cu locații în tot orașul (Aleea Studenților, Lucian Blaga, Iulius Mall, Moșnița Nouă), REM'S îți oferă cafeaua perfectă, exact când și unde ai nevoie."
        },
        {
            "script_type": "Target Audience",
            "script": "Ești student în Timișoara? Lucrezi în centru? Locuiești în Moșnița? REM'S Coffee e pentru tine! Cu locații în tot orașul, REM'S îți oferă cafeaua de care ai nevoie, indiferent de programul tău."
        },
        {
            "script_type": "Unique Selling Proposition",
            "script": "REM'S Coffee nu e doar o cafenea, e un stil de viață! Cu locații multiple în Timișoara și Moșnița Nouă, REM'S te așteaptă cu o cafea unică, preparată cu pasiune, și o atmosferă primitoare, oriunde te-ai afla."
        },
        {
            "script_type": "Call to Action",
            "script": "Găsește-ți locația REM'S Coffee preferată! Aleea Studenților, Lucian Blaga, Iulius Mall sau Moșnița Nouă? Oricare ar fi alegerea ta, te așteptăm cu o cafea delicioasă. Vino acum!"
        },
        {
            "script_type": "FOMO",
            "script": "Toată lumea vorbește despre noua cafea de la REM'S! Nu rata ocazia de a încerca și tu băuturile delicioase din locațiile noastre din Timișoara și Moșnița Nouă. Grăbește-te, oferta e limitată!"
        },
        {
            "script_type": "Attention Grabber",
            "script": "Cafea? REM'S! Oriunde ai fi în Timișoara sau Moșnița Nouă, REM'S Coffee e aproape de tine. Aleea Studenților, Lucian Blaga, Iulius Mall, strada Paulina... Te așteptăm!"
        }
    ]);
    const [selectedScript, setSelectedScript] = useState<number>(0);
    const [selectedCreator, setSelectedCreator] = useState<string>(Object.keys(creators)[0]);
    const [step, setStep] = useState<number>(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!websiteUrl) {
            toast.error('Please enter a valid URL');
            return;
        }

        try {
            const response = await fetch(`/api/ads/scrape`, {
                method: "POST",
                body: JSON.stringify({ url: websiteUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to scrape website');
            }


            const data = await response.json();
            setImages(data.images);
            setProductName(data.product_name);
            setProductDescription(data.product_description);

            setStep(2);
            setSuccess(true);
        } catch (error) {
            console.error("Error scraping website:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOnPaste = async (url: string) => {
        setLoading(true);

        try {
            const response = await fetch(`/api/ads/scrape`, {
                method: "POST",
                body: JSON.stringify({ url: url }),
            });
            const data = await response.json();
            setImages(data.images);
            setProductName(data.product_name);
            setProductDescription(data.product_description);

            // Initialize all images as selected
            const newSelectedIndices = new Set<number>();
            for (let i = 0; i < data.images.length; i++) {
                newSelectedIndices.add(i);
            }
            setSelectedImageIndices(newSelectedIndices);

            setSuccess(true);
            setStep(2);
        } catch (error) {
            console.error("Error scraping website:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const newImages: ImageData[] = Array.from(e.target.files).map(file => {
            const url = URL.createObjectURL(file);
            return {
                url,
                alt: file.name,
                // You could add code here to get width/height if needed
            };
        });

        // Update selected indices for the new images
        const currentLength = images.length;
        const newSelectedIndices = new Set(selectedImageIndices);
        for (let i = 0; i < newImages.length; i++) {
            newSelectedIndices.add(currentLength + i);
        }
        setSelectedImageIndices(newSelectedIndices);

        setImages(prev => [...prev, ...newImages]);
    };

    const toggleImageSelection = (index: number) => {
        const newSelectedIndices = new Set(selectedImageIndices);
        if (newSelectedIndices.has(index)) {
            newSelectedIndices.delete(index);
        } else {
            newSelectedIndices.add(index);
        }
        setSelectedImageIndices(newSelectedIndices);
    };

    const generateAds = async () => {
        try {
            // Only submit selected images
            const selectedImages = Array.from(selectedImageIndices).map(index => images[index]);

            const response = await fetch(`/api/ads/submit`, {
                method: "POST",
                body: JSON.stringify({
                    mediaUrls: selectedImages.map(image => image.url),
                    script: scripts[selectedScript].script,
                    creatorName: selectedCreator
                }),
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error generating ads:", error);
        };
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Button onClick={() => setOpen(true)} variant="default">
                Scrape Website
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[100vh] max-h-[80vh] overflow-y-auto p-0">
                    {step === 1 && (
                        <form onSubmit={handleSubmit} className="max-w-[300px] mx-auto p-10">
                            <div className="mb-4">
                                <div className="flex flex-col gap-2 items-center justify-center mb-8">
                                    <h1 className="text-2xl font-bold">AI Ads</h1>
                                    <p className="text-sm text-gray-500">Generate AI ads for your product</p>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="url"
                                        id="website"
                                        value={websiteUrl || ''}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        onPaste={async (e) => {
                                            e.preventDefault();
                                            const text = e.clipboardData.getData('text/plain');
                                            setWebsiteUrl(text);
                                            await handleSubmitOnPaste(text);
                                        }}
                                        disabled={loading}
                                        placeholder="Paste your product link here"
                                        className="w-full pr-10 font-[500] border-primary focus-visible:ring-primary"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="absolute right-0 top-0 h-full rounded-l-none"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="mt-4 grid grid-cols-2 gap-12 p-10">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold">Product Details</h2>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-[#1a1a1a]/50 font-[600] uppercase font-mono">Product Name</label>
                                    <Input type="text" className="w-full font-[500]" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-[#1a1a1a]/50 font-[600] uppercase font-mono">Product Description</label>
                                    <Textarea className="w-full font-[500]" rows={9} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                                </div>

                                <Button variant="outline" className="mt-auto" onClick={() => setStep(step - 1)} >&larr;&nbsp;&nbsp;Back</Button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h2 className="text-lg font-bold">Media</h2>
                                <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[50vh]">
                                    <div className="relative bg-gray-100 p-0.5 rounded-md flex items-center justify-center aspect-square cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            multiple
                                            onChange={handleFileUpload}
                                        />
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mb-2">
                                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                                                <line x1="16" y1="5" x2="22" y2="5"></line>
                                                <line x1="19" y1="2" x2="19" y2="8"></line>
                                                <circle cx="9" cy="9" r="2"></circle>
                                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                            </svg>
                                            <span className="text-xs font-medium">Import Media</span>
                                        </div>
                                    </div>

                                    {images && images.length > 0 && (
                                        <>
                                            {images.map((image: ImageData, index: number) => (
                                                <div key={index} className="relative bg-gray-100 p-0.5 rounded-md">
                                                    <img src={image.url} className="aspect-square object-cover w-full h-auto rounded-sm" alt={image.alt || ''} />
                                                    {image.width && image.height && (
                                                        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-[500] font-mono">
                                                            {image.width}×{image.height}
                                                        </div>
                                                    )}
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedImageIndices.has(index)}
                                                        onChange={() => toggleImageSelection(index)}
                                                        className="absolute top-2 right-2 h-4 w-4 rounded border-gray-300"
                                                    />
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <Button variant="default" className="mt-auto" onClick={() => setStep(3)}>Select your script&nbsp;&nbsp;&rarr;</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="relative">
                            <div className="mt-4 p-10">
                                <h2 className="text-xl font-bold mb-4">Select a Script</h2>
                                <div className="grid grid-cols-2 gap-6 p-2">
                                    {scripts.map((script: { script_type: string, script: string }, index: number) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col p-4 px-6 border rounded-lg shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] ${selectedScript === index
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                : "border-gray-200 bg-white/50"
                                                }`}
                                            onClick={() => setSelectedScript(index)}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-md font-bold select-none">{script.script_type}</h3>
                                                {selectedScript === index && (
                                                    <div className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                                                        Selected
                                                    </div>
                                                )}
                                            </div>
                                            <textarea
                                                style={{ border: 'none', outline: 'none' }}
                                                className={`text-sm font-[500] resize-none bg-transparent rounded-md p-2 ${selectedScript === index ? "text-[#1a1a1a]" : "text-[#1a1a1a]/80"
                                                    }`}
                                                rows={6}
                                                value={script.script}
                                                onChange={(e) => setScripts(prev => prev.map((s, i) => i === index ? { ...s, script: e.target.value } : s))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="sticky bottom-0 right-0 flex justify-between mt-6 bg-white px-12 p-6 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold"
                                >
                                    &larr;&nbsp;&nbsp;Back
                                </Button>
                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold"
                                    onClick={() => setStep(4)}
                                >
                                    Continue with selected script&nbsp;&nbsp;&rarr;
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="relative">
                            <div className="mt-4 p-10">
                                <h2 className="text-2xl font-bold mb-4">Select a Creator</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {Object.keys(creators).map((creator: string, index: number) => (
                                        <div key={index} className="flex flex-col gap-1">
                                            <div
                                                className="relative group hover:shadow-md transition-all duration-300 cursor-pointer bg-transparent"
                                                onClick={() => setSelectedCreator(creator)}
                                            >
                                                <video
                                                    src={creators[creator as keyof typeof creators].videoUrl}
                                                    poster={creators[creator as keyof typeof creators].imageUrl}
                                                    className={`w-full h-auto bg-transparent rounded-lg group-hover:shadow-md border-4 
                                                    ${selectedCreator === creator
                                                            ? 'border-primary'
                                                            : 'border-transparent group-hover:border-primary/50'} 
                                                    transition-all duration-300`}
                                                    preload="none"
                                                    muted
                                                    loop
                                                    playsInline
                                                    onMouseOver={(e) => e.currentTarget.play()}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.pause();
                                                        e.currentTarget.currentTime = 0;
                                                    }}
                                                />
                                                {selectedCreator === creator && (
                                                    <div className="lowercase absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-mono">
                                                        Selected
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-xl font-bold ${selectedCreator === creator ? 'text-primary' : 'text-gray-700'}`}>{creator.replace(/-\d+$/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="sticky bottom-0 right-0 flex justify-between mt-6 bg-white px-12 p-6 border-t border-200">
                                <Button
                                    variant="outline"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold"
                                    onClick={() => setStep(step - 1)}
                                >
                                    &larr;&nbsp;&nbsp;Back
                                </Button>
                                <Button
                                    variant="default"
                                    className="hover:scale-[1.05] transition-all duration-300 font-bold"
                                    onClick={async () => await generateAds()}
                                >
                                    Generate Ads&nbsp;&nbsp;&rarr;
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}