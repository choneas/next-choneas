"use client"

import { useTranslations } from "next-intl"

export function SkipToContent() {
    const t = useTranslations("Accessibility")

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded-lg focus:shadow-lg"
        >
            {t("skip-to-content")}
        </a>
    )
}
