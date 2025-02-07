import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TweetList }  from "@/components/tweet-list";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Metadata");

    return {
        title: t("title"),
        description: t("description"),
    }
    
}

export default async function Home() {
    const t = await getTranslations("Home");

    return (
        <div className="container my-10 md:my-16 mx-auto px-4 md:px-12 max-w-6xl">
            <p className="text-lg">{t("hello-iam")}</p>
            <h1 className="font-bold text-primary" translate="no">{t('choneas')}</h1>
            <p className="text-content4-foreground">{t('name-desc')}</p>
            <p
                className="text-lg py-4 pb-16 text-secondary"
            >
                {t('description')}
                {t('description-line2')}
            </p>

            <TweetList />
        </div>
    );
}
