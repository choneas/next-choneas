"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function CopyrightToast() {
    const t = useTranslations("Footer");

    useEffect(() => {
        const handleCopy = async () => {
            const { toast } = await import("@heroui/react");
            
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
