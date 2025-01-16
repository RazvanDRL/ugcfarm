import { getAllPosts } from "@/lib/api";
import { Post } from "@/interfaces/post";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: 'CopyCoach Blog - Copywriting Guides for Beginners',
  description: 'Discover actionable copywriting tactics for beginners. Go from overthinking to marketing clarity today.',
  openGraph: {
    title: 'UGC Farm Blog - Copywriting Guides for Beginners',
    description: 'Discover actionable copywriting tactics for beginners. Go from overthinking to marketing clarity today.',
    type: 'website',
    url: 'https://ugc-farm.com/blogs',
    images: [
      {
        url: '/opengraph-image.png', // Add your OG image path here
        width: 1200,
        height: 630,
        alt: 'UGC Farm Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UGC Farm Blog - Copywriting Guides for Beginners',
    description: 'Discover actionable copywriting tactics for beginners. Go from overthinking to marketing clarity today.',
    images: ['/opengraph-image.png'], // Add your Twitter card image path here
  },
};

export default function BlogsPage() {
  const allPosts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="pt-20 container mx-auto max-w-5xl min-h-screen px-8">
        <div className="mt-24 sm:mt-32 mb-16">
          <h1 className="text-5xl font-[900] mb-8 text-[#1A1A1A]">
            UGC Farm Blog:
            <br />
            Advice for creators
          </h1>
          <h3 className="text-muted-foreground text-2xl font-[400] mb-16">
            Discover advice for creators on how to make money from their content.
          </h3>

          <div className="flex flex-col gap-8">
            {allPosts.map((post: Post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="flex flex-col md:flex-row items-stretch gap-6 group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="relative aspect-[16/9] w-full md:w-[304px] flex-shrink-0">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                    priority
                    quality={100}
                  />
                </div>
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col gap-2">
                    {/* Badges */}
                    <div className="flex flex-row gap-3 mb-1.5">
                      {post.tags.map((tag) => (
                        <Badge key={tag} text={tag} />
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors text-[#1A1A1A] hover:underline">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>

                  {/* Author */}
                  <div className="flex flex-row items-center gap-3">
                    <div className="w-6 h-6 relative">
                      <Image
                        src={post.author.picture}
                        alt={post.author.name}
                        className="rounded-full object-cover absolute"
                        quality={100}
                        fill
                        priority
                      />
                    </div>
                    <p className="text-muted-foreground text-sm">{post.author.name}</p>
                    <p className="text-muted-foreground text-sm">•</p>
                    <p className="text-muted-foreground text-sm">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
