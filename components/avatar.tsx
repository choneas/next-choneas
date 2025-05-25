import { Avatar as NextAvatar, AvatarProps as NextAvatarProps } from "@heroui/react";

interface AvatarProps extends NextAvatarProps {
    isMe?: boolean;
}

export function Avatar({ isMe, ...props }: AvatarProps) {
    return (
        <NextAvatar 
            {...props} 
            name={isMe? "Choneas" : props.name}
            src={isMe ? "/avatars/choneas.png" : props.src}
        />
    )
}