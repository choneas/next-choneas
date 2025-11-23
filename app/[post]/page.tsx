import { getPost, ArticleNotFoundError } from "@/lib/content";
import { redirect } from "next/navigation";

export default async function SmartRoute({
    params,
}: {
    params: Promise<{ post: string }>,
}) {
    const post = (await params).post;

    try {
        const { metadata } = await getPost(post, true);

        if (metadata.type === "Tweet") {
            redirect(`/tweet/${metadata.slug || metadata.id}`);
        } else {
            redirect(`/article/${metadata.slug || metadata.id}`);
        }
    } catch (error) {
        if (error instanceof ArticleNotFoundError) {
            redirect(`/article/${post}`);
        }
        throw error;
    }
}
