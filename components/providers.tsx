"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OverlayScrollbarsInit } from "@/components/overlay-scrollbars";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider enableSystem attribute={["class", "data-theme"]}>
            <OverlayScrollbarsInit />
            {children}
        </NextThemesProvider>
    )
}