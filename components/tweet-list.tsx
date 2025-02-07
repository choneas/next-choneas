import { TweetCard } from "@/components/tweet-card";
import { getAllPosts } from "@/lib/content"

export async function TweetList({
    sortOrder
}: {
    sortOrder?: 'asc' | 'desc';
}) {
    const order = sortOrder || 'asc';
    const { tweets } = await getAllPosts();
    tweets.sort((a, b) => {
        const timeA = a.created_date ? new Date(a.created_date).getTime() : 0;
        const timeB = b.created_date ? new Date(b.created_date).getTime() : 0;
        return order === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return (
        <div className="flex flex-col gap-4">
            {tweets.map(tweet => (
                <div key={tweet.id}>
                    <TweetCard tweet={tweet} />
                </div>
            ))}
        </div>
    )
}