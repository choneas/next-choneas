"use cache: private";

import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { Card, Skeleton } from "@heroui/react";
import { MomentCard, MomentCardSkeleton } from "@/components/moment-card";
import { getAllPosts } from "@/lib/content";
import { getSocialAvatars } from "@/lib/social-feeds";

export async function MomentList({ sortOrder }: { sortOrder?: 'asc' | 'desc' }) {
    cacheLife("minutes");
    cacheTag("moments", "homepage");

    const order = sortOrder || 'desc';
    const [{ tweets, articles }, avatars] = await Promise.all([
        getAllPosts(),
        getSocialAvatars()
    ]);
    const moments = [...tweets, ...articles];
    moments.sort((a, b) => {
        const comparison = new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
        return order === 'desc' ? comparison : -comparison;
    });

    // Get avatar URL based on platform
    const getAvatarSrc = (platform?: string) => {
        if (platform === 'x') return avatars.xAvatar || undefined;
        if (platform === 'bluesky') return avatars.blueskyAvatar || undefined;
        return undefined;
    };

    return (
        <div className="flex flex-col gap-4">
            {moments.map((moment) => (
                <Suspense key={moment.id} fallback={<MomentCardSkeleton moment={moment} />}>
                    <MomentCard moment={moment} avatarSrc={getAvatarSrc(moment.platform)} />
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
