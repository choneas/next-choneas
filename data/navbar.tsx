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
        icon: <FaPenNib size={24} />,
        href: "/article",
    },
    {
        name: "projects",
        icon: <PiAtom size={24} />,
        href: "/project",
    },
    {
        name: "about",
        icon: <FiInfo size={24} />,
        href: "/about",
    },
]

export { navItems }