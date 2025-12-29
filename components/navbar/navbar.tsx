"use client"

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavbarContext } from "@/components/navbar/navbar-context";
import { NavbarBrand } from "@/components/navbar/navbar-brand";
import { NavbarItems } from "@/components/navbar/navbar-items";
import { NavbarDropdown } from "@/components/navbar/navbar-dropdown";
import { NavbarMobileMenu } from "@/components/navbar/navbar-mobile-menu";

interface NavbarProps {
    translations: Record<string, string>;
}

// ============================================================================
// Layout Configuration
// Sync with page.tsx GridLines for Home alignment
// ============================================================================

const LAYOUT = {
    // Desktop positioning (px)
    desktop: {
        top: 16,                    // 1rem - normal top position
        homeTop: 32,                // 2rem - Home: below grid line
        sideInset: 96,              // 5rem + 0.75rem - Home: align with grid
        normalSideInset: 128,        // 1.5rem - other pages: standard padding
    },
    // Mobile positioning (px)
    mobile: {
        bottom: 16,                 // 1rem - always at bottom
        sideInset: 16,              // 1rem - horizontal padding
    },
} as const;

// ============================================================================
// Animation Configuration
// ============================================================================

const TRANSITIONS = {
    layout: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8,
    },
    island: {
        type: "spring" as const,
        stiffness: 200,
        damping: 25,
        mass: 1,
    },
    // Mobile: no position animation, instant
    mobileIsland: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
    },
    overlay: { duration: 0.2 },
} as const;

// Refined tap animation configuration
// Uses precise spring physics for tactile feedback on both press and release
const TAP_CONFIG = {
    scale: 0.97,
    transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 20,
        mass: 0.6,
    },
} as const;

// ============================================================================
// Style Helpers
// ============================================================================

/** Glass effect styles for navbar islands */
function getIslandStyle(isMenuOpen: boolean) {
    const blur = isMenuOpen ? "blur(20px) saturate(180%)" : "blur(18px) saturate(160%)";
    const bg = isMenuOpen
        ? "color-mix(in srgb, var(--color-background) 96%, transparent 4%)"
        : "color-mix(in srgb, color-mix(in srgb, var(--color-background) 90%, var(--color-accent) 10%) 55%, transparent 45%)";
    // Removed outermost light shadow layer
    const shadow = isMenuOpen
        ? "inset 0 0 0 1.5px rgba(255, 255, 255, 0.15)"
        : "inset 0 0 0 1.5px rgba(255, 255, 255, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)";

    return {
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        backgroundColor: bg,
        boxShadow: shadow,
    };
}

/** Ocean blur layer hook - handles scroll-based blur effect */
function useOceanEffect(scrollY: MotionValue<number>, disabled: boolean) {
    const blur = useTransform(scrollY, [0, 400], [0, 16]);
    const saturate = useTransform(scrollY, [0, 400], [100, 150]);
    const opacity = useTransform(scrollY, [0, 400], [0, 10]);

    const backdropFilter = useTransform(
        [blur, saturate],
        ([b, s]) => `blur(${b}px) saturate(${s}%)`
    );
    const background = useTransform(
        opacity,
        (o) => `color-mix(in srgb, transparent ${100 - o}%, var(--color-background) ${o}%)`
    );

    // Fixed values when menu is open
    const fixedBackdrop = "blur(16px) saturate(150%)";
    const fixedBackground = "color-mix(in srgb, transparent 90%, var(--color-background) 10%)";

    return {
        blur,
        backdropFilter: disabled ? fixedBackdrop : backdropFilter,
        background: disabled ? fixedBackground : background,
    };
}

// ============================================================================
// Sub-components
// ============================================================================

interface OceanLayerProps {
    backdropFilter: MotionValue<string> | string;
    background: MotionValue<string> | string;
}

/** Gradient blur layer at top (desktop) and bottom (mobile) */
function OceanLayer({ backdropFilter, background }: OceanLayerProps) {
    const maskTop = "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)";
    const maskBottom = "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)";

    return (
        <div className="fixed sm:top-0 bottom-0 sm:bottom-auto inset-x-0 z-39 pointer-events-none h-40 sm:h-64">
            {/* Desktop: top gradient */}
            <motion.div
                className="hidden sm:block absolute inset-0"
                style={{
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                    maskImage: maskTop,
                    WebkitMaskImage: maskTop,
                }}
            />
            <motion.div
                className="hidden sm:block absolute inset-0"
                style={{
                    background,
                    maskImage: maskTop,
                    WebkitMaskImage: maskTop,
                }}
            />
            {/* Mobile: bottom gradient */}
            <motion.div
                className="sm:hidden absolute inset-0"
                style={{
                    background,
                    maskImage: maskBottom,
                    WebkitMaskImage: maskBottom,
                }}
            />
        </div>
    );
}

interface OverlayProps {
    onClose: () => void;
}

/** Dark overlay when menu is open */
function Overlay({ onClose }: OverlayProps) {
    return (
        <motion.div
            className="fixed inset-0 z-41 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.overlay}
            onClick={onClose}
        />
    );
}

