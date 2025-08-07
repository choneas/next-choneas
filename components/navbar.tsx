"use client"

import {
    Navbar as NextNavbar, NavbarMenuToggle, NavbarBrand as HeroNavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu as HeroNavbarMenu, NavbarMenuItem,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Button, Spinner
} from "@heroui/react";
import { useState, useEffect, createContext, useContext } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FiMoreHorizontal, FiGithub } from "react-icons/fi";
import { CgDarkMode } from "react-icons/cg";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePostMetadata } from "@/stores/post";
import { Avatar } from "@/components/avatar";
import { navItems } from "@/data/navbar";

interface NavbarContextType {
    scrollY: MotionValue<number>;
    navbarBlur: MotionValue<number>;
    pathname: string;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

export function useNavbarContext() {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbarContext must be used within a NavbarProvider");
    }
    return context;
}

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    const navbarBlur = useTransform(scrollY, [0, 100], [0, 16]);
    const backdropFilterStyle = useTransform(navbarBlur, value => `blur(${value}px)`);
    const contextValue = {
        scrollY,
        navbarBlur,
        pathname
    };

    return (
        <NavbarContext.Provider value={contextValue}>
            <motion.div
                className="sticky top-0 inset-x-0 z-40"
                style={{
                    backdropFilter: pathname === '/' ? backdropFilterStyle : 'blur(16px)',
                    WebkitBackdropFilter: pathname === '/' ? backdropFilterStyle : 'blur(16px)',
                }}
            >
                <NextNavbar onMenuOpenChange={setIsMenuOpen} classNames={{
                    base: "bg-transparent backdrop-saturate-150 relative",
                    menu: "bg-white/60 dark:bg-black/80 gap-4",
                }}>
                    <NavbarContent justify="start">
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden"
                        />

                        <NavbarBrand />
                    </NavbarContent>

                    <NavbarContent className="absolute left-1/2 -translate-x-1/2 hidden sm:flex">
                        <NavbarItems />
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <NavbarDropdown />
                    </NavbarContent>

                    <NavbarMenu />
                </NextNavbar>
            </motion.div>
        </NavbarContext.Provider>
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
                            href={pathname.includes(item.href) && pathname != "/" ? "/" : item.href}
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
        <>
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
        </>
    )
}

function NavbarBrand() {
    const tm = useTranslations("Metadata")
    const { postMetadata } = usePostMetadata();
    const { scrollY, pathname } = useNavbarContext();

    const headTextY = useTransform(scrollY, [0, 100], [-6, -15])
    const contentTextY = useTransform(scrollY, [0, 100], [30, 0])
    const headTextOpacity = useTransform(scrollY, [0, 100], [1, 0.8])
    const headTextScale = useTransform(scrollY, [0, 100], [1, 0.8])
    const contentTextOpacity = useTransform(scrollY, [0, 100], [0, 1])

    return (
        <>
            <Link
                disableAnimation
                href="/"
                color="foreground"
            >
                <HeroNavbarBrand className="flex gap-4 font-bold">
                    <Avatar isMe />
                    {
                        pathname.includes("article/") ?
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
                                        {tm('name')}
                                    </motion.div>
                                    <motion.div
                                        className="absolute truncate text-ellipsis text-secondary max-w-48 md:max-w-[16rem]"
                                        style={{
                                            y: contentTextY,
                                            opacity: contentTextOpacity
                                        }}
                                    >
                                        {pathname.includes("article/") && postMetadata?.title}
                                        {/* 移除首页的二级标题显示 */}
                                    </motion.div>
                                </div>
                            </>
                            :
                            <p
                                className="text-primary"
                                translate="no"
                            >
                                {tm('name')}
                            </p>
                    }
                </HeroNavbarBrand>
            </Link>
        </>
    )
}

function NavbarDropdown() {
    const { setTheme } = useTheme()
    const t = useTranslations("Navbar-Dropdown")
    const router = useRouter()
    const [selectedLang, setSelectedLang] = useState<string>("Accept-Language")
    const [selectedTheme, setSelectedTheme] = useState<string>("system")
    const [loadingLang, setLoadingLang] = useState<string | null>(null)

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
            setLoadingLang(keyStr)
            if (keyStr === "Accept-Language") {
                document.cookie = `NEXT_PREF_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            } else {
                document.cookie = `NEXT_PREF_LOCALE=${keyStr}; path=/`
            }
            router.refresh()
            setTimeout(() => {
                setLoadingLang(null)
            }, 3200)
        } else if (themeKeys.includes(keyStr)) {
            setSelectedTheme(keyStr)
            if (keyStr === "light" || keyStr === "dark" || keyStr === "system") {
                setTheme(keyStr);
            }
        }
    }

    const isSelected = (key: string) => {
        return key === selectedLang || key === selectedTheme
    }

    return (
        <Dropdown
            placement="bottom-end"
            backdrop="opaque"
        >
            <DropdownTrigger>
                <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    color="secondary"
                    aria-label={t('preferences')}
                >
                    <FiMoreHorizontal size={24} />
                </Button>
            </DropdownTrigger>

            <DropdownMenu
                disallowEmptySelection={false}
                closeOnSelect={false}
                selectionMode="multiple"
                onAction={handleAction}
                aria-label="Preferences"
                selectedKeys={new Set([selectedLang, selectedTheme])}
            >
                <DropdownSection title={t('prefer-language')}>
                    <DropdownItem 
                        className="font-code" 
                        key="zh-CN"
                        color={isSelected("zh-CN") ? "primary" : "default"}
                        variant={isSelected("zh-CN") ? "flat" : undefined}
                        startContent={loadingLang === "zh-CN" && <Spinner size="sm" color="primary" />}
                    >
                        zh-CN
                    </DropdownItem>
                    <DropdownItem 
                        className="font-code" 
                        key="en"
                        color={isSelected("en") ? "primary" : "default"}
                        variant={isSelected("en") ? "flat" : undefined}
                        startContent={loadingLang === "en" && <Spinner size="sm" color="primary" />}
                    >
                        en
                    </DropdownItem>
                    <DropdownItem 
                        className="font-code" 
                        key="Accept-Language"
                        color={isSelected("Accept-Language") ? "primary" : "default"}
                        variant={isSelected("Accept-Language") ? "flat" : undefined}
                        startContent={loadingLang === "Accept-Language" && <Spinner size="sm" color="primary" />}
                    >
                        Accept-Language
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection title={t('prefer-color-scheme')}>
                    <DropdownItem 
                        key="light" 
                        className="max-h-[36px]" 
                        startContent={<MdLightMode />} 
                        color={isSelected("light") ? "primary" : "default"}
                        variant={isSelected("light") ? "flat" : undefined}
                        textValue={t('light')}
                    >
                        <p>{t('light')}</p>
                    </DropdownItem>
                    <DropdownItem 
                        key="dark" 
                        className="max-h-[36px]" 
                        startContent={<MdDarkMode />} 
                        color={isSelected("dark") ? "primary" : "default"}
                        variant={isSelected("dark") ? "flat" : undefined}
                        textValue={t('dark')}
                    >
                        <p>{t('dark')}</p>
                    </DropdownItem>
                    <DropdownItem 
                        key="system" 
                        className="max-h-[36px]" 
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