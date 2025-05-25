// TODO: Finish TOC
"use client"

import { TableOfContentsEntry } from "notion-utils";
// import { Listbox, ListboxItem } from "@heroui/react";

export function TableOfContents({
    toc
}: {
    toc: TableOfContentsEntry[]
}) {
    if (!toc || toc.length === 0) {
        return null;
    }

    return (
        // <nav className="">
        //     <Listbox
        //         aria-label="Table of Contents"
        //         variant="flat"
        //         color="primary"
        //         className="border-content1 bg-background"
        //     >
        //         {toc.map((item) => (
        //             <ListboxItem key={item.id} href={`#${item.id}`}>{'  ' + item.text}</ListboxItem>
        //         ))}
        //     </Listbox>
        // </nav>
        <></>
    );
}