import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const articles = (await getAllArticles()).map(article => ({
        url: `https://choneas.com/article/${article.slug}`,
        lastModified: article.last_edit_date
    }))

    const routes = ['', '/article', '/project', '/about'].map((route) => ({
        url: `https://choneas.com/${route}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: route === '/article' ? 'weekly' : 'monthly' as 'weekly' | 'monthly',
    }))

    return [...routes, ...articles]
}