// ============================================================================
// Main Component
// ============================================================================

export function Navbar({ translations }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    // Pending navigation for immediate UI feedback
    const [pendingPath, setPendingPath] = useState<string | null>(null);
    const effectivePath = pendingPath ?? pathname;
    const isHome = effectivePath === "/";
    const isMenuOpen = isDropdownOpen || isMobileMenuOpen;

    // Clear pending path when navigation completes
    useEffect(() => {
        if (pendingPath && pathname === pendingPath) {
            setPendingPath(null);
        }
    }, [pathname, pendingPath]);

    const handleNavigationStart = useCallback((path: string) => {
        if (path !== pathname) {
            setPendingPath(path);
        }
    }, [pathname]);

    const closeAllMenus = useCallback(() => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }, []);

    // Ocean blur effect
    const ocean = useOceanEffect(scrollY, isMenuOpen);

    // Island glass style
    const islandStyle = useMemo(() => getIslandStyle(isMenuOpen), [isMenuOpen]);

    // Context for child components
    const contextValue = useMemo(() => ({
        scrollY,
        navbarBlur: ocean.blur,
        pathname: effectivePath,
    }), [scrollY, ocean.blur, effectivePath]);

    // Calculate desktop positioning based on page
    const desktopTop = isHome ? LAYOUT.desktop.homeTop : LAYOUT.desktop.top;
    const sideInset = isHome ? LAYOUT.desktop.sideInset : LAYOUT.desktop.normalSideInset;

    return (
        <NavbarContext.Provider value={contextValue}>
            {isMenuOpen && <Overlay onClose={closeAllMenus} />}

            <OceanLayer
                backdropFilter={ocean.backdropFilter}
                background={ocean.background}
            />

            {/* Desktop Navbar - top positioned */}
            <motion.nav
                className="hidden sm:block fixed inset-x-0 z-41 pointer-events-auto"
                initial={false}
                animate={{ top: desktopTop }}
                transition={TRANSITIONS.layout}
            >
                <div className="flex items-center justify-center gap-3 relative h-14 w-full">
                    {/* Brand island - Left */}
                    <motion.div
                        className="absolute flex items-center h-14 rounded-full pl-3 pr-4 focus-within:shadow-[0_0_0_3px_var(--color-accent)]"
                        style={{
                            ...islandStyle,
                            maxWidth: "calc(50vw - 200px)",
                            overflow: "hidden",
                        }}
                        initial={false}
                        animate={{ left: sideInset }}
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TRANSITIONS.island}
                    >
                        <NavbarBrand />
                    </motion.div>

                    {/* Items island - Center */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 h-14 rounded-full overflow-hidden focus-within:shadow-[0_0_0_3px_var(--color-accent)]"
                        style={islandStyle}
                        initial={false}
                        layout
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TRANSITIONS.island}
                    >
                        <NavbarItems
                            pathname={effectivePath}
                            translations={translations}
                            onPendingNavigation={handleNavigationStart}
                        />
                    </motion.div>

                    {/* Dropdown island - Right */}
                    <motion.div
                        className="absolute flex items-center justify-center h-14 w-14 rounded-full p-0 has-focus-visible:shadow-[0_0_0_3px_var(--color-accent)]"
                        style={islandStyle}
                        initial={false}
                        animate={{ right: sideInset }}
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TRANSITIONS.island}
                    >
                        <NavbarDropdown onVisibilityChange={setIsDropdownOpen} />
                    </motion.div>
                </div>
            </motion.nav>

            {/* Mobile Navbar - always bottom positioned */}
            <nav
                className="sm:hidden fixed inset-x-0 z-41 pointer-events-auto"
                style={{ bottom: LAYOUT.mobile.bottom }}
            >
                <div
                    className="mx-auto flex items-center justify-between gap-3"
                    style={{ padding: `0 ${LAYOUT.mobile.sideInset}px` }}
                >
                    <motion.div
                        className="flex items-center justify-center h-14 w-14 rounded-full p-0 shrink-0"
                        style={islandStyle}
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TAP_CONFIG.transition}
                    >
                        <NavbarMobileMenu
                            isOpen={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                            pathname={effectivePath}
                            translations={translations}
                        />
                    </motion.div>

                    <motion.div
                        className="flex items-center h-14 rounded-full pl-3 pr-4"
                        style={{
                            ...islandStyle,
                            maxWidth: "calc(100vw - 180px)",
                            overflow: "hidden",
                        }}
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TAP_CONFIG.transition}
                    >
                        <NavbarBrand />
                    </motion.div>

                    <motion.div
                        className="flex items-center justify-center h-14 w-14 rounded-full p-0 shrink-0"
                        style={islandStyle}
                        whileTap={{ scale: TAP_CONFIG.scale }}
                        transition={TAP_CONFIG.transition}
                    >
                        <NavbarDropdown onVisibilityChange={setIsDropdownOpen} />
                    </motion.div>
                </div>
            </nav>
        </NavbarContext.Provider>
    );
}
