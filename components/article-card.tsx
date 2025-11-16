import { Card } from "@heroui/react"
import { Avatar } from "@/components/avatar";
import { Tags } from "@/components/tags"
import NextLink from "next/link"
import Image from "next/image"
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
    const href = `/article/${linkParam === 'slug' && article.slug ? article.slug :
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
            {article.last_edited_time && (
                <time>
                    {formatDate(article.created_time, locale, showTime)}
                </time>
            )}
        </div>
    );

    if (article.cover) {
        return (
            <Card className="bg-content2 shadow border-none">
                <NextLink href={href}>
                    <div className="md:hidden">
                        <div className="relative w-full aspect-video overflow-hidden rounded-b-md rounded-t-[calc(var(--radius-md)*3)]">
                            <Image
                                alt={article.title}
                                src={article.cover}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    </div>

                    {/* 桌面端：Grid 布局，图片在右侧 */}
                    <div className="hidden md:grid md:grid-cols-[1fr_380px] gap-4 p-4">
                        <div className="flex flex-col gap-3">
                            <AuthorAndDate />
                            <span className="text-2xl font-semibold">{article.title}</span>
                            {article.tags && article.tags.length > 0 && (
                                <Tags tags={article.tags} />
                            )}
                        </div>

                        <div className="relative w-full h-[200px] overflow-hidden rounded-[calc(var(--radius-md)*3)]">
                            <Image
                                alt={article.title}
                                src={article.cover}
                                fill
                                className="object-cover"
                                sizes="200px"
                            />
                        </div>
                    </div>

                    {/* 移动端：内容在下方 */}
                    <Card.Content className="md:hidden p-4">
                        <div className="flex flex-col gap-3">
                            <AuthorAndDate />
                            <span className="text-2xl font-semibold">{article.title}</span>
                            {article.tags && article.tags.length > 0 && (
                                <Tags tags={article.tags} />
                            )}
                        </div>
                    </Card.Content>
                </NextLink>
            </Card>
        );
    }

    return (
        <Card className="bg-content2 shadow border-none">
            <NextLink href={href}>
                <Card.Content className="p-3">
                    <div className="flex flex-col gap-3">
                        <AuthorAndDate />
                        <span className="text-2xl font-semibold">{article.title}</span>
                        {article.tags && article.tags.length > 0 && (
                            <Tags tags={article.tags} />
                        )}
                    </div>
                </Card.Content>
            </NextLink>
        </Card>
    );
}