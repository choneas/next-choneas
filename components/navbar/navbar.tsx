"use client"

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiMoreHorizontal } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { usePostMetadata } from "@/stores/post";
import { NavbarContext } from "@/components/navbar/navbar-context";
import { NavbarBrand } from "@/components/navbar/navbar-brand";
import { NavbarItems } from "@/components/navbar/navbar-items";
import { NavbarMenu } from "@/components/navbar/navbar-menu";
import { NavbarDropdown } from "@/components/navbar/navbar-dropdown";

interface NavbarProps {
    translations: Record<string, string>;
}

export function Navbar({ translations }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const { postMetadata } = usePostMetadata();

    const isArticlePage = pathname.includes('/article/');
    const isHomePage = pathname === '/';
    const hasCover = isArticlePage && !!postMetadata?.cover;
    const useGradientEffect = isHomePage || isArticlePage;

    const navbarBlur = useTransform(scrollY, [0, 400], [0, 16]);
    const navbarSaturate = useTransform(scrollY, [0, 400], [100, 150]);
    const bgWhiteMix = useTransform(scrollY, [0, 400], [0, 40]);

    const backdropFilterStyle = useTransform(
        [navbarBlur, navbarSaturate],
        ([blur, saturate]) => `blur(${blur}px) saturate(${saturate}%)`
    );

    const backgroundColorStyle = useTransform(
        bgWhiteMix,
        (mix) => `color-mix(in srgb, transparent ${100 - mix}%, white ${mix}%)`
    );

    const contextValue = {
        scrollY,
        navbarBlur,
        pathname,
        hasCover
    };

    return (
        <NavbarContext.Provider value={contextValue}>
            <motion.nav
                className={`sticky top-0 inset-x-0 z-40 ${!useGradientEffect ? 'bg-transparent backdrop-saturate-150' : ''}`}
                style={{
                    backdropFilter: useGradientEffect ? backdropFilterStyle : 'blur(16px) saturate(150%)',
                    WebkitBackdropFilter: useGradientEffect ? backdropFilterStyle : 'blur(16px) saturate(150%)',
                    backgroundColor: useGradientEffect ? backgroundColorStyle : undefined,
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left section */}
                        <div className="flex items-center gap-4">
                            <Button
                                isIconOnly
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="sm:hidden p-2"
                                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            >
                                <FiMoreHorizontal size={24} />
                            </Button>
                            <NavbarBrand />
                        </div>

                        {/* Center section - Desktop nav items */}
                        <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex gap-4">
                            <NavbarItems pathname={pathname} translations={translations} />
                        </div>

                        {/* Right section */}
                        <div className="flex items-center">
                            <NavbarDropdown />
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="sm:hidden bg-white/60 dark:bg-black/80 px-4 py-4 gap-4">
                        <NavbarMenu pathname={pathname} translations={translations} />
                    </div>
                )}
            </motion.nav>
        </NavbarContext.Provider>
    )
}
