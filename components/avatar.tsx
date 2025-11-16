import { Avatar as HeroAvatar } from "@heroui/react";

interface AvatarProps {
    isMe?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    src?: string;
    alt?: string;
    name?: string;
}

export function Avatar({ isMe, size = 'md', className, src, alt, name }: AvatarProps) {
    const avatarSrc = isMe ? "/avatars/choneas.png" : src;
    const avatarAlt = isMe ? "Choneas" : (alt || name || "User");
    const fallbackText = isMe ? "C" : (name ? name.charAt(0).toUpperCase() : "U");

    return (
        <HeroAvatar size={size} className={className}>
            {avatarSrc && (
                <HeroAvatar.Image 
                    src={avatarSrc} 
                    alt={avatarAlt}
                />
            )}
            <HeroAvatar.Fallback>
                {fallbackText}
            </HeroAvatar.Fallback>
        </HeroAvatar>
    )
}