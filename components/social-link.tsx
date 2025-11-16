import Link from "next/link";
import { Button } from "@heroui/react";
import type { SocialLink as SocialLinkProps } from "@/types/about";

export function SocialLink(link: SocialLinkProps) {
    const content = (
        <>
            {link.icon}
            <span className="font-bold">{link.platform}</span>
            {link.name && <span className="font-extralight">{link.name}</span>}
        </>
    );

    if (!link.href) {
        return (
            <Button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium">
                {content}
            </Button>
        );
    }

    return (
        <Button asChild>
            <Link
                href={link.href}
                className="inline-flex items-center justify-center gap-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium"
            >
                {content}
            </Link>
        </Button>
    )
}