import { estimatePageReadTime } from "notion-utils"
import type { ExtendedRecordMap } from "notion-types"
import { formatReadingTime } from "@/lib/format"

/**
 * Get formatted reading time for a Notion page
 * @param recordMap - The Notion page record map
 * @param locale - Current locale for translation
 * @returns Formatted reading time string (e.g., "5 分钟" or "5 minutes")
 */
export function getReadingTime(recordMap: ExtendedRecordMap, locale: string): string {
    const minutes = getReadingTimeMinutes(recordMap)
    // console.log('[getReadingTime] Calculated minutes:', minutes, 'for locale:', locale)
    return formatReadingTime(minutes, locale)
}

/**
 * Format reading time from minutes
 * @param minutes - Reading time in minutes
 * @param locale - Current locale for translation
 * @returns Formatted reading time string (e.g., "5 分钟" or "5 minutes")
 */
export function formatReadingTimeFromMinutes(minutes: number, locale: string): string {
    // console.log('[formatReadingTimeFromMinutes] Formatting', minutes, 'minutes for locale:', locale)
    return formatReadingTime(minutes, locale)
}

/**
 * Get raw reading time in minutes
 * @param recordMap - The Notion page record map
 * @returns Reading time in minutes
 */
export function getReadingTimeMinutes(recordMap: ExtendedRecordMap): number {
    const pageId = Object.keys(recordMap.block)[0]
    // console.log('[getReadingTimeMinutes] Processing pageId:', pageId)

    const block = recordMap.block[pageId]?.value

    if (!block) {
        // console.warn('[getReadingTimeMinutes] No block found for pageId:', pageId)
        return 1
    }

    // console.log('[getReadingTimeMinutes] Block type:', block.type, 'Block ID:', block.id)

    const estimate = estimatePageReadTime(block, recordMap)
    const minutes = Math.ceil(estimate.totalReadTimeInMinutes)

    // console.log('[getReadingTimeMinutes] Estimate:', {
    //     totalReadTimeInMinutes: estimate.totalReadTimeInMinutes,
    //     totalWordsReadTimeInMinutes: estimate.totalWordsReadTimeInMinutes,
    //     totalImageReadTimeInMinutes: estimate.totalImageReadTimeInMinutes,
    //     numImages: estimate.numImages,
    //     roundedMinutes: minutes
    // })

    return minutes
}
