import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { TweetCard } from "@/components/tweet-card";
import { getAllPosts } from "@/lib/content"

export async function TweetList({
    sortOrder
}: {
    sortOrder?: 'asc' | 'desc';
}) {
    const t = await getTranslations('Home');
    const order = sortOrder || 'asc';
    const { tweets } = await getAllPosts();
    tweets.sort((a, b) => {
        const timeA = a.created_date ? new Date(a.created_date).getTime() : 0;
        const timeB = b.created_date ? new Date(b.created_date).getTime() : 0;
        return order === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return (
        <div className="flex flex-col gap-4">
            {tweets.map((tweet, index) =>
                index === 0 ? (
                    <div key={tweet.id} className="flex flex-col">
                        <TweetCard tweet={tweet} />
                        <Link href="/article" className="pt-2 w-full text-secondary text-sm flex justify-center">{t('goto-articles')}</Link>
                    </div>
                ) : (
                    <div key={tweet.id}>
                        <TweetCard tweet={tweet} />
                    </div>
                )
            )}
        </div>
    )
}