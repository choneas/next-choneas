import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
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