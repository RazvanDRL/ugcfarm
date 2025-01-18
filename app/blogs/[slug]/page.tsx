import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Add JSON-LD structured data
const generateJsonLd = (post: any) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
        "@type": "Person",
        name: post.author.name,
        url: `/author/${post.author.slug}`,
    },
    publisher: {
        "@type": "Organization",
        name: "UGC Farm",
        logo: {
            "@type": "ImageObject",
            url: "https://ugc.farm/logo.svg" // Replace with actual logo URL
        }
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://ugc.farm/blogs/${post.slug}`
    },
    keywords: post.tags.join(", "),
    articleBody: post.content,
});

export default async function Post(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || "");

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(post)) }}
            />
            <Navbar />
            <main className="pt-20">
                <Container>
                    {/* Add schema.org markup for breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="mt-24 md:mt-[8rem] mb-[2rem]">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/blogs">Blog Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="max-w-[18rem]">
                                    <BreadcrumbLink asChild>
                                        <Link
                                            href={`/blogs/${post.slug}`}
                                            className="font-medium line-clamp-1 text-primary hover:text-primary/90 hover:underline"
                                            aria-current="page">
                                            {post.title}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </nav>

                    <article
                        className="mb-[8rem]"
                        itemScope
                        itemType="https://schema.org/BlogPosting">
                        <PostHeader
                            title={post.title}
                            coverImage={post.coverImage}
                            date={post.date}
                            author={post.author}
                            excerpt={post.excerpt}
                            tags={post.tags}
                        />
                        <PostBody content={content} />
                    </article>
                </Container>
            </main>
            <Footer />
        </>
    );
}

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const title = `${post.title} | UGC Farm Blog`;
    const url = `https://ugc.farm/blogs/${post.slug}`;

    return {
        title,
        description: post.excerpt,
        authors: [{ name: post.author.name }],
        publisher: "UGC Farm",
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description: post.excerpt,
            url,
            type: "article",
            publishedTime: post.date,
            authors: [post.author.name],
            images: [
                {
                    url: post.ogImage.url,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            siteName: "UGC Farm Blog",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: post.excerpt,
            images: [post.ogImage.url],
        },
        keywords: [...post.tags, "UGC", "content creation", "digital marketing"],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}
