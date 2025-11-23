import Image from "next/image";
import { Avatar as HeroAvatar } from "@heroui/react";

interface AvatarProps {
    isMe?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    src?: string;
    alt?: string;
    name?: string;
}

/**
 * Avatar component with Next.js Image optimization
 * Uses Next.js Image for automatic caching and optimization
 */
export function Avatar({ isMe, size = 'md', className, src, alt, name }: AvatarProps) {
    const avatarSrc = isMe ? "/avatars/choneas.png" : src;
    const avatarAlt = isMe ? "Choneas" : (alt || name || "User");
    const fallbackText = isMe ? "C" : (name ? name.charAt(0).toUpperCase() : "U");

    // Size mapping for Next.js Image
    const sizeMap = {
        sm: 32,
        md: 40,
        lg: 56
    };
    const imageSize = sizeMap[size];

    return (
        <HeroAvatar size={size} className={className}>
            {avatarSrc && (
                <HeroAvatar.Image asChild>
                    <Image
                        src={avatarSrc}
                        alt={avatarAlt}
                        width={imageSize}
                        height={imageSize}
                        priority={isMe} // Preload user's own avatar
                        quality={90}
                        unoptimized={false} // Enable Next.js optimization
                    />
                </HeroAvatar.Image>
            )}
            <HeroAvatar.Fallback>
                {fallbackText}
            </HeroAvatar.Fallback>
        </HeroAvatar>
    )
}