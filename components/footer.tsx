import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("Footer");
    const currentYear = new Date().getFullYear();
    const startYear = 2024;

    return (
        <div className="max-w-screen w-full h-30 p-5 text-center opacity-80">
            <p>{t("copyright", { startYear, currentYear })}</p>
            <p>
                {t("license")}{' '}
                <Link href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
                    {t("licenseLink")}
                </Link>
            </p>
        </div>
    )
}
