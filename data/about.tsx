import { ReactNode } from "react";

// Social
import { FaBilibili, FaBluesky, FaXTwitter, FaGithub, FaDiscord } from "react-icons/fa6";

// Teach Stack
import { FaReact, FaFigma, FaNodeJs, FaPython } from "react-icons/fa6";
import { SiNextdotjs, SiTypescript, SiMongodb, SiTailwindcss, SiShadcnui, SiNextui } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

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

export const socialLinks: SocialLink[] = [
    {
        platform: "Bilibili",
        name: "符华大人的小赤鸢",
        icon: <FaBilibili />,
        href: "https://space.bilibili.com/628078791",
    },
    {
        platform: "Discord",
        name: "Choneas",
        icon: <FaDiscord />,
    },
    {
        platform: "Github",
        icon: <FaGithub />,
        href: "https://github.com/Choneas"
    },
    {
        platform: "Bluesky",
        icon: <FaBluesky />,
        href: "https://bsky.app/profile/choneas.com"
    },
    {
        platform: "Twitter",
        icon: <FaXTwitter />,
        href: "https://x.com/littlephoenixxx"
    },
]

export const techStacks: TechStack[] = [
    {
        name: "React",
        icon: <FaReact />,
        href: "https://react.dev"
    },
    {
        name: "Python",
        icon: <FaPython />,
        href: "https://python.org"
    },
    {
        name: "TypeScript",
        icon: <SiTypescript />,
        href: "https://www.typescriptlang.org/"
    },
    {
        name: "Next.js",
        icon: <SiNextdotjs />,
        href: "https://nextjs.org"
    },
    {
        name: "Node.js",
        icon: <FaNodeJs />,
        href: "https://nodejs.org/"
    },
    {
        name: "VSCode",
        icon: <VscVscode />,
        href: "https://code.visualstudio.com"
    },
    {
        name: "MongoDB",
        icon: <SiMongodb />,
        href: "https://www.mongodb.com/"
    },
    {
        name: "Figma",
        icon: <FaFigma />,
        href: "https://figma.com"
    },
    {
        name: "ShadcnUI",
        icon: <SiShadcnui />,
        href: "https://ui.shadcn.com/"
    },
    {
        name: "NextUI",
        icon: <SiNextui />,
        href: "https://heroui.com/"
    },
    {
        name: "TailwindCSS",
        icon: <SiTailwindcss />,
        href: "https://tailwindcss.com/"
    }
]