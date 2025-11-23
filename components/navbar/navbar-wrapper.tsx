import { getTranslations, getLocale } from "next-intl/server";
import { cacheLife } from "next/cache";
import { navItems } from "@/data/navbar";
import { Navbar } from "@/components/navbar";

async function getNavbarTranslations(locale: string) {
    "use cache: private"
    cacheLife({ stale: 3600, revalidate: 86400 });

    const t = await getTranslations({ locale, namespace: "Navbar" });

    const translations: Record<string, string> = {};
    for (const item of navItems) {
        translations[item.name] = t(item.name);
    }

    return translations;
}

export async function NavbarWrapper() {
    const locale = await getLocale();
    const translations = await getNavbarTranslations(locale);

    return <Navbar translations={translations} />;
}
