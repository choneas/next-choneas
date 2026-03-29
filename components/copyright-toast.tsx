"use client";

import { useEffect } from "react";
import { toast } from "@heroui/react";
import { useTranslations } from "next-intl";

export function CopyrightToast() {
    const t = useTranslations("Footer");

    useEffect(() => {
        const handleCopy = async () => {
            toast.warning(t("copyLicenseTitle"), {
                description: t("copyLicense"),
                timeout: 7000,
            });
        };

        window.addEventListener("copy", handleCopy);
        return () => window.removeEventListener("copy", handleCopy);
    }, [t]);

    return null;
}
