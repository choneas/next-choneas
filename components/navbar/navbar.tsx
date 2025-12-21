"use client"

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavbarContext } from "@/components/navbar/navbar-context";
import { NavbarBrand } from "@/components/navbar/navbar-brand";
import { NavbarItems } from "@/components/navbar/navbar-items";
import { NavbarDropdown } from "@/components/navbar/navbar-dropdown";
import { NavbarMobileMenu } from "@/components/navbar/navbar-mobile-menu";

interface NavbarProps {
    translations: Record<string, string>;
}

/*
    规则:
    - 海洋层（整个 nav）：
        * 在首页/有封面文章时：背景和模糊跟随滚动变化
        * 其他页面：固定背景和模糊
        * Dropdown 打开时：固定背景和模糊
    - 岛屿层（三个独立容器）：
        * 背景模糊始终固定（blur(16px) saturate(150%)）
        * 背景透明度固定（40% opacity）
    - 移动端：
        * Navbar 在底部（fixed bottom-0）
        * 只显示菜单按钮岛屿 + Brand 岛屿 + More 岛屿
 */

export function Navbar({ translations }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    // All pages use scroll effect for ocean layer (except when dropdown/menu is open)
    const useScrollEffect = !isDropdownOpen && !isMobileMenuOpen;



    // Ocean layer (nav background) - follows scroll on specific pages
    const oceanBlur = useTransform(scrollY, [0, 400], [0, 16]);
    const oceanSaturate = useTransform(scrollY, [0, 400], [100, 150]);
    const oceanOpacity = useTransform(scrollY, [0, 400], [0, 10]);

    const oceanBackdropFilter = useTransform(
        [oceanBlur, oceanSaturate],
        ([blur, saturate]) => `blur(${blur}px) saturate(${saturate}%)`
    );

    const oceanBackground = useTransform(
        oceanOpacity,
        (opacity) => `color-mix(in srgb, transparent ${100 - opacity}%, var(--color-background) ${opacity}%)`
    );

    // Fixed values for non-scroll pages or when dropdown is open
    const fixedOceanBackdrop = "blur(16px) saturate(150%)";
    const fixedOceanBackground = "color-mix(in srgb, transparent 90%, var(--color-background) 10%)";

    const computedOceanBackdrop = useScrollEffect ? oceanBackdropFilter : fixedOceanBackdrop;
    const computedOceanBackground = useScrollEffect ? oceanBackground : fixedOceanBackground;

    // Island layer - changes when dropdown is open
    const islandStyle = {
        backdropFilter: (isDropdownOpen || isMobileMenuOpen) ? "blur(20px) saturate(180%)" : "blur(18px) saturate(160%)",
        WebkitBackdropFilter: (isDropdownOpen || isMobileMenuOpen) ? "blur(20px) saturate(180%)" : "blur(18px) saturate(160%)",
        backgroundColor: (isDropdownOpen || isMobileMenuOpen)
            ? "color-mix(in srgb, var(--color-background) 96%, transparent 4%)"
            : "color-mix(in srgb, color-mix(in srgb, var(--color-background) 90%, var(--color-accent) 10%) 55%, transparent 45%)"
    };

    const contextValue = {
        scrollY,
        navbarBlur: oceanBlur,
        pathname
    };

    return (
        <NavbarContext.Provider value={contextValue}>
            {/* Overlay when dropdown is open */}
            {(isDropdownOpen || isMobileMenuOpen) && (
                <motion.div
                    className="fixed inset-0 z-30 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                />
            )}

            {/* Ocean layer - gradient blur background */}
            <div className="fixed sm:top-0 bottom-0 sm:bottom-auto inset-x-0 z-40 pointer-events-none h-40 sm:h-64">
                {/* Desktop: top to bottom gradient */}
                <motion.div
                    className="hidden sm:block absolute inset-0"
                    style={{
                        backdropFilter: computedOceanBackdrop,
                        WebkitBackdropFilter: computedOceanBackdrop,
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                    }}
                />
                <motion.div
                    className="hidden sm:block absolute inset-0"
                    style={{
                        background: computedOceanBackground,
                        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                    }}
                />

                {/* Mobile: bottom to top gradient - no blur, only color */}
                <motion.div
                    className="sm:hidden absolute inset-0"
                    style={{
                        background: computedOceanBackground,
                        maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)"
                    }}
                />
            </div>

            {/* Navbar content */}
            <motion.nav
                className="fixed sm:top-4 bottom-4 sm:bottom-auto inset-x-0 z-40 px-4 sm:px-6 lg:px-8 pointer-events-auto"
            >
                {/* Desktop layout */}
                <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-center gap-3 relative h-14">
                    {/* Brand island - Left (absolute positioning) */}
                    <motion.div
                        className="absolute left-0 flex items-center h-14 rounded-full pl-3 pr-4"
                        style={{
                            ...islandStyle,
                            maxWidth: "calc(50vw - 200px)", // Reserve space for Items and More
                            overflow: "hidden"
                        }}
                        layout
                        transition={{
                            layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                        }}
                    >
                        <NavbarBrand />
                    </motion.div>

                    {/* Items island - Center (absolute positioning for guaranteed centering) */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 h-14 rounded-full overflow-hidden"
                        style={islandStyle}
                    >
                        <NavbarItems pathname={pathname} translations={translations} />
                    </motion.div>

                    {/* More dropdown island - Right (absolute positioning) */}
                    <motion.div
                        className="absolute right-0 flex items-center justify-center h-14 w-14 rounded-full p-0"
                        style={islandStyle}
                    >
                        <NavbarDropdown onVisibilityChange={setIsDropdownOpen} />
                    </motion.div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden max-w-7xl mx-auto flex items-center justify-between gap-3">
                    {/* Mobile menu button island - Left */}
                    <motion.div
                        className="flex items-center justify-center h-14 w-14 rounded-full p-0 shrink-0"
                        style={islandStyle}
                    >
                        <NavbarMobileMenu
                            isOpen={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                            pathname={pathname}
                            translations={translations}
                        />
                    </motion.div>

                    {/* Brand island - Center */}
                    <motion.div
                        className="flex items-center h-14 rounded-full pl-3 pr-4"
                        style={{
                            ...islandStyle,
                            maxWidth: "calc(100vw - 180px)", // Reserve space for menu button, More, and gaps
                            overflow: "hidden"
                        }}
                        layout
                        transition={{
                            layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                        }}
                    >
                        <NavbarBrand />
                    </motion.div>

                    {/* More dropdown island - Right */}
                    <motion.div
                        className="flex items-center justify-center h-14 w-14 rounded-full p-0 shrink-0"
                        style={islandStyle}
                    >
                        <NavbarDropdown onVisibilityChange={setIsDropdownOpen} />
                    </motion.div>
                </div>
            </motion.nav>
        </NavbarContext.Provider>
    )
}
