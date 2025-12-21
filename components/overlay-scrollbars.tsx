"use client"

import { useEffect } from "react"
import { OverlayScrollbars } from "overlayscrollbars"

/**
 * Initialize OverlayScrollbars on the body element for global scrollbar styling.
 * This component should be rendered once at the app root level.
 */
export function OverlayScrollbarsInit() {
    useEffect(() => {
        const osInstance = OverlayScrollbars(document.body, {
            scrollbars: {
                theme: "os-theme-custom",
                autoHide: "scroll",
                autoHideDelay: 800,
                autoHideSuspend: true,
            },
            overflow: {
                x: "hidden",
                y: "scroll",
            },
        })

        return () => {
            osInstance?.destroy()
        }
    }, [])

    return null
}
