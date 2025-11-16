import { getPost, ArticleNotFoundError } from "@/lib/content";
import { redirect } from "next/navigation";

export default async function SmartRoute({
    params,
}: {
    params: Promise<{ slug: string }>,
}) {
    const slug = (await params).slug;

    try {
        const { metadata } = await getPost(slug, true);

        // 根据类型重定向到对应页面
        if (metadata.type === "Tweet") {
            redirect(`/tweet/${metadata.slug || metadata.id}`);
        } else {
            redirect(`/article/${metadata.slug || metadata.id}`);
        }
    } catch (error) {
        if (error instanceof ArticleNotFoundError) {
            // 如果找不到，尝试作为 article 处理
            redirect(`/article/${slug}`);
        }
        throw error;
    }
}
