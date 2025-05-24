import { Card, CardHeader, CardBody, CardFooter} from "@heroui/card"
import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";
import { Chip } from "@heroui/chip"
import NextLink from "next/link"
import { useLocale } from 'next-intl';
import { uuidToId } from "notion-utils";
import type { PostMetadata } from "@/types/content";
import { formatDate } from "@/lib/format";

export function ArticleCard({
    article,
    linkParam = 'slug',
    showTime = false
}: {
    article: PostMetadata;
    linkParam?: 'slug' | 'id' | 'notionid';
    showTime?: boolean;
}) {
    const locale = useLocale();
    const href = `/article/${
        linkParam === 'slug' && article.slug ? article.slug :
        linkParam === 'notionid' && article.notionid ? uuidToId(article.notionid) :
        article.id
    }`;

    const AuthorAndDate = ({ className = "" }) => (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            {article.author?.[0] && (
                <>
                    {article.author[0].avatar && (
                        <Avatar
                            src={article.author[0].avatar}
                            alt={article.author[0].name}
                            size="sm"
                        />
                    )}
                    <span translate="no">{article.author[0].name}</span>
                    <span>·</span>
                </>
            )}
            {article.last_edit_date && (
                <time>
                    {formatDate(article.last_edit_date, locale, showTime)}
                </time>
            )}
        </div>
    );

    if (article.cover) {
        return (
            <Card className="relative h-[300px]">
                <NextLink href={href} className="h-full">
                    <CardHeader className="absolute z-10 top-4 left-4">
                        <AuthorAndDate className="text-white" />
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt={article.title}
                        src={article.cover}
                        className="z-0 w-full h-full object-cover saturate-50"
                    />
                    <CardFooter className="absolute bg-linear-to-t from-black/80 pb-8 px-8 to-transparent bottom-0 z-10">
                        <div className="flex flex-col gap-4">
                            <span className="text-2xl font-bold text-white">{article.title}</span>
                            {article.category && (
                                <div className="flex flex-wrap gap-2">
                                    {article.category.map(tag => (
                                        <Chip key={tag} size="sm">{tag}</Chip>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </NextLink>
            </Card>
        );
    }

    return (
        <Card classNames={{
            base: 'bg-content2 shadow border-none'
        }}>
            <NextLink href={href}>
                <CardBody className="p-6">
                    <div className="flex flex-col gap-4">
                        <AuthorAndDate />
                        <span className="text-2xl font-bold">{article.title}</span>
                        {article.category && (
                            <div className="flex flex-wrap gap-2">
                                {article.category.map(tag => (
                                    <Chip key={tag} size="sm">{tag}</Chip>
                                ))}
                            </div>
                        )}
                    </div>
                </CardBody>
            </NextLink>
        </Card>
    );
}