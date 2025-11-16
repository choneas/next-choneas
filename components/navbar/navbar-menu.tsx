"use client"

import { Link } from "@heroui/react";
import { navItems } from "@/data/navbar";

interface NavbarMenuProps {
    pathname: string;
    translations: Record<string, string>;
}

/**
 * NavbarMenu 客户端组件
 * 显示移动端菜单
 * 接收预翻译的文本以支持 SSR
 */
export function NavbarMenu({ pathname, translations }: NavbarMenuProps) {
    return (
        <div className="flex flex-col gap-2">
            {
                navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={pathname.includes(item.href) && pathname !== "/" ? "/" : item.href}
                        className={`flex justify-start gap-2 py-2 ${pathname.includes(item.href) && pathname !== "/" ? "font-bold" : ""}`}
                    >
                        {item.icon}
                        {translations[item.name]}
                    </Link>
                ))
            }
        </div>
    )
}
