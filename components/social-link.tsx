"use client" // TODO: HeroUI doesn't support SSR in React 19

import { Button, Link } from "@heroui/react";
import type { SocialLink as SocialLinkProps } from "@/types/about";

export function SocialLink(link: SocialLinkProps) {
    return (
        <Button
            isExternal
            as={Link}
            href={link.href!}
            startContent={link.icon}
            color="secondary"
        >
            <span className="font-bold">{link.platform}</span>
            {link.name &&  <span className="font-extralight">{link.name}</span>}
        </Button>
    )
}