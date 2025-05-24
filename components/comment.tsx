"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { formatDate } from "@/lib/format";
import { PostMetadata } from "@/types/content";

export function Comment({ metadata, className, type }: { metadata?: PostMetadata, className?: string, type?: "article" | "tweet" }) {
    const locale = useLocale();
    const { resolvedTheme } = useTheme();

    return (
        <div className={'comments' + className}>
            <Giscus
                repo={process.env.NEXT_PUBLIC_REPO as `${string}/${string}`}
                repoId={process.env.NEXT_PUBLIC_REPO_ID as string}
                category={type === "article" ? process.env.NEXT_PUBLIC_CATEGORY as string : process.env.NEXT_PUBLIC_CATEGORY_TWEET as string}
                categoryId={type === "article" ? process.env.NEXT_PUBLIC_CATEGORY_ID as string : process.env.NEXT_PUBLIC_CATEGORY_ID_TWEET as string}
                mapping="specific"
                term={type === "article" ? metadata?.slug : formatDate(metadata?.created_date || new Date(), "en", true, false)}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={resolvedTheme}
                loading="lazy"
                lang={locale}
            />
        </div>
    );
}
