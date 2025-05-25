import { ReactNode } from "react";

export interface SocialLink {
    platform: string
    name?: string
    href?: string
    color?: string
    icon?: ReactNode
}

export interface TechStack {
    name: string
    icon: ReactNode
    href?: string
}
