"use client"

import { Link } from "@heroui/react";
import { navItems } from "@/data/navbar";

interface NavbarItemsProps {
    pathname: string;
    translations: Record<string, string>;
}

/**
 * NavbarItems 客户端组件
 * 显示桌面端导航链接
 * 接收预翻译的文本以支持 SSR
 */
export function NavbarItems({ pathname, translations }: NavbarItemsProps) {
    return (
        <>
            {
                navItems.map((item, index) => {
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex justify-start gap-2 text-base ${pathname.includes(item.href) && pathname !== "/" ? "font-bold" : ""}`}
                            underline="none"
                        >
                            {item.icon}
                            {translations[item.name]}
                        </Link>
                    )
                })
            }
        </>
    )
}
