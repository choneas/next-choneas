"use client"

import {
    Navbar as NextNavbar, NavbarMenuToggle, NavbarBrand as HeroNavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu as HeroNavbarMenu, NavbarMenuItem,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button
} from "@heroui/react";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FiMoreHorizontal, FiGithub } from "react-icons/fi";
import { CgDarkMode } from "react-icons/cg";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePostMetadata } from "@/stores/post";
import { Avatar } from "@/components/avatar";
import { navItems } from "@/data/navbar";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <NextNavbar onMenuOpenChange={setIsMenuOpen} classNames={{
            "base": "bg-white dark:bg-black bg-opacity-60 dark:bg-opacity-80",
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
                <NavbarDropdown />
            </NavbarContent>

            <NavbarMenu />
        </NextNavbar>
    )
}

function NavbarMenu() {
    const pathname = usePathname();
    const t = useTranslations("Navbar");

    return (
        <HeroNavbarMenu>
            {
                navItems.map((item, index) => (
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

function NavbarItems() {
    const pathname = usePathname();
    const t = useTranslations("Navbar");

    return (
        <NavbarContent justify="center">
            {
                navItems.map((item, index) => {
                    return (
                        <NavbarItem key={index} className="hidden sm:block">
                            <Link
                                color={pathname.includes(item.href) && pathname != "/" ? "primary" : "secondary"}
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

function NavbarBrand() {
    const t = useTranslations("Navbar");
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const { postMetadata } = usePostMetadata();

    const headTextY = useTransform(scrollY, [0, 100], [-6, -15])
    const contentTextY = useTransform(scrollY, [0, 100], [30, 0])
    const headTextOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
    const headTextScale = useTransform(scrollY, [0, 100], [1, 0.8])
    const contentTextOpacity = useTransform(scrollY, [0, 100], [0, 1])

    return (
        <>
            <Link disableAnimation href="/" color="foreground">
                <HeroNavbarBrand className="flex gap-4 font-bold">
                    <Avatar isMe />
                    {
                        pathname.includes("article/") || pathname === '/' ?
                            <>
                                <div className="flex pt-2 pb-4 justify-start overflow-hidden h-6">
                                    <motion.div
                                        className="absolute origin-left text-primary"
                                        translate="no"
                                        style={{
                                            y: headTextY,
                                            opacity: headTextOpacity,
                                            scale: headTextScale
                                        }}
                                    >
                                        Choneas
                                    </motion.div>
                                    <motion.div
                                        className="absolute truncate hover:text-clip text-secondary"
                                        style={{
                                            y: contentTextY,
                                            opacity: contentTextOpacity
                                        }}
                                    >
                                        {pathname.includes("article/") && postMetadata?.title}
                                        {pathname === '/' && t('tweets')}
                                    </motion.div>
                                </div>
                            </>
                            :
                            <p className="text-primary" translate="no">Choneas</p>
                    }
                </HeroNavbarBrand>
            </Link>
        </>
    )
}

function NavbarDropdown() {
    const t = useTranslations("Navbar-Dropdown")
    const router = useRouter()
    const [selectedLang, setSelectedLang] = useState<string>("Accept-Language")
    const [selectedTheme, setSelectedTheme] = useState<string>("system")

    useEffect(() => {
        const prefLang = document.cookie.match(/NEXT_PREF_LOCALE=([^;]+)/)?.[1]
        setSelectedLang(prefLang || "Accept-Language")
    }, [])

    const handleAction = (key: string | number) => {
        const keyStr = String(key)
        const langKeys = ["zh-CN", "en", "Accept-Language"]
        const themeKeys = ["light", "dark", "system"]

        if (langKeys.includes(keyStr)) {
            setSelectedLang(keyStr)
            if (keyStr === "Accept-Language") {
                document.cookie = `NEXT_PREF_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
                router.refresh()
            } else {
                document.cookie = `NEXT_PREF_LOCALE=${keyStr}; path=/`
                router.refresh()
            }
        } else if (themeKeys.includes(keyStr)) {
            setSelectedTheme(keyStr)
            // TODO: Handle theme change
        }
    }

    const isSelected = (key: string) => {
        return key === selectedLang || key === selectedTheme
    }

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button isIconOnly radius="full" variant="light" color="secondary">
                    <FiMoreHorizontal />
                </Button>
            </DropdownTrigger>

            <DropdownMenu
                disallowEmptySelection={false}
                closeOnSelect={false}
                selectionMode="multiple"
                onAction={handleAction}
                aria-label="Preferences"
                selectedKeys={new Set([selectedLang, selectedTheme])}
                disabledKeys={["light", "dark"]}
            >
                <DropdownSection title={t('prefer-language')}>
                    <DropdownItem 
                        className="font-code" 
                        key="zh-CN"
                        color={isSelected("zh-CN") ? "primary" : "default"}
                        variant={isSelected("zh-CN") ? "flat" : undefined}
                    >
                        zh-CN
                    </DropdownItem>
                    <DropdownItem 
                        className="font-code" 
                        key="en"
                        color={isSelected("en") ? "primary" : "default"}
                        variant={isSelected("en") ? "flat" : undefined}
                    >
                        en
                    </DropdownItem>
                    <DropdownItem 
                        className="font-code" 
                        key="Accept-Language"
                        color={isSelected("Accept-Language") ? "primary" : "default"}
                        variant={isSelected("Accept-Language") ? "flat" : undefined}
                    >
                        Accept-Language
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection title={t('prefer-color-scheme')}>
                    <DropdownItem 
                        key="light" 
                        className="h-[36]" 
                        startContent={<MdLightMode />} 
                        color={isSelected("light") ? "primary" : "default"}
                        variant={isSelected("light") ? "flat" : undefined}
                        textValue={t('light')}
                    >
                        <p>{t('light')}</p>
                    </DropdownItem>
                    <DropdownItem 
                        key="dark" 
                        className="h-[36]" 
                        startContent={<MdDarkMode />} 
                        color={isSelected("dark") ? "primary" : "default"}
                        variant={isSelected("dark") ? "flat" : undefined}
                        textValue={t('dark')}
                    >
                        <p>{t('dark')}</p>
                    </DropdownItem>
                    <DropdownItem 
                        key="system" 
                        className="h-[36]" 
                        startContent={<CgDarkMode />} 
                        color={isSelected("system") ? "primary" : "default"}
                        variant={isSelected("system") ? "flat" : undefined}
                        textValue={t('system')}
                    >
                        <p>{t('system')}</p>
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection title={t('view-on')}>
                    <DropdownItem
                        key="github"
                        classNames={{
                            wrapper: "hidden",
                            selectedIcon: "hidden"
                        }}
                    >
                        <Button
                            isExternal
                            as={Link}
                            href={"https://github.com/" + process.env.NEXT_PUBLIC_REPO}
                            color="primary"
                            variant="flat"
                            className="w-full text-primary"
                            size="sm"
                            startContent={<FiGithub />}
                        >
                            Github
                        </Button>
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}