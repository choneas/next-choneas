import Link from "next/link";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";

export async function Footer() {
    await connection();

    const t = await getTranslations("Footer");
    const currentYear = new Date().getFullYear();
    const startYear = 2024;

    return (
        <footer className="max-w-screen w-full flex flex-col h-30 px-5 mb-16 lg:mb-5 text-center justify-center opacity-80">
            <p>{t("copyright", { startYear, currentYear })}</p>
            <p>
                {t("license")}{' '}
                <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
                    {t("licenseLink")}
                </Link>
            </p>
        </footer>
    )
}
