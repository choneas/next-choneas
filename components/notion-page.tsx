"use client"
import * as React from 'react'
import { Image, Link } from '@heroui/react'
import { type ExtendedRecordMap } from 'notion-types'
import { NotionRenderer } from 'react-notion-x'
import { useTheme } from 'next-themes'
import 'react-notion-x/src/styles.css'
import dynamic from 'next/dynamic'

export default function NotionPage({ recordMap, type }: { recordMap: ExtendedRecordMap, type?: "tweet-preview" | "tweet-details" }) {
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
                darkMode={resolvedTheme === 'dark'}
                fullPage={false}
                components={{
                    Code,
                    Collection,
                    Equation,
                    Modal,
                    Pdf,
                    Image: Image,
                    nextLink: Link
                }}
            />
            <style jsx global>{`
                .notion {
                    font-family: var(--font-serif);
                    --notion-max-width: 720px;
                }
                .notion-page {
                    width: 100%;
                    padding-left: 0%;
                    padding-right: 0%;
                }
                .notion-collection-page-properties {
                    display: none;
                }
                .notion-text {
                    font-size: 1.125rem;
                    line-height: 1.75rem;
                }
                .notion-inline-code {
                    font-family: var(--font-code);
                }
                .notion-asset-wrapper-image {
                    display: ${type === "tweet-preview" ? "none" : "unset"};
                }
            `}</style>
        </>
    )
}