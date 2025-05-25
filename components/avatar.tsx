import { Avatar as HeroAvatar, AvatarProps as HeroAvatarProps } from "@heroui/react";

interface AvatarProps extends HeroAvatarProps {
    isMe?: boolean; // TODO: Being remove
}

export function Avatar({ isMe, ...props }: AvatarProps) {
    return (
        <HeroAvatar
            {...props}
            name={isMe ? "Choneas" : props.name}
            src={isMe ? "/avatars/choneas.png" : props.src}
        />
    )
}