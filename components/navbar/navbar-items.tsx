"use client"

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { navItems } from "@/data/navbar";

interface NavbarItemsProps {
    pathname: string;
    translations: Record<string, string>;
}

/**
 * NavbarItems 客户端组件
 * 显示桌面端导航链接
 * 使用 HeroUI ghost 按钮，悬浮时展开显示文字
 * 支持 filled/outline 图标状态切换
 */
export function NavbarItems({ pathname, translations }: NavbarItemsProps) {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [collapseTimeout, setCollapseTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleExpand = (index: number) => {
        // Clear any pending timeout to allow smooth interruption
        if (collapseTimeout) {
            clearTimeout(collapseTimeout);
            setCollapseTimeout(null);
        }
        setExpandedIndex(index);
    };

    const handleCollapse = () => {
        // Clear any existing timeout first
        if (collapseTimeout) {
            clearTimeout(collapseTimeout);
        }
        // Delay collapse to allow smooth transition between items
        const timeout = setTimeout(() => {
            setExpandedIndex(null);
            setCollapseTimeout(null);
        }, 250);
        setCollapseTimeout(timeout);
    };

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (collapseTimeout) {
                clearTimeout(collapseTimeout);
            }
        };
    }, [collapseTimeout]);

    return (
        <div className="flex items-center gap-1">
            {navItems.map((item, index) => {
                const isActive = pathname.includes(item.href) && pathname !== "/";
                const isExpanded = expandedIndex === index;

                // Only use filled icon when on active page, not on hover
                const currentIcon = isActive ? item.icon.filled : item.icon.outline;

                return (
                    <Button
                        key={item.href}
                        variant="ghost"
                        onPress={() => router.push(item.href)}
                        onHoverStart={() => handleExpand(index)}
                        onHoverEnd={handleCollapse}
                        onFocus={() => handleExpand(index)}
                        onBlur={handleCollapse}
                        className={`navbar-ghost-btn h-12 p-4 min-h-0 min-w-0 text-accent rounded-full whitespace-nowrap outline-none focus-visible:shadow-[0_0_0_3px_var(--color-accent)] transition-all duration-300 ${isActive ? "font-bold" : ""}`}
                    >
                        <motion.div
                            className="flex items-center justify-center"
                            initial={false}
                            animate={{ gap: isExpanded ? "8px" : "0px" }}
                            transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        >
                            <motion.span
                                className="shrink-0 flex items-center justify-center text-accent"
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                            >
                                {currentIcon}
                            </motion.span>
                            <motion.span
                                initial={{ width: 0, opacity: 0 }}
                                animate={{
                                    width: isExpanded ? "auto" : 0,
                                    opacity: isExpanded ? 1 : 0
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                className="inline-block overflow-hidden whitespace-nowrap"
                            >
                                {translations[item.name]}
                            </motion.span>
                        </motion.div>
                    </Button>
                );
            })}
        </div>
    );
}
