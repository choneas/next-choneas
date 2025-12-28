"use client"

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner, Skeleton } from "@heroui/react";

interface NavigationState {
    isLoading: boolean;
    targetPath: string | null;
}

/**
 * Global navigation loading overlay
 * Shows route-specific skeleton or generic spinner during page transitions
 */
export function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [state, setState] = useState<NavigationState>({
        isLoading: false,
        targetPath: null
    });

    // Clear loading when route changes
    useEffect(() => {
        setState({ isLoading: false, targetPath: null });
    }, [pathname, searchParams]);

    // Listen for navigation start via custom event
    useEffect(() => {
        const handleNavigationStart = (e: CustomEvent<{ targetPath?: string }>) => {
            setState({
                isLoading: true,
                targetPath: e.detail?.targetPath || null
            });
        };

        window.addEventListener("navigation-start", handleNavigationStart as EventListener);
        return () => {
            window.removeEventListener("navigation-start", handleNavigationStart as EventListener);
        };
    }, []);

    // Get skeleton component based on target path
    const SkeletonContent = getSkeletonForPath(state.targetPath);

    return (
        <AnimatePresence>
            {state.isLoading && (
                <motion.div
                    className="fixed inset-0 z-41 bg-background overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {SkeletonContent ? (
                        <SkeletonContent />
                    ) : (
                        <DefaultLoadingSpinner />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Default loading spinner for routes without custom skeleton
 */
function DefaultLoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
            >
                <Spinner size="lg" color="accent" />
            </motion.div>
        </div>
    );
}

/**
 * Article page skeleton
 */
function ArticleSkeleton() {
    return (
        <main className="container mx-auto px-8 sm:mt-20 sm:px-24 pt-8">
            <Skeleton className="h-12 w-48 rounded-lg" />
            <Skeleton className="h-9 w-80 mt-2 rounded-lg" />

            <div className="mt-8">
                <Skeleton className="h-9 w-full rounded-full" />

                <div className="flex gap-3 mt-4 overflow-hidden">
                    {[70, 90, 60, 80, 75, 85].map((width, i) => (
                        <Skeleton
                            key={i}
                            className="h-10 rounded-full shrink-0"
                            style={{ width: `${width}px` }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

/**
 * Route to skeleton mapping
 * Add new routes here to show custom skeletons
 */
function getSkeletonForPath(path: string | null): React.ComponentType | null {
    if (!path) return null;

    // Match route patterns
    if (path === "/article" || path.startsWith("/article?")) {
        return ArticleSkeleton;
    }

    return null;
}

/**
 * Trigger navigation loading state
 * @param targetPath - Optional target path for route-specific skeleton
 */
export function triggerNavigationLoading(targetPath?: string) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("navigation-start", {
            detail: { targetPath }
        }));
    }
}
