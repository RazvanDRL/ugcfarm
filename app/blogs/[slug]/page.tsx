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

export default async function Post(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || "");

    return (
        <>
            <Navbar />
            <main className="pt-20">
                <Container>
                    {/* Breadcrumb */}
                    <Breadcrumb className="mt-24 md:mt-[8rem] mb-[2rem]">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/blogs">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem className="max-w-[18rem]">
                                <BreadcrumbLink asChild>
                                    <Link
                                        href={`/blogs/${post.slug}`}
                                        className="font-medium line-clamp-1 text-primary hover:text-primary/90 hover:underline">
                                        {post.title}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Post */}
                    <article className="mb-[8rem]">
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

    const title = `${post.title} | CopyCoach Blog`;

    return {
        title,
        description: post.excerpt,
        alternates: {
            canonical: `/blogs/${post.slug}`,
        },
        openGraph: {
            title,
            images: [post.ogImage.url],
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}
