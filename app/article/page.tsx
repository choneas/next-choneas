import { getTranslations } from "next-intl/server";
import { getAllArticles } from "@/lib/content";
import { ArticleMetadata } from "@/types/content";
import { ArticleCard } from "@/components/article-card";

export default async function Contents() {
    const t = await getTranslations("Article");
    const articles = await getAllArticles()

    return (
        <div className="container mx-auto px-8 sm:px-24 pt-8">
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>

            <ArticleList articles={articles} />
        </div>
    )
}

const ArticleList = ({ 
    articles,
    tag,
    title,
    sortOrder = 'desc'
}: { 
    articles: ArticleMetadata[];
    tag?: string;
    title?: string;
    sortOrder?: 'asc' | 'desc';  // 升序或降序
}) => {
    const filteredArticles = articles.filter(article => {
        if (tag && (!article.category || !article.category.includes(tag))) {
            return false;
        }
        if (title && !article.title.toLowerCase().includes(title.toLowerCase())) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        const timeA = a.created_date ? new Date(a.created_date).getTime() : 0;
        const timeB = b.created_date ? new Date(b.created_date).getTime() : 0;
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return (
        <div className="grid grid-cols-1 gap-8">
            {filteredArticles.map((article: ArticleMetadata) => (
                <ArticleCard 
                    key={article.id} 
                    linkParam="slug" 
                    article={article} 
                />
            ))}
        </div>
    );
}