"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OverlayScrollbarsInit } from "@/components/overlay-scrollbars";
import { NavigationLoader } from "@/components/navigation-loader";
import { Toast } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider enableSystem attribute={["class", "data-theme"]}>
            <OverlayScrollbarsInit />
            <NavigationLoader />
            <Toast.Provider 
                placement="bottom" 
                maxVisibleToasts={1} 
                className="[&_.toast]:border [&_.toast]:border-border"
            />
            {children}
        </NextThemesProvider>
    )
}