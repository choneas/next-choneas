"use client"

import { Navbar as NextNavbar, NavbarMenuToggle, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu as NextNavbarMenu, NavbarMenuItem } from "@heroui/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/avatar";

import { NavItems } from "@/data/navbar";

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <NextNavbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />

                <Link disableAnimation href="/" color="foreground" className={pathname === '/' ? 'hidden' : 'block'}>
                    <NavbarBrand className="flex gap-4 font-bold">
                        <Avatar isChoneas />
                        <p>Choneas</p>
                    </NavbarBrand>
                </Link>
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
        <NextNavbarMenu>
            {
                NavItems.map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link
                            color="foreground"
                            href={item.href}
                            className={`flex justify-start gap-2 ${item.href.includes(pathname) && pathname != "/" ? "font-bold" : ""}`}
                        >
                            {item.icon}
                            {t(item.name)}
                        </Link>
                    </NavbarMenuItem>
                ))
            }
        </NextNavbarMenu>
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
                                className={`flex justify-start gap-2 ${item.href.includes(pathname) && pathname != "/" ? "font-bold" : ""}`}
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