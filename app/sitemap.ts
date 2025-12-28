import type { MetadataRoute } from 'next'
import { getAllPostsRaw } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { articles } = await getAllPostsRaw('en');

    const articleUrls: MetadataRoute.Sitemap = articles.map(article => ({
        url: `https://choneas.com/article/${article.slug}`,
        lastModified: new Date(article.last_edited_time),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const routes: MetadataRoute.Sitemap = ['', 'article', 'project', 'about'].map((route) => ({
        url: `https://choneas.com/${route}`,
        lastModified: new Date(),
        changeFrequency: route === 'article' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes, ...articleUrls];
}
