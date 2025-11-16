"use client"

import { Button, Spinner, Popover, ListBox, Label, Link } from "@heroui/react";
import { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FiMoreHorizontal, FiGithub } from "react-icons/fi";
import { CgDarkMode } from "react-icons/cg";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CLIENT_LOCALES } from "@/lib/locales.client";

export function NavbarDropdown() {
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

    const handleLangChange = (key: React.Key) => {
        const keyStr = String(key)
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
    }

    const handleThemeChange = (key: React.Key) => {
        const keyStr = String(key)
        setSelectedTheme(keyStr)
        if (keyStr === "light" || keyStr === "dark" || keyStr === "system") {
            setTheme(keyStr);
        }
    }

    return (
        <Popover>
            <Button
                isIconOnly
                variant="ghost"
                aria-label={t('preferences')}
                id="navbar-preferences-button"
            >
                <FiMoreHorizontal size={24} />
            </Button>
            <Popover.Content placement="bottom" className="w-64">
                <Popover.Dialog>
                    <div className="flex flex-col gap-4 py-1">
                        {/* Language Section */}
                        <div>
                            <span className="pl-2 text-sm font-medium">{t('prefer-language')}</span>
                            <ListBox
                                aria-label="Language selection"
                                selectionMode="single"
                                selectedKeys={[selectedLang]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0]
                                    if (key) handleLangChange(key)
                                }}
                            >
                                {CLIENT_LOCALES.map((locale) => (
                                    <ListBox.Item
                                        key={locale}
                                        id={locale}
                                        textValue={locale}
                                        className={selectedLang === locale ? "bg-accent/10" : ""}
                                    >
                                        {loadingLang === locale && <Spinner size="sm" />}
                                        <Label className="font-mono text-sm">{locale}</Label>
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                                <ListBox.Item
                                    id="Accept-Language"
                                    textValue="Accept-Language"
                                    className={selectedLang === "Accept-Language" ? "bg-accent/10" : ""}
                                >
                                    {loadingLang === "Accept-Language" && <Spinner size="sm" />}
                                    <Label className="font-mono text-sm">Accept-Language</Label>
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            </ListBox>
                        </div>

                        {/* Theme Section */}
                        <div>
                            <span className="pl-2 text-sm font-medium">{t('prefer-color-scheme')}</span>
                            <ListBox
                                aria-label="Theme selection"
                                selectionMode="single"
                                selectedKeys={[selectedTheme]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0]
                                    if (key) handleThemeChange(key)
                                }}
                            >
                                <ListBox.Item
                                    id="light"
                                    textValue={t('light')}
                                    className={selectedTheme === "light" ? "bg-accent/10" : ""}
                                >
                                    <MdLightMode />
                                    <Label>{t('light')}</Label>
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item
                                    id="dark"
                                    textValue={t('dark')}
                                    className={selectedTheme === "dark" ? "bg-accent/10" : ""}
                                >
                                    <MdDarkMode />
                                    <Label>{t('dark')}</Label>
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item
                                    id="system"
                                    textValue={t('system')}
                                    className={selectedTheme === "system" ? "bg-accent/10" : ""}
                                >
                                    <CgDarkMode />
                                    <Label>{t('system')}</Label>
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            </ListBox>
                        </div>

                        {/* GitHub Link */}
                        <div className="px-2">
                            <span className="text-sm font-medium">{t('view-on')}</span>
                            <Button className="mt-2 w-full" variant="secondary">
                                <Link
                                    href={"https://github.com/" + process.env.NEXT_PUBLIC_REPO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="none"
                                    className="flex items-center gap-2"
                                >
                                    <FiGithub />
                                    Github
                                </Link>
                            </Button>
                        </div>
                    </div>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    )
}
