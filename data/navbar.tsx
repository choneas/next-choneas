import { ReactNode } from 'react';

import { FaPenNib } from "react-icons/fa";
import { PiAtom } from "react-icons/pi";
import { FiInfo } from "react-icons/fi";

interface NavItem {
    name: string
    description?: string
    icon?: ReactNode
    href: string
}

const navItems: NavItem[] = [
    {
        name: "articles",
        icon: <FaPenNib />,
        href: "/article",
    },
    {
        name: "projects",
        icon: <PiAtom />,
        href: "/project",
    },
    {
        name: "about",
        icon: <FiInfo />,
        href: "/about",
    },
]

export { navItems }