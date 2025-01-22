import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
        <div className="container mt-10 md:mt-16 mx-auto px-4 md:px-12">
            <p className="text-lg">{t("hello-iam")}</p>
            <h1 className="font-bold text-primary">{t('choneas')}</h1>
            <p className="text-content4-foreground">{t('name-desc')}</p>
            <p
                className="text-lg my-4 text-secondary"
            >
                {t('description')}
            </p>
            <p
                className="text-lg my-0 text-secondary"
            >
                {t('description-line2')}
            </p>
        </div>
    );
}
