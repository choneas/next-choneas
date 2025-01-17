"use client"
import NotionPage from '@/components/notion-page'
import { useEffect, useState } from 'react'
import { ExtendedRecordMap } from 'notion-types'

export default function StandalonePage({ params }: { params: { id: string } }) {
    const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null)

    useEffect(() => {
        fetch(`/api/notion/${params.id}`)
            .then(res => res.json())
            .then(data => setRecordMap(data))
    }, [params.id])

    if (!recordMap) return null

    return (
        <div style={{ height: '100vh', margin: 0, padding: 0 }}>
            <NotionPage recordMap={recordMap} />
        </div>
    )
}
