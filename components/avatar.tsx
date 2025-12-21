import { Avatar as HeroAvatar } from "@heroui/react";
import type { Platform } from "@/types/content";

interface AvatarProps {
    platform?: Platform;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    src?: string;
    alt?: string;
    name?: string;
}

const STATIC_AVATARS: Record<string, string> = {
    notion: "/avatars/choneas.png",
    fallback: "/avatars/choneas.png",
};

export function Avatar({ platform, size = 'md', className, src, alt, name }: AvatarProps) {
    const avatarSrc = platform === 'notion'
        ? STATIC_AVATARS.notion
        : src || STATIC_AVATARS.fallback;

    const avatarAlt = alt || name || (platform ? `${platform} avatar` : "User");
    const fallbackText = name ? name.charAt(0).toUpperCase() : "C";

    return (
        <HeroAvatar size={size} className={className}>
            <HeroAvatar.Image
                src={avatarSrc}
                alt={avatarAlt}
                onError={(e) => {
                    if (platform !== 'notion' && src) {
                        const target = e.target as HTMLImageElement;
                        target.src = STATIC_AVATARS.fallback;
                    }
                }}
            />
            <HeroAvatar.Fallback>
                {fallbackText}
            </HeroAvatar.Fallback>
        </HeroAvatar>
    )
}
