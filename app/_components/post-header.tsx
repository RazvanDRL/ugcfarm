import { Badge } from "@/components/badge";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
import { type Author } from "@/interfaces/author";
import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
  tags: string[];
  excerpt: string;
};

export function PostHeader({ title, coverImage, date, author, excerpt, tags }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="my-8">
        <p className="text-muted-foreground text-base md:text-2xl font-[400]">{excerpt}</p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-row gap-2 md:gap-3 mb-1.5">
        {tags.map((tag) => (
          <Badge key={tag} text={tag} />
        ))}
        <div className="flex flex-row items-center gap-3">
          <Link href={`/author/arthur-luca`} className="w-6 h-6 relative rounded-full overflow-hidden cursor-pointer">
            <Image
              src={author.picture}
              alt={author.name + " profile picture"}
              className="rounded-full object-cover absolute"
              quality={50}
              fill
              priority
            />
          </Link>
          <Link href={`/author/arthur-luca`} className="text-muted-foreground text-sm hover:underline">{author.name}</Link>
          <p className="text-muted-foreground text-sm">•</p>
          <p className="text-muted-foreground text-sm">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="mt-8 mb-8 md:mb-16 sm:mx-0 w-full flex justify-center">
        <div className="w-full md:w-2/3 select-none">
          <Image
            src={coverImage}
            alt={title}
            width={672}
            height={378}
            className="w-full rounded-md"
          />
        </div>
      </div>
    </>
  );
}
