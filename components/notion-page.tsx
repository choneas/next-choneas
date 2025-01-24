"use client"
import * as React from 'react'
import { Image, Link } from '@heroui/react'
import { type ExtendedRecordMap } from 'notion-types'
import { uuidToId } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'
import { useTheme } from 'next-themes'
import 'react-notion-x/src/styles.css'
import dynamic from 'next/dynamic'

import '@/styles/notion.css'

export default function NotionPage({ recordMap }: { recordMap: ExtendedRecordMap }) {
    const { resolvedTheme } = useTheme();

    const Code = dynamic(() =>
        import('react-notion-x/build/third-party/code').then((m) => m.Code),
        {
            ssr: false
        }
    )
    const Collection = dynamic(() =>
        import('react-notion-x/build/third-party/collection').then(
            (m) => m.Collection
        ),
        {
            ssr: false
        }
    )
    const Equation = dynamic(() =>
        import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
    )
    const Pdf = dynamic(
        () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
        {
            ssr: false
        }
    )
    const Modal = dynamic(
        () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
        {
            ssr: false
        }
    )

    return (
        <>
            <NotionRenderer
                recordMap={recordMap}
                mapPageUrl={(pageId) => `/article/${uuidToId(pageId)}`}
                darkMode={resolvedTheme === 'dark'}
                fullPage={false}
                components={{
                    Code,
                    Collection,
                    Equation,
                    Modal,
                    Pdf,
                    nextImage: Image,
                    nextLink: Link
                }}
            />
        </>
    )
}