"use client"

import { Navbar as NextNavbar, NavbarMenuToggle, NavbarBrand as HeroNavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu as HeroNavbarMenu, NavbarMenuItem } from "@heroui/react";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useArticleMetadata } from "@/stores/article";
import { Avatar } from "@/components/avatar";

import { NavItems } from "@/data/navbar";

function getRandomBool(): boolean {
    return Math.random() < 0.4;
}

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <NextNavbar onMenuOpenChange={setIsMenuOpen} classNames={{
            "base": `bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-80 ${isMenuOpen && 'w-screen'}`,
            "menu": "bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-80",
        }}>
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />

                <NavbarBrand />

            </NavbarContent>

            <NavbarItems />

            <NavbarContent justify="end">

            </NavbarContent>

            <NavbarMenu />
        </NextNavbar>
    )
}

const NavbarMenu = () => {
    const pathname = usePathname();
    const t = useTranslations("Navbar");

    return (
        <HeroNavbarMenu>
            {
                NavItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            color="foreground"
                            href={item.href}
                            className={`flex justify-start gap-2 ${pathname.includes(item.href) && pathname != "/" ? "font-bold" : ""}`}
                        >
                            {item.icon}
                            {t(item.name)}
                        </Link>
                    </NavbarMenuItem>
                ))
            }
        </HeroNavbarMenu>
    )
}

const NavbarItems = () => {
    const pathname = usePathname();
    const t = useTranslations("Navbar");

    return (
        <NavbarContent justify="center">
            {
                NavItems.map((item, index) => {
                    return (
                        <NavbarItem key={index} className="hidden sm:block">
                            <Link
                                color="foreground"
                                href={item.href}
                                className={`flex justify-start gap-2 ${pathname.includes(item.href) && pathname != "/" ? "font-bold" : ""}`}
                            >
                                {item.icon}
                                {t(item.name)}
                            </Link>
                        </NavbarItem>
                    )
                })
            }
        </NavbarContent>
    )
}

const NavbarBrand = () => {
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const { ArticleMetadata } = useArticleMetadata();

    const headTextY = useTransform(scrollY, [0, 100], [-6, -15])
    const contentTextY = useTransform(scrollY, [0, 100], [30, 0])
    const headTextOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
    const headTextScale = useTransform(scrollY, [0, 100], [1, 0.8])
    const contentTextOpacity = useTransform(scrollY, [0, 100], [0, 1])

    const isFunnyName = getRandomBool();

    return (
        <Link disableAnimation href="/" color="foreground" className={pathname === '/' ? 'hidden' : 'block'}>
            <HeroNavbarBrand className="flex gap-4 font-bold">
                <Avatar isChoneas />
                {
                    pathname.includes("article/") ?
                        <>
                            <div className="flex pt-2 pb-4 justify-start overflow-hidden h-6">
                                <motion.div
                                    className="absolute origin-left"
                                    style={{ 
                                        y: headTextY, 
                                        opacity: headTextOpacity,
                                        scale: headTextScale
                                    }}
                                >
                                    {isFunnyName ? 'Choneas' : '符华大人的小赤鸢'}
                                </motion.div>
                                <motion.div
                                    className="absolute"
                                    style={{ 
                                        y: contentTextY, 
                                        opacity: contentTextOpacity 
                                    }}
                                >
                                    {ArticleMetadata?.title}
                                </motion.div>
                            </div>
                        </>
                        :
                        <p>Choneas</p>
                }
            </HeroNavbarBrand>
        </Link>
    )
}