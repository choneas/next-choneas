"use client"

import { Dropdown, Label, ListBox } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { navItems } from "@/data/navbar";

interface NavbarMobileMenuProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    pathname: string;
    translations: Record<string, string>;
}

/**
 * NavbarMobileMenu component
 * Mobile navigation menu using HeroUI Dropdown
 * Custom animated hamburger icon that transforms to X
 */
export function NavbarMobileMenu({ isOpen, onOpenChange, pathname, translations }: NavbarMobileMenuProps) {
    const router = useRouter();

    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <Dropdown.Trigger
                className="flex h-10 w-10 items-center justify-center transition-colors relative"
                aria-label="Navigation menu"
            >
                <div className="w-5 h-5 relative flex items-center justify-center">
                    {/* Top line */}
                    <motion.span
                        className="absolute w-5 border-t-[1.75px] border-accent"
                        style={{ borderRadius: "999px" }}
                        animate={isOpen ? {
                            rotate: 45,
                            y: 0
                        } : {
                            rotate: 0,
                            y: -3
                        }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                    {/* Bottom line */}
                    <motion.span
                        className="absolute w-5 border-t-[1.75px] border-accent"
                        style={{ borderRadius: "999px" }}
                        animate={isOpen ? {
                            rotate: -45,
                            y: 0
                        } : {
                            rotate: 0,
                            y: 3
                        }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    />
                </div>
            </Dropdown.Trigger>

            <Dropdown.Popover
                placement="top start"
                className="w-64 px-4 py-4"
            >
                <ListBox
                    aria-label="Navigation"
                    selectionMode="single"
                    onAction={(key) => {
                        router.push(String(key));
                        onOpenChange(false);
                    }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname.includes(item.href) && pathname !== "/";
                        return (
                            <ListBox.Item
                                key={item.href}
                                id={item.href}
                                textValue={translations[item.name]}
                                className={`text-accent ${isActive ? "font-bold" : ""}`}
                            >
                                <span className="text-accent">{item.icon}</span>
                                <Label className="text-accent">{translations[item.name]}</Label>
                            </ListBox.Item>
                        );
                    })}
                </ListBox>
            </Dropdown.Popover>
        </Dropdown>
    );
}
