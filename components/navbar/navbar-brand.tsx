"use client"

import { Link } from "@heroui/react";
import { motion, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePostMetadata } from "@/stores/post";
import { Avatar } from "@/components/avatar";
import { useNavbarContext } from "./navbar-context";

/**
 * NavbarBrand 客户端组件
 * 显示品牌标识和动画效果
 * 需要客户端交互和动画，因此使用 "use client"
 */
export function NavbarBrand() {
    const tm = useTranslations("Metadata")
    const { postMetadata } = usePostMetadata();
    const { scrollY, pathname } = useNavbarContext();

    const headTextY = useTransform(scrollY, [0, 200], [-6, -15]);
    const contentTextY = useTransform(scrollY, [0, 200], [30, 0]);
    const headTextOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
    const headTextScale = useTransform(scrollY, [0, 200], [1, 0.8]);
    const contentTextOpacity = useTransform(scrollY, [0, 200], [0, 1]);

    return (
        <Link
            href="/"
            className="flex gap-4 font-bold"
            underline="none"
        >
            <Avatar isMe />
            {
                pathname.includes("article/") ?
                    <>
                        <div className="flex pt-2 pb-4 justify-start overflow-hidden h-6">
                            <motion.div
                                className="absolute origin-left"
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
                                className="absolute truncate text-ellipsis max-w-48 md:max-w-[16rem]"
                                style={{
                                    y: contentTextY,
                                    opacity: contentTextOpacity
                                }}
                            >
                                {pathname.includes("article/") && postMetadata?.title}
                            </motion.div>
                        </div>
                    </>
                    :
                    <p
                        translate="no"
                    >
                        {tm('name')}
                    </p>
            }
        </Link>
    )
}
