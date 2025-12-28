import { Suspense } from "react";
import { Card, Skeleton } from "@heroui/react";
import { getTranslations, getLocale } from "next-intl/server";
import { MomentCard, MomentCardSkeleton } from "@/components/moment-card";
import { getAllPosts } from "@/lib/content";

interface MomentListProps {
    sortOrder?: 'asc' | 'desc';
}

export async function MomentList({ sortOrder = 'desc' }: MomentListProps) {
    const t = await getTranslations("Tag");
    const locale = await getLocale();

    // Pass translator and locale to getAllPosts (data is cached internally)
    const { tweets, articles } = await getAllPosts(
        (key: string) => t(key),
        locale
    );

    const moments = [...tweets, ...articles];
    moments.sort((a, b) => {
        const comparison = new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
        return sortOrder === 'desc' ? comparison : -comparison;
    });

    return (
        <div className="flex flex-col gap-4">
            {moments.map((moment) => (
                <Suspense key={moment.id} fallback={<MomentCardSkeleton moment={moment} locale={locale} />}>
                    <MomentCard moment={moment} />
                </Suspense>
            ))}
        </div>
    );
}

export async function MomentListSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="relative">
                    {/* Header */}
                    <div className="flex gap-3 items-center">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton className="h-4 w-24 rounded-lg" />
                            <Skeleton className="h-3 w-32 rounded-lg" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-lg" />
                        <Skeleton className="h-4 w-5/6 rounded-lg" />
                    </div>

                    {/* Footer */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </Card>
            ))}
        </div>
    );
}
