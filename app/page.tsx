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
            <h1 className="font-bold text-danger-700">{t('choneas')}</h1>
            <p className="text-content4-foreground">{t('name-desc')}</p>
            <p
                className="text-lg text-opacity-50 my-4"
            >
                {t('description')}
            </p>
            <p
                className="text-lg text-opacity-50 my-0"
            >
                {t('description-line2')}
            </p>
        </div>
    );
}
