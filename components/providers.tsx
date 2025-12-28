"use client"

import { Suspense } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OverlayScrollbarsInit } from "@/components/overlay-scrollbars";
import { NavigationLoader } from "@/components/navigation-loader";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider enableSystem attribute={["class", "data-theme"]}>
            <OverlayScrollbarsInit />
            <Suspense fallback={null}>
                <NavigationLoader />
            </Suspense>
            {children}
        </NextThemesProvider>
    )
}