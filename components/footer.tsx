"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Footer() {
    const t = useTranslations("Footer");
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const currentYear = new Date().getFullYear();
    const startYear = 2024;

    useEffect(() => {
        if (document.readyState === 'complete') {
            setIsPageLoaded(true);
        } else {
            const handleLoad = () => setIsPageLoaded(true);
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    if (!isPageLoaded) {
        return null;
    }

    return (
        <motion.footer
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="max-w-screen w-full h-30 px-5 mb-16 lg:mb-5 text-center opacity-80"
        >
            <p>{t("copyright", { startYear, currentYear })}</p>
            <p>
                {t("license")}{' '}
                <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline">
                    {t("licenseLink")}
                </Link>
            </p>
        </motion.footer>
    )
}
