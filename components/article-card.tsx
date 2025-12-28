"use client";

import NextLink from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { uuidToId } from "notion-utils";
import { Card } from "@heroui/react";
import { Avatar } from "@/components/avatar";
import { Tags } from "@/components/tags";
import { triggerNavigationLoading } from "@/components/navigation-loader";
import type { PostMetadata } from "@/types/content";
import { formatDate } from "@/lib/format";

export function ArticleCard({
    article,
    linkParam = "slug",
    showTime = false,
}: {
    article: PostMetadata;
    linkParam?: "slug" | "id" | "notionid";
    showTime?: boolean;
}) {
    const locale = useLocale();

    const href =
        `/article/${linkParam === "slug" && article.slug ? article.slug :
            linkParam === "notionid" && article.notionid ? uuidToId(article.notionid) :
                article.id
        }`;

    const AuthorAndDate = ({ className = "" }) => (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            {article.author?.[0] && (
                <>
                    {article.author[0].avatar && (
                        <Avatar
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
                    {article.readingTime && ` · ${article.readingTime}`}
                </time>
            )}
        </div>
    );

    const focusClass =
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset";

    // Trigger loading overlay on navigation
    const handleNavigate = () => {
        triggerNavigationLoading(href);
    };

    if (article.cover) {
        return (
            <NextLink
                href={href}
                tabIndex={0}
                className={`${focusClass} block`}
                aria-label={`${article.title} - ${formatDate(article.created_time, locale, showTime)}`}
                onNavigate={handleNavigate}
            >
                <Card className="bg-content2 shadow border-none">
                    <div className="lg:hidden">
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

                    {/* Mobile: grid, photos on right */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_380px] gap-4 p-4">
                        <div className="flex flex-col gap-3">
                            <AuthorAndDate />
                            <span className="text-2xl font-semibold">{article.title}</span>
                            {article.tags && article.tags.length > 0 && <Tags tags={article.tags} />}
                        </div>

                        <div className="relative w-full h-[200px] overflow-hidden rounded-[calc(var(--radius-md)*3)]">
                            <Image alt={article.title} src={article.cover} fill className="object-cover" />
                        </div>
                    </div>

                    {/* Mobile: content on down */}
                    <Card.Content className="lg:hidden p-4">
                        <div className="flex flex-col gap-3">
                            <AuthorAndDate />
                            <span className="text-2xl font-semibold">{article.title}</span>
                            {article.tags && article.tags.length > 0 && <Tags tags={article.tags} />}
                        </div>
                    </Card.Content>
                </Card>
            </NextLink>
        );
    }

    return (
        <NextLink
            href={href}
            tabIndex={0}
            className={`${focusClass} block`}
            aria-label={`${article.title} - ${formatDate(article.created_time, locale, showTime)}`}
            onNavigate={handleNavigate}
        >
            <Card className="bg-content2 shadow border-none">
                <Card.Content className="p-3">
                    <div className="flex flex-col gap-3">
                        <AuthorAndDate />
                        <span className="text-2xl font-semibold">{article.title}</span>
                        {article.tags && article.tags.length > 0 && <Tags tags={article.tags} />}
                    </div>
                </Card.Content>
            </Card>
        </NextLink>
    );
}
