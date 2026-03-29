import type { MetadataRoute } from 'next'
import { getAllPostsRaw } from '@/lib/content'
import { getLocale } from 'next-intl/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locale = await getLocale();
    const { articles } = await getAllPostsRaw(locale);

    const articleUrls: MetadataRoute.Sitemap = articles.map(article => {
        const item: MetadataRoute.Sitemap[number] = {
            url: `https://choneas.com/article/${article.slug}`,
            lastModified: new Date(article.last_edited_time),
            changeFrequency: 'weekly',
            priority: 0.7,
        };

        if (article.cover) {
            item.images = [article.cover];
        }

        return item;
    });

    const routes: MetadataRoute.Sitemap = ['', 'article', 'project', 'about'].map((route) => ({
        url: `https://choneas.com/${route}`,
        lastModified: new Date(),
        changeFrequency: route === 'article' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes, ...articleUrls];
}
