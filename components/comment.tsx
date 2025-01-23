"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comment({ slug, className }: { slug?: string, className?: string }) {
    const { resolvedTheme } = useTheme();

    return (
        <div className={className}>
            <Giscus
                repo={process.env.NEXT_PUBLIC_REPO as `${string}/${string}`}
                repoId={process.env.NEXT_PUBLIC_REPO_ID as string}
                category={process.env.NEXT_PUBLIC_CATEGORY as string}
                categoryId={process.env.NEXT_PUBLIC_CATEGORY_ID as string}
                mapping="specific"
                term={slug}
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={resolvedTheme}
                loading="lazy"
            />
        </div>
    );
}
