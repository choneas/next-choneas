import { Avatar as NextAvatar, AvatarProps as NextAvatarProps } from "@heroui/react";

interface AvatarProps extends NextAvatarProps {
    isChoneas?: boolean;
}

export function Avatar({ isChoneas, ...props }: AvatarProps) {
    return (
        <NextAvatar 
            {...props} 
            name={isChoneas? "Choneas" : props.name}
            src={isChoneas ? "/avatars/choneas.png" : props.src}
        />
    )
}