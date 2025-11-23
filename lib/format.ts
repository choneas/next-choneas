import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isToday);

export interface FormatConfig {
    today: string;
    yesterday: string;
    weekdays: string[];
    dateFormat: {
        sameYear: string;
        differentYear: string;
        full: string;
    };
    timeFormat: string;
}

// 配置缓存
const configCache = new Map<string, FormatConfig>();

/**
 * 同步加载语言配置
 */
function getFormatConfig(locale: string): FormatConfig {
    if (configCache.has(locale)) {
        return configCache.get(locale)!;
    }

    try {
        // 使用 require 同步加载
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const messages = require(`@/locales/${locale}.json`);
        const config: FormatConfig = messages.Format;
        configCache.set(locale, config);
        return config;
    } catch {
        console.warn(`Failed to load format config for locale "${locale}", falling back to English`);
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fallback = require('@/locales/en.json');
            const config: FormatConfig = fallback.Format;
            return config;
        } catch {
            // 最终后备方案
            return {
                today: 'Today',
                yesterday: 'Yesterday',
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dateFormat: {
                    sameYear: 'MMM D',
                    differentYear: 'MMM D, YYYY',
                    full: 'MMM D, YYYY'
                },
                timeFormat: 'HH:mm'
            };
        }
    }
}

/**
 * 检查两个日期是否在同一周（周一为起始）
 */
function isSameWeek(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    const monday1 = date1.startOf('day').subtract(date1.day() === 0 ? 6 : date1.day() - 1, 'day');
    const monday2 = date2.startOf('day').subtract(date2.day() === 0 ? 6 : date2.day() - 1, 'day');
    return monday1.isSame(monday2, 'day');
}

/**
 * 格式化日期 - 通用函数，支持服务端和客户端
 * @param date - 要格式化的日期
 * @param locale - 语言代码（如 'en', 'zh-CN', 'es'）
 * @param showTime - 是否显示时间
 * @param alias - 是否使用友好别名（如"今天"、"昨天"、星期几）
 * @returns 格式化后的日期字符串
 */
export function formatDate(
    date: Date,
    locale: string,
    showTime?: boolean,
    alias: boolean = true
): string {
    const config = getFormatConfig(locale);
    const d = dayjs(date);
    const now = dayjs();

    const dayjsLocale = locale.toLowerCase();
    dayjs.locale(dayjsLocale);

    if (d.isToday() && alias) {
        return config.today;
    }

    if (d.isSame(now.subtract(1, 'day'), 'day') && alias) {
        return config.yesterday;
    }

    if (isSameWeek(d, now) && alias) {
        return config.weekdays[d.day()];
    }

    const isSameYear = d.year() === now.year();
    const format = isSameYear && alias
        ? config.dateFormat.sameYear
        : config.dateFormat.differentYear;

    let result = d.format(format);

    if (showTime) {
        result += ' ' + d.format(config.timeFormat);
    }

    return result;
}

/**
 * 格式化相对时间（如 "2小时前"、"3天后"）
 */
export function formatRelativeTime(date: Date, locale: string): string {
    const dayjsLocale = locale.toLowerCase();
    dayjs.locale(dayjsLocale);
    return dayjs(date).fromNow();
}

/**
 * 格式化阅读时间
 * @param minutes - 阅读时间（分钟）
 * @param locale - 语言代码
 * @returns 格式化后的阅读时间字符串（如 "5 分钟"、"5 minutes"）
 */
export function formatReadingTime(minutes: number, locale: string): string {
    const dayjsLocale = locale.toLowerCase();
    dayjs.locale(dayjsLocale);
    return dayjs.duration(minutes, 'minutes').humanize();
}
