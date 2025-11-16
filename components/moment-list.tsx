"use cache: private";

import { cacheLife, cacheTag } from "next/cache";
import { MomentCard } from "@/components/moment-card";
import { getAllPosts } from "@/lib/content";

export async function MomentList({ sortOrder }: { sortOrder?: 'asc' | 'desc' }) {
    cacheLife("minutes");
    cacheTag("moments", "homepage");

    const order = sortOrder || 'desc';
    const { tweets, articles } = await getAllPosts();
    const moments = [...tweets, ...articles];
    moments.sort((a, b) => {
        const comparison = new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
        return order === 'desc' ? comparison : -comparison;
    });
    return (
        <div className="flex flex-col gap-4">
            {moments.map((moment) => (
                <div key={moment.id}>
                    <MomentCard moment={moment} />
                </div>
            ))}
        </div>
    );
}