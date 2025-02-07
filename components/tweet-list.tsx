import { TweetCard } from "@/components/tweet-card";
import { getAllPosts } from "@/lib/content"

export async function TweetList() {
    const { tweets } = await getAllPosts();

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