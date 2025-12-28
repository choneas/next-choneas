import { Avatar as HeroAvatar } from "@heroui/react";

interface AvatarProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    name?: string;
}

const AVATAR_SRC = "/avatars/choneas.png";

export function Avatar({ size = 'md', className, name = "Choneas" }: AvatarProps) {
    return (
        <HeroAvatar size={size} className={className}>
            <HeroAvatar.Image
                src={AVATAR_SRC}
                alt={name}
            />
            <HeroAvatar.Fallback>
                C
            </HeroAvatar.Fallback>
        </HeroAvatar>
    )
}